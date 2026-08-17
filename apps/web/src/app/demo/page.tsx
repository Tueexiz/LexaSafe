import { existsSync } from "node:fs";
import path from "node:path";
import { AmbientBackground } from "@lexasafe/ui";
import { WebHeader } from "@/components/WebHeader";
import { DemoExperience } from "@/components/DemoExperience";
import { isSeedanceConfigured } from "@/lib/ai/seedance";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Démo produit",
  description: "Film Seedance de la plateforme LexaSafe et demande de démonstration guidée.",
};

export default function DemoPage() {
  const videoPath = path.join(process.cwd(), "public", "demo", "lexasafe-product.mp4");
  const hasVideo = existsSync(videoPath);
  const seedanceReady = isSeedanceConfigured();

  return (
    <>
      <AmbientBackground />
      <WebHeader />
      <DemoExperience hasVideo={hasVideo} seedanceReady={seedanceReady} />
    </>
  );
}
