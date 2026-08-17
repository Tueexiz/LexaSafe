import "server-only";

import { fal } from "@fal-ai/client";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { PRODUCT_DEMO_PROMPT } from "./storyboard";

/**
 * ByteDance Seedance 1.5 Pro via the official @fal-ai/client:
 *   fal.subscribe("fal-ai/bytedance/seedance/v1.5/pro/text-to-video", { input, logs, onQueueUpdate })
 *
 * Env (server-only, never NEXT_PUBLIC_*):
 *   FAL_KEY           — official fal.ai key (preferred by the SDK)
 *   SEEDANCE_API_KEY  — alias accepted here
 *   ARK_API_KEY       — BytePlus / Volcengine fallback
 *   SEEDANCE_PROVIDER — "fal" | "ark" (default fal)
 */
export const SEEDANCE_FAL_MODEL = "fal-ai/bytedance/seedance/v1.5/pro/text-to-video";

export type SeedanceProvider = "fal" | "ark";

export type SeedanceAspectRatio = "21:9" | "16:9" | "4:3" | "1:1" | "3:4" | "9:16" | "auto";
export type SeedanceResolution = "480p" | "720p" | "1080p";
export type SeedanceDuration = "4" | "5" | "6" | "7" | "8" | "9" | "10" | "11" | "12";

export interface CreateSeedanceVideoInput {
  prompt: string;
  aspect_ratio?: SeedanceAspectRatio;
  resolution?: SeedanceResolution;
  duration?: SeedanceDuration;
  generate_audio?: boolean;
  camera_fixed?: boolean;
  seed?: number;
}

export interface SeedanceVideoFile {
  url: string;
  content_type?: string;
  file_name?: string;
  file_size?: number;
}

export interface SeedanceFalOutput {
  video: SeedanceVideoFile;
  seed?: number;
}

export interface SeedanceGeneration {
  provider: SeedanceProvider;
  requestId: string;
  status: "queued" | "in_progress" | "completed" | "failed";
  video?: SeedanceVideoFile | null;
  seed?: number;
  error?: string;
}

export class SeedanceApiError extends Error {
  readonly status: number;
  readonly body: string;

  constructor(status: number, body: string) {
    super(`Seedance API error ${status}: ${body}`);
    this.name = "SeedanceApiError";
    this.status = status;
    this.body = body;
  }
}

export function getSeedanceProvider(): SeedanceProvider {
  const explicit = process.env.SEEDANCE_PROVIDER?.trim().toLowerCase();
  if (explicit === "ark") return "ark";
  if (explicit === "fal") return "fal";
  if (process.env.ARK_API_KEY && !process.env.FAL_KEY && !process.env.SEEDANCE_API_KEY) return "ark";
  return "fal";
}

export function getSeedanceKey(): string | undefined {
  const provider = getSeedanceProvider();
  if (provider === "ark") {
    return process.env.SEEDANCE_API_KEY || process.env.ARK_API_KEY;
  }
  return process.env.FAL_KEY || process.env.SEEDANCE_API_KEY;
}

export function isSeedanceConfigured(): boolean {
  return Boolean(getSeedanceKey());
}

function requireKey(): string {
  const key = getSeedanceKey();
  if (!key) {
    throw new Error(
      "FAL_KEY (or SEEDANCE_API_KEY) is not set. Add it to the server environment (never NEXT_PUBLIC_*)."
    );
  }
  return key;
}

function configureFal() {
  fal.config({ credentials: requireKey() });
}

function falInput(input: CreateSeedanceVideoInput) {
  return {
    prompt: input.prompt,
    aspect_ratio: input.aspect_ratio ?? "16:9",
    resolution: input.resolution ?? "720p",
    duration: input.duration ?? "12",
    generate_audio: input.generate_audio ?? true,
    camera_fixed: input.camera_fixed ?? false,
    enable_safety_checker: true,
    ...(typeof input.seed === "number" ? { seed: input.seed } : {}),
  };
}

/** Official fal subscribe — waits until the video is ready. */
export async function subscribeSeedanceVideo(
  input: CreateSeedanceVideoInput
): Promise<{ data: SeedanceFalOutput; requestId: string }> {
  configureFal();
  const result = await fal.subscribe(SEEDANCE_FAL_MODEL, {
    input: falInput(input),
    logs: true,
    onQueueUpdate: (update) => {
      if (update.status === "IN_PROGRESS" && "logs" in update && Array.isArray(update.logs)) {
        update.logs.map((log) => log.message).forEach((message) => {
          if (message) console.info("[seedance]", message);
        });
      }
    },
  });
  const data = result.data as SeedanceFalOutput;
  if (!data?.video?.url) {
    throw new SeedanceApiError(500, JSON.stringify(result.data ?? {}));
  }
  return { data, requestId: result.requestId };
}

export async function createSeedanceVideo(input: CreateSeedanceVideoInput): Promise<SeedanceGeneration> {
  if (getSeedanceProvider() === "ark") {
    return createArkVideo(input);
  }

  configureFal();
  const submitted = await fal.queue.submit(SEEDANCE_FAL_MODEL, {
    input: falInput(input),
  });

  return {
    provider: "fal",
    requestId: submitted.request_id,
    status: "queued",
  };
}

