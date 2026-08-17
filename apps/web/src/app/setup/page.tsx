import { AmbientBackground } from "@lexasafe/ui";
import { WebHeader } from "@/components/WebHeader";
import { ApiSetup } from "@/components/ApiSetup";
import { getAiEnvStatus } from "@/lib/ai/env";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Configuration APIs IA",
  description: "Onboarding des clés Gemini, Luma, Meshy et Seedance pour LexaSafe (présence uniquement, jamais les secrets).",
  robots: { index: false, follow: false },
};

export default function SetupPage() {
  const status = getAiEnvStatus();

  return (
    <>
      <AmbientBackground />
      <WebHeader />
      <ApiSetup status={status} />
    </>
  );
}
