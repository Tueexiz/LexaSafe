"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "./utils";

export function AmbientBackground({ className }: { className?: string }) {
  const [liteMode, setLiteMode] = useState(true);
  const [glow, setGlow] = useState({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setLiteMode(!finePointer || reducedMotion);
  }, []);

  useEffect(() => {
    if (liteMode) return;

    const onMove = (e: MouseEvent) => {
      target.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", onMove, { passive: true });

    let raf = 0;
    const tick = () => {
      current.current.x += (target.current.x - current.current.x) * 0.065;
      current.current.y += (target.current.y - current.current.y) * 0.065;
      setGlow({ x: current.current.x, y: current.current.y });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [liteMode]);

  return (
    <div
      className={cn("pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#FBF8F4]", className)}
      aria-hidden="true"
    >
      {/* Dégradé principal : blanc chaud → bleu ciel qui fond doucement */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 90% 70% at 50% 0%, rgba(255, 255, 255, 0.95) 0%, transparent 55%),
            radial-gradient(ellipse 80% 60% at 85% 40%, rgba(132, 175, 251, 0.22) 0%, transparent 50%),
            radial-gradient(ellipse 70% 55% at 15% 65%, rgba(132, 175, 251, 0.14) 0%, transparent 45%),
            linear-gradient(180deg, #FFFFFF 0%, #FBF8F4 45%, #F5F9FF 100%)
          `,
        }}
      />

      <div
        className="absolute inset-0 opacity-35 max-md:opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(10, 25, 47, 0.018) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(10, 25, 47, 0.018) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
          maskImage: "radial-gradient(circle at 50% 30%, black 30%, transparent 75%)",
          WebkitMaskImage: "radial-gradient(circle at 50% 30%, black 30%, transparent 75%)",
        }}
      />

      <div
        className="absolute h-[900px] w-[900px] rounded-full transition-none max-md:h-[520px] max-md:w-[520px]"
        style={{
          background:
            "radial-gradient(circle, rgba(132, 175, 251, 0.18) 0%, rgba(255, 255, 255, 0.08) 35%, transparent 70%)",
          transform: liteMode
            ? "translate(calc(50vw - 450px), calc(20vh - 450px))"
            : `translate(calc(${glow.x}px - 450px), calc(${glow.y * 0.4}px - 450px))`,
        }}
      />

      {!liteMode && (
        <div
          className="absolute h-[700px] w-[700px] animate-ambient-drift-b rounded-full max-md:hidden"
          style={{
            top: "15%",
            left: "55%",
            background:
              "radial-gradient(circle, rgba(132, 175, 251, 0.12) 0%, rgba(251, 248, 244, 0.06) 45%, transparent 72%)",
          }}
        />
      )}

      {!liteMode && <MeshGradient glow={glow} />}
    </div>
  );
}

function MeshGradient({ glow }: { glow: { x: number; y: number } }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glowRef = useRef(glow);
  glowRef.current = glow;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let frame = 0;
    let t = 0;
    let visible = !document.hidden;

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas!.width = Math.floor(window.innerWidth * dpr);
      canvas!.height = Math.floor(window.innerHeight * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function draw() {
      if (!visible) {
        frame = requestAnimationFrame(draw);
        return;
      }
      t += 0.0035;
      const w = window.innerWidth;
      const h = window.innerHeight;
      const g = glowRef.current;
      const cx = g.x * 0.35 + w * 0.5 + Math.sin(t) * 60;
      const cy = g.y * 0.25 + h * 0.32 + Math.cos(t * 0.8) * 45;
      const grad = ctx!.createRadialGradient(cx, cy, 0, w * 0.5, h * 0.5, Math.max(w, h) * 0.75);
      grad.addColorStop(0, "rgba(132, 175, 251, 0.16)");
      grad.addColorStop(0.4, "rgba(255, 255, 255, 0.35)");
      grad.addColorStop(0.75, "rgba(251, 248, 244, 0.12)");
      grad.addColorStop(1, "rgba(251, 248, 244, 0)");
      ctx!.clearRect(0, 0, w, h);
      ctx!.fillStyle = grad;
      ctx!.fillRect(0, 0, w, h);
      frame = requestAnimationFrame(draw);
    }

    const onVisibility = () => {
      visible = !document.hidden;
    };

    resize();
    draw();
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 hidden opacity-75 md:block"
      aria-hidden="true"
    />
  );
}
