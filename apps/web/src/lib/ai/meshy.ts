import "server-only";

/**
 * Meshy.ai 3D generation (text-to-3D preview + poll).
 * Docs: https://docs.meshy.ai/api/text-to-3d
 * Keys: https://www.meshy.ai/settings/api
 */
const MESHY_API_BASE = "https://api.meshy.ai/openapi";

export type MeshyTaskStatus = "PENDING" | "IN_PROGRESS" | "SUCCEEDED" | "FAILED" | "CANCELED";

export type MeshyArtStyle = "realistic" | "sculpture";

export interface CreateMeshyPreviewInput {
  prompt: string;
  art_style?: MeshyArtStyle;
  negative_prompt?: string;
  should_remesh?: boolean;
  target_polycount?: number;
  target_formats?: Array<"glb" | "fbx" | "obj" | "usdz" | "stl">;
}

export interface MeshyTask {
  result?: string;
  id?: string;
  status?: MeshyTaskStatus;
  progress?: number;
  model_urls?: {
    glb?: string;
    fbx?: string;
    obj?: string;
    usdz?: string;
  } | null;
  task_error?: { message?: string } | null;
}

export class MeshyApiError extends Error {
  readonly status: number;
  readonly body: string;

  constructor(status: number, body: string) {
    super(`Meshy API error ${status}: ${body}`);
    this.name = "MeshyApiError";
    this.status = status;
    this.body = body;
  }
}

function requireMeshyKey(): string {
  const apiKey = process.env.MESHY_API_KEY;
  if (!apiKey) {
    throw new Error("MESHY_API_KEY is not set. Add it to the server environment (never NEXT_PUBLIC_*).");
  }
  return apiKey;
}

async function meshyFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${MESHY_API_BASE}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${requireMeshyKey()}`,
      Accept: "application/json",
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  if (!res.ok) {
    throw new MeshyApiError(res.status, await res.text());
  }

  return (await res.json()) as T;
}

export async function createMeshyTextTo3dPreview(input: CreateMeshyPreviewInput): Promise<MeshyTask> {
  return meshyFetch<MeshyTask>("/v2/text-to-3d", {
    method: "POST",
    body: JSON.stringify({
      mode: "preview",
      prompt: input.prompt,
      art_style: input.art_style ?? "realistic",
      negative_prompt: input.negative_prompt,
      should_remesh: input.should_remesh ?? true,
      target_polycount: input.target_polycount,
      target_formats: input.target_formats ?? ["glb"],
    }),
  });
}

export function getMeshyTextTo3dTask(id: string): Promise<MeshyTask> {
  return meshyFetch<MeshyTask>(`/v2/text-to-3d/${encodeURIComponent(id)}`);
}

export async function createMeshyTextTo3dRefine(previewTaskId: string, enablePbr = true): Promise<MeshyTask> {
  return meshyFetch<MeshyTask>("/v2/text-to-3d", {
    method: "POST",
    body: JSON.stringify({
      mode: "refine",
      preview_task_id: previewTaskId,
      enable_pbr: enablePbr,
    }),
  });
}
