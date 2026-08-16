import Link from "next/link";

export function BrandMark({
  href = "/",
  inverted = false,
  className = "",
}: {
  href?: string;
  inverted?: boolean;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-2.5 ${className}`}
    >
      <img
        src="/brand/lexasafe-mark.png"
        alt=""
        width={32}
        height={32}
        className={`relative z-[1] h-8 w-8 object-contain ${inverted ? "rounded-md bg-white p-0.5" : ""}`}
      />
      <span
        className={`relative z-[1] font-syne text-lg font-extrabold tracking-tight ${
          inverted ? "text-white" : "text-blue-navy"
        }`}
      >
        LEXASAFE
      </span>
    </Link>
  );
}

export function BrandLockup({ className = "h-auto w-[200px]" }: { className?: string }) {
  return (
    <img
      src="/brand/lexasafe-lockup.png"
      alt="LexaSafe — Conformité juridique souveraine · Écosystème souverain"
      width={652}
      height={415}
      className={className}
    />
  );
}
