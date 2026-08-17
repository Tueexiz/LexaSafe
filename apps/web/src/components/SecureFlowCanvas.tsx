"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import type { Group, ShaderMaterial } from "three";

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
    float ribbon = sin(uv.x * 9.0 + uTime * 0.55 + uv.y * 2.2) * 0.5 + 0.5;
    float lanes = smoothstep(0.15, 0.85, fract(uv.y * 7.0 - uTime * 0.12 + ribbon * 0.18));
    vec3 cream = vec3(0.984, 0.973, 0.957);
    vec3 accent = vec3(0.518, 0.686, 0.984);
    vec3 navy = vec3(0.008, 0.349, 0.867);
    vec3 color = mix(cream, accent, lanes * 0.42);
    color = mix(color, navy, ribbon * 0.08);
    gl_FragColor = vec4(color, 0.42);
  }
`;

function FlowField() {
  const material = useRef<ShaderMaterial>(null);
  const uniforms = useMemo(() => ({ uTime: { value: 0 } }), []);

  useFrame((_, delta) => {
    if (material.current) {
      material.current.uniforms.uTime.value += delta;
    }
  });

  return (
    <mesh position={[0, 0, -3]} scale={[14, 9, 1]}>
      <planeGeometry args={[1, 1, 24, 24]} />
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

function DataPackets() {
  const group = useRef<Group>(null);

  useFrame((state) => {
    if (!group.current) return;
    group.current.rotation.y = state.clock.elapsedTime * 0.12;
    group.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.18) * 0.12;
  });

  return (
    <group ref={group}>
      {Array.from({ length: 14 }, (_, i) => {
        const a = (i / 14) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(a) * 2.4, Math.sin(a * 1.4) * 0.9, Math.sin(a) * 1.6]}>
            <sphereGeometry args={[0.055, 12, 12]} />
            <meshStandardMaterial
              color={i % 3 === 0 ? "#0259DD" : "#84AFFB"}
              emissive={i % 3 === 0 ? "#0259DD" : "#84AFFB"}
              emissiveIntensity={0.35}
            />
          </mesh>
        );
      })}
    </group>
  );
}

function Scene() {
  return (
    <>
      <color attach="background" args={["#FBF8F4"]} />
      <ambientLight intensity={0.85} />
      <directionalLight position={[4, 6, 3]} intensity={1.1} color="#84AFFB" />
      <FlowField />
      {/* Plug-in Meshy: replace the wireframe with <primitive object={gltf.scene} /> from useGLTF('/models/meshy-asset.glb'). */}
      {/* Plug-in Luma: swap FlowField for a video texture (THREE.VideoTexture) once luma.ts returns assets.video. */}
      <Float speed={1.1} rotationIntensity={0.25} floatIntensity={0.45}>
        <mesh>
          <icosahedronGeometry args={[1.35, 1]} />
          <meshStandardMaterial color="#0259DD" wireframe transparent opacity={0.38} />
        </mesh>
      </Float>
      <DataPackets />
    </>
  );
}

export function SecureFlowCanvas() {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 6.2], fov: 42 }}
      gl={{ antialias: true, alpha: true }}
      style={{ pointerEvents: "none" }}
    >
      <Scene />
    </Canvas>
  );
}
