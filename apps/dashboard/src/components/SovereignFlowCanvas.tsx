"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import type { Group, Mesh, ShaderMaterial } from "three";

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform float uTime;
  varying vec2 vUv;

  void main() {
    vec2 uv = vUv * 2.0 - 1.0;
    float wave = sin(uv.x * 7.5 - uTime * 0.7 + uv.y * 3.0) * 0.5 + 0.5;
    float grid = smoothstep(0.08, 0.78, fract(uv.x * 11.0 + uTime * 0.18));
    vec3 cream = vec3(0.984, 0.973, 0.957);
    vec3 accent = vec3(0.518, 0.686, 0.984);
    vec3 navy = vec3(0.008, 0.349, 0.867);
    vec3 color = mix(cream, accent, grid * 0.38);
    color = mix(color, navy, wave * 0.12);
    gl_FragColor = vec4(color, 0.34);
  }
`;

function FlowPlane() {
  const material = useRef<ShaderMaterial>(null);
  const uniforms = useMemo(() => ({ uTime: { value: 0 } }), []);

  useFrame((_, delta) => {
    if (material.current) material.current.uniforms.uTime.value += delta;
  });

  return (
    <mesh position={[0, 0.2, -4]} scale={[16, 7, 1]}>
      <planeGeometry args={[1, 1, 20, 20]} />
      <shaderMaterial
        ref={material}
        transparent
        depthWrite={false}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
      />
    </mesh>
  );
}

function OrbitPackets() {
  const group = useRef<Group>(null);

  useFrame((state) => {
    if (!group.current) return;
    group.current.rotation.y = state.clock.elapsedTime * 0.16;
    group.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.22) * 0.08;
  });

  return (
    <group ref={group} position={[2.2, 0.15, 0]}>
      {Array.from({ length: 12 }, (_, i) => {
        const a = (i / 12) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(a) * 1.7, Math.sin(a * 1.8) * 0.55, Math.sin(a) * 1.1]}>
            <sphereGeometry args={[0.045, 10, 10]} />
            <meshStandardMaterial
              color={i % 2 === 0 ? "#0259DD" : "#84AFFB"}
              emissive={i % 2 === 0 ? "#0259DD" : "#84AFFB"}
              emissiveIntensity={0.4}
            />
          </mesh>
        );
      })}
    </group>
  );
}

function SealRing() {
  const mesh = useRef<Mesh>(null);

  useFrame((state) => {
    if (!mesh.current) return;
    mesh.current.rotation.x = Math.PI / 2.4;
    mesh.current.rotation.z = state.clock.elapsedTime * 0.22;
  });

  return (
    <Float speed={0.9} rotationIntensity={0.15} floatIntensity={0.28}>
      <mesh ref={mesh} position={[-1.8, 0.1, 0]}>
        <torusGeometry args={[1.05, 0.028, 12, 64]} />
        <meshStandardMaterial color="#0259DD" transparent opacity={0.55} />
      </mesh>
      <mesh position={[-1.8, 0.1, 0]}>
        <icosahedronGeometry args={[0.55, 0]} />
        <meshStandardMaterial color="#84AFFB" wireframe transparent opacity={0.45} />
      </mesh>
    </Float>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.9} />
      <directionalLight position={[5, 4, 6]} intensity={1.05} color="#84AFFB" />
      <FlowPlane />
      <SealRing />
      <OrbitPackets />
    </>
  );
}

export function SovereignFlowCanvas() {
  return (
    <Canvas
      dpr={[1, 1.35]}
      camera={{ position: [0, 0, 6], fov: 38 }}
      gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
      style={{ pointerEvents: "none" }}
      fallback={null}
    >
      <Scene />
    </Canvas>
  );
}