export async function getSeedanceGeneration(requestId: string): Promise<SeedanceGeneration> {
  if (getSeedanceProvider() === "ark") {
    return getArkVideo(requestId);
  }

  configureFal();
  const status = await fal.queue.status(SEEDANCE_FAL_MODEL, { requestId, logs: true });
  const normalized = status.status?.toUpperCase() ?? "";

  if (normalized === "COMPLETED") {
    const result = await fal.queue.result(SEEDANCE_FAL_MODEL, { requestId });
    return {
      provider: "fal",
      requestId,
      status: "completed",
      video: result.data?.video ?? null,
      seed: result.data?.seed,
    };
  }
  if (normalized === "FAILED" || normalized === "CANCELLED") {
    return {
      provider: "fal",
      requestId,
      status: "failed",
      error: "Generation failed",
    };
  }
  return {
    provider: "fal",
    requestId,
    status: normalized === "IN_PROGRESS" ? "in_progress" : "queued",
  };
}

export async function waitForSeedanceVideo(requestId: string): Promise<SeedanceGeneration> {
  const started = Date.now();
  while (Date.now() - started < 240_000) {
    const current = await getSeedanceGeneration(requestId);
    if (current.status === "completed" || current.status === "failed") return current;
    await new Promise((resolve) => setTimeout(resolve, 4_000));
  }
  throw new SeedanceApiError(408, `Timed out waiting for Seedance request ${requestId}`);
}

function arkBase() {
  return (
    process.env.SEEDANCE_ARK_BASE_URL?.replace(/\/$/, "") ||
    "https://ark.ap-southeast.bytepluses.com/api/v3"
  );
}

function arkHeaders() {
  return {
    Authorization: `Bearer ${requireKey()}`,
    Accept: "application/json",
    "Content-Type": "application/json",
  };
}

async function createArkVideo(input: CreateSeedanceVideoInput): Promise<SeedanceGeneration> {
  const model = process.env.SEEDANCE_ARK_MODEL || "seedance-1-5-pro-251215";
  const duration = Number(input.duration ?? "8");
  const res = await fetch(`${arkBase()}/contents/generations/tasks`, {
    method: "POST",
    headers: arkHeaders(),
    body: JSON.stringify({
      model,
      content: [{ type: "text", text: input.prompt }],
      duration,
      ratio: input.aspect_ratio ?? "16:9",
      generate_audio: input.generate_audio ?? true,
    }),
  });
  if (!res.ok) {
    throw new SeedanceApiError(res.status, await res.text());
  }
  const data = (await res.json()) as { id?: string };
  if (!data.id) {
    throw new SeedanceApiError(500, JSON.stringify(data));
  }
  return { provider: "ark", requestId: data.id, status: "queued" };
}

async function getArkVideo(requestId: string): Promise<SeedanceGeneration> {
  const res = await fetch(`${arkBase()}/contents/generations/tasks/${encodeURIComponent(requestId)}`, {
    headers: arkHeaders(),
  });
  if (!res.ok) {
    throw new SeedanceApiError(res.status, await res.text());
  }
  const data = (await res.json()) as {
    status?: string;
    content?: { video_url?: string };
    error?: { message?: string };
  };
  const status = (data.status ?? "").toLowerCase();
  if (status === "succeeded" || status === "completed") {
    const url = data.content?.video_url;
    return {
      provider: "ark",
      requestId,
      status: "completed",
      video: url ? { url } : null,
    };
  }
  if (status === "failed") {
    return {
      provider: "ark",
      requestId,
      status: "failed",
      error: data.error?.message ?? "Generation failed",
    };
  }
  return {
    provider: "ark",
    requestId,
    status: status === "running" ? "in_progress" : "queued",
  };
}

export async function downloadSeedanceVideo(url: string): Promise<Buffer> {
  const res = await fetch(url);
  if (!res.ok) {
    throw new SeedanceApiError(res.status, await res.text());
  }
  return Buffer.from(await res.arrayBuffer());
}

export function productDemoOutputPath() {
  return path.join(process.cwd(), "public", "demo", "lexasafe-product.mp4");
}

export async function generateAndSaveProductDemo(options?: {
  prompt?: string;
  duration?: SeedanceDuration;
}): Promise<{ generation: SeedanceGeneration; savedPath?: string; data?: SeedanceFalOutput }> {
  const input: CreateSeedanceVideoInput = {
    prompt: options?.prompt ?? PRODUCT_DEMO_PROMPT,
    duration: options?.duration ?? "12",
    aspect_ratio: "16:9",
    resolution: "720p",
    generate_audio: true,
  };

  if (getSeedanceProvider() === "ark") {
    const created = await createSeedanceVideo(input);
    const generation = await getArkVideo(created.requestId);
    if (generation.status !== "completed" || !generation.video?.url) {
      return { generation };
    }
    const buffer = await downloadSeedanceVideo(generation.video.url);
    const savedPath = productDemoOutputPath();
    await mkdir(path.dirname(savedPath), { recursive: true });
    await writeFile(savedPath, buffer);
    return { generation, savedPath: "/demo/lexasafe-product.mp4" };
  }

  const { data, requestId } = await subscribeSeedanceVideo(input);
  const buffer = await downloadSeedanceVideo(data.video.url);
  const savedPath = productDemoOutputPath();
  await mkdir(path.dirname(savedPath), { recursive: true });
  await writeFile(savedPath, buffer);

  return {
    data,
    generation: {
      provider: "fal",
      requestId,
      status: "completed",
      video: data.video,
      seed: data.seed,
    },
    savedPath: "/demo/lexasafe-product.mp4",
  };
}

export const SEEDANCE_SIGNUP = {
  fal: "https://fal.ai/models/fal-ai/bytedance/seedance/v1.5/pro/text-to-video",
  falKeys: "https://fal.ai/dashboard/keys",
  byteplus: "https://docs.byteplus.com/en/docs/ModelArk/what_is_modelark",
  volcengine: "https://www.volcengine.com/docs/82379",
  seedance: "https://seed.bytedance.com/en/seedance1_5_pro",
} as const;
