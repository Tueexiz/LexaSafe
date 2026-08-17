import { NextResponse } from "next/server";
import {
  generateAndSaveProductDemo,
  getSeedanceGeneration,
  getSeedanceProvider,
  isSeedanceConfigured,
  SEEDANCE_SIGNUP,
  SeedanceApiError,
} from "@/lib/ai/seedance";
import { PRODUCT_DEMO_PROMPT, PRODUCT_DEMO_STORYBOARD } from "@/lib/ai/storyboard";

export const runtime = "nodejs";
export const maxDuration = 300;

function allowGenerate() {
  return process.env.NODE_ENV !== "production" || process.env.SEEDANCE_ALLOW_HTTP === "true";
}

export async function GET() {
  return NextResponse.json({
    configured: isSeedanceConfigured(),
    provider: getSeedanceProvider(),
    signup: SEEDANCE_SIGNUP,
    storyboard: PRODUCT_DEMO_STORYBOARD,
    publicVideo: "/demo/lexasafe-product.mp4",
  });
}

export async function POST(request: Request) {
  if (!allowGenerate()) {
    return NextResponse.json({ error: "Generation HTTP is disabled in production." }, { status: 403 });
  }
  if (!isSeedanceConfigured()) {
    return NextResponse.json(
      {
        error: "Seedance is not configured.",
        signup: SEEDANCE_SIGNUP,
      },
      { status: 503 }
    );
  }

  const body = (await request.json().catch(() => ({}))) as {
    prompt?: string;
    requestId?: string;
  };

  try {
    if (body.requestId) {
      const generation = await getSeedanceGeneration(body.requestId);
      return NextResponse.json({ generation });
    }
    const result = await generateAndSaveProductDemo({
      prompt: body.prompt || PRODUCT_DEMO_PROMPT,
    });
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof SeedanceApiError) {
      return NextResponse.json({ error: error.message, body: error.body }, { status: error.status });
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Seedance generation failed" },
      { status: 500 }
    );
  }
}
