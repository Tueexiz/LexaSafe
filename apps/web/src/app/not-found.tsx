import Link from "next/link";
import { ShieldX, Home, Send } from "lucide-react";
import { AmbientBackground } from "@lexasafe/ui";
import { WebHeader } from "@/components/WebHeader";
import { getMessages } from "@/i18n/server";

export default async function NotFound() {
  const { t } = await getMessages();
  const n = t.notFound;

  return (
    <>
      <AmbientBackground />
      <WebHeader />
      <main className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 pt-24 text-center">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl border border-crimson-border bg-crimson-bg text-crimson-threat">
          <ShieldX className="h-10 w-10" />
        </div>
        <div className="font-display text-7xl font-extrabold text-crimson-threat">404</div>
        <h1 className="mt-4 font-display text-2xl font-bold text-blue-navy md:text-4xl">{n.title}</h1>
        <p className="mt-4 max-w-lg text-text-secondary">{n.text}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link href="/" className="inline-flex items-center gap-2 rounded-pill bg-blue-primary px-6 py-3 font-semibold text-white">
            <Home className="h-4 w-4" />
            {n.home}
          </Link>
          <Link href="/acces" className="inline-flex items-center gap-2 rounded-pill border border-border-medium bg-white px-6 py-3 font-semibold text-blue-navy">
            <Send className="h-4 w-4" />
            {n.access}
          </Link>
        </div>
      </main>
    </>
  );
}
