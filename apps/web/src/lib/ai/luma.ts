import "server-only";

/**
 * Luma Dream Machine API (video).
 * Docs: https://docs.lumalabs.ai/docs/video-generation
 * Keys: https://platform.lumalabs.ai
 *
 * Newer Agents API (optional later): POST https://agents.lumalabs.ai/v1/generations
 */
const LUMA_API_BASE = "https://api.lumalabs.ai/dream-machine/v1";

export type LumaGenerationState = "queued" | "dreaming" | "completed" | "failed";

export type LumaAspectRatio = "16:9" | "9:16" | "1:1" | "4:3" | "3:4" | "21:9" | "9:21";

export interface CreateLumaVideoInput {
  prompt: string;
  model?: "ray-2" | "ray-flash-2" | "ray-1-6" | string;
  resolution?: "540p" | "720p" | "1080p" | "4k" | string;
  duration?: "5s" | "9s" | string;
  aspect_ratio?: LumaAspectRatio;
  loop?: boolean;
}

export interface LumaGeneration {
  id: string;
  state?: LumaGenerationState;
  failure_reason?: string | null;
  assets?: {
    video?: string | null;
  } | null;
}

export class LumaApiError extends Error {
  readonly status: number;
  readonly body: string;

  constructor(status: number, body: string) {
    super(`Luma API error ${status}: ${body}`);
    this.name = "LumaApiError";
    this.status = status;
    this.body = body;
  }
}

function requireLumaKey(): string {
  const apiKey = process.env.LUMA_API_KEY;
  if (!apiKey) {
    throw new Error("LUMA_API_KEY is not set. Add it to the server environment (never NEXT_PUBLIC_*).");
  }
  return apiKey;
}

async function lumaFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${LUMA_API_BASE}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${requireLumaKey()}`,
      Accept: "application/json",
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  if (!res.ok) {
    throw new LumaApiError(res.status, await res.text());
  }

  return (await res.json()) as T;
}

export function createLumaVideo(input: CreateLumaVideoInput): Promise<LumaGeneration> {
  return lumaFetch<LumaGeneration>("/generations", {
    method: "POST",
    body: JSON.stringify({
      prompt: input.prompt,
      model: input.model ?? "ray-2",
      resolution: input.resolution ?? "720p",
      duration: input.duration ?? "5s",
      aspect_ratio: input.aspect_ratio ?? "16:9",
      loop: input.loop ?? false,
    }),
  });
}

export function getLumaGeneration(id: string): Promise<LumaGeneration> {
  return lumaFetch<LumaGeneration>(`/generations/${encodeURIComponent(id)}`);
}
