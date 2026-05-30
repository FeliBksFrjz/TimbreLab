"use client";

import { useRef, useState, useEffect } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { RoundedBox, ContactShadows, Environment } from "@react-three/drei";
import * as THREE from "three";

function PedalMesh() {
  const meshRef = useRef<THREE.Group>(null);
  const texture = useLoader(THREE.TextureLoader, "/images/cube-baby.png.png");
  const [hovered, setHovered] = useState(false);
  
  // Rotação inicial ajustada: leve inclinação para trás (-0.3) e lateral (0.2)
  const baseRotationRef = useRef({ x: -0.3, y: 0.2 });

  useEffect(() => {
    // Definir a rotação inicial assim que montar
    if (meshRef.current) {
      meshRef.current.rotation.x = baseRotationRef.current.x;
      meshRef.current.rotation.y = baseRotationRef.current.y;
    }
  }, []);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    // Rotação contínua 1 volta a cada 60s
    if (!hovered) {
      baseRotationRef.current.y += (Math.PI * 2 / 60) * delta;
    }

    if (hovered) {
      // Inclinação interativa suave ao passar o mouse
      const targetRotX = baseRotationRef.current.x - state.pointer.y * 0.2;
      const targetRotY = baseRotationRef.current.y + state.pointer.x * 0.2;
      
      meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, targetRotX, 0.1);
      meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, targetRotY, 0.1);
    } else {
      // Retorno suave à rotação base
      meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, baseRotationRef.current.x, 0.1);
      meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, baseRotationRef.current.y, 0.1);
    }
  });

  return (
    <group 
      ref={meshRef} 
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Corpo principal (preto fosco, sem reflexo) */}
      <RoundedBox args={[5, 0.2, 2]} radius={0.05} smoothness={4}>
        <meshStandardMaterial color="#1a1a1a" roughness={1} metalness={0} />
      </RoundedBox>
      
      {/* Textura no topo - Proporção ajustada para caber no box de 5x2 */}
      {/* A altura Y é 0.101 pois a altura total do box é 0.2 (0.1 para cima a partir do centro) */}
      <mesh position={[0, 0.101, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[4.9, 1.9]} />
        <meshStandardMaterial map={texture} transparent={true} roughness={1} metalness={0} />
      </mesh>
    </group>
  );
}

export function CubeBaby3D() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <div className="w-full max-w-[800px] h-[500px] mx-auto bg-transparent relative mb-10" />;
  }

  return (
    <div className="w-full max-w-[800px] h-[500px] mx-auto bg-transparent relative mb-10">
      <Canvas
        camera={{ position: [0, 2.5, 4], fov: 45 }}
        style={{ background: "transparent" }}
        shadows
      >
        {/* Luz ambiente suave */}
        <ambientLight intensity={0.4} />
        {/* Luz direcional centralizada de cima */}
        <directionalLight 
          position={[2, 10, 5]} 
          intensity={1.2} 
          castShadow 
          shadow-mapSize={[1024, 1024]}
        />
        
        <PedalMesh />
        
        {/* Sombra base um pouco mais abaixo para acomodar o ângulo */}
        <ContactShadows 
          position={[0, -0.8, 0]} 
          opacity={0.6} 
          scale={15} 
          blur={2.5} 
          far={4} 
        />
        
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}
