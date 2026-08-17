import "server-only";

export type AiProviderId = "gemini" | "luma" | "meshy" | "seedance";

export type AiEnvStatus = Record<AiProviderId, boolean>;

/** Presence only — never return key values to the client. */
export function getAiEnvStatus(): AiEnvStatus {
  return {
    gemini: Boolean(process.env.GEMINI_API_KEY),
    luma: Boolean(process.env.LUMA_API_KEY),
    meshy: Boolean(process.env.MESHY_API_KEY),
    seedance: Boolean(process.env.SEEDANCE_API_KEY || process.env.FAL_KEY || process.env.ARK_API_KEY),
  };
}
