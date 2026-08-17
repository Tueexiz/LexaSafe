import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { WebHeader } from "@/components/WebHeader";

const HeroRequisition = dynamic(
  () => import("@/components/HeroRequisition").then((m) => m.HeroRequisition),
  { ssr: false, loading: () => <div className="min-h-[100dvh] bg-[#FBF8F4]" /> }
);

export const metadata = {
  title: "POC Hero réquisition",
  description: "Proof of concept Lenis / GSAP / R3F pour le hero LexaSafe — hors homepage marketing.",
  robots: { index: false, follow: false },
};

export default function PocPage() {
  return (
    <>
      <WebHeader />
      <div className="pointer-events-none fixed left-4 top-24 z-[1100] md:left-8">
        <Link
          href="/setup"
          className="pointer-events-auto inline-flex items-center gap-2 rounded-pill border border-white/60 bg-white/70 px-4 py-2 font-syne text-xs font-semibold text-blue-navy shadow-capsule backdrop-blur-xl"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
          Setup APIs
        </Link>
      </div>
      <HeroRequisition />
    </>
  );
}
