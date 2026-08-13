"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "./utils";

export function AmbientBackground({ className }: { className?: string }) {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;
    const onMove = (e: MouseEvent) => setMouse({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [reducedMotion]);

  return (
    <div
      className={cn("pointer-events-none fixed inset-0 z-0 overflow-hidden", className)}
      aria-hidden="true"
    >
      <div
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(10, 25, 47, 0.03) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(10, 25, 47, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
          maskImage:
            "radial-gradient(circle at 50% 30%, black 40%, transparent 85%)",
          WebkitMaskImage:
            "radial-gradient(circle at 50% 30%, black 40%, transparent 85%)",
        }}
      />
      <div
        className="absolute h-[700px] w-[700px] rounded-full transition-transform duration-100 ease-out"
        style={{
          background:
            "radial-gradient(circle, rgba(29, 78, 216, 0.07) 0%, rgba(37, 99, 235, 0.02) 50%, transparent 70%)",
          transform: reducedMotion
            ? "translate(calc(50vw - 350px), calc(30vh - 350px))"
            : `translate(calc(${mouse.x}px - 350px), calc(${mouse.y * 0.5}px - 350px))`,
        }}
      />
      <MeshGradientFallback reducedMotion={reducedMotion} mouse={mouse} />
    </div>
  );
}

function MeshGradientFallback({
  reducedMotion,
  mouse,
}: {
  reducedMotion: boolean;
  mouse: { x: number; y: number };
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || reducedMotion) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let frame: number;
    let t = 0;

    function resize() {
      canvas!.width = window.innerWidth;
      canvas!.height = window.innerHeight;
    }

    function draw() {
      t += 0.003;
      const w = canvas!.width;
      const h = canvas!.height;
      const grad = ctx!.createRadialGradient(
        mouse.x * 0.3 + w * 0.5 + Math.sin(t) * 80,
        mouse.y * 0.2 + h * 0.3 + Math.cos(t) * 60,
        0,
        w * 0.5,
        h * 0.5,
        Math.max(w, h) * 0.8
      );
      grad.addColorStop(0, "rgba(219, 234, 254, 0.35)");
      grad.addColorStop(0.5, "rgba(239, 246, 255, 0.15)");
      grad.addColorStop(1, "rgba(248, 250, 252, 0)");
      ctx!.clearRect(0, 0, w, h);
      ctx!.fillStyle = grad;
      ctx!.fillRect(0, 0, w, h);
      frame = requestAnimationFrame(draw);
    }

    resize();
    draw();
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
    };
  }, [reducedMotion, mouse.x, mouse.y]);

  if (reducedMotion) return null;

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 opacity-70"
      aria-hidden="true"
    />
  );
}
