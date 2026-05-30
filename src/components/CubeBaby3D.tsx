'use client'

import React, { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { RoundedBox, Text } from '@react-three/drei'
import * as THREE from 'three'

function CubeBabyModel() {
  const groupRef = useRef<THREE.Group>(null)

  const mouse = useRef({ x: 0, y: 0 })
  const clockStart = useRef<number | null>(null)

  const knobs = useMemo(
    () => [
      { label: 'VOLUME', led: null },
      { label: 'IR CAB', led: '#00ff00' },
      { label: 'REVERB', led: '#00ff00' },
      { label: 'MIX', led: '#ffffff' },
      { label: 'FB', led: '#ffffff' },
      { label: 'TIME', led: '#ffffff' },
      { label: 'MOD', led: '#ffffff' },
      { label: 'TONE', led: '#ffb300' },
      { label: 'GAIN', led: '#ffb300' },
      { label: 'TYPE', led: null },
    ],
    []
  )

  useFrame((state) => {
    if (!groupRef.current) return

    const elapsed = state.clock.getElapsedTime()

    if (clockStart.current === null) {
      clockStart.current = elapsed
    }

    const time = elapsed - clockStart.current
    const duration = 2

    const pointerX = state.pointer.x * THREE.MathUtils.degToRad(10)
    const pointerY = state.pointer.y * THREE.MathUtils.degToRad(10)

    mouse.current.x = THREE.MathUtils.lerp(
      mouse.current.x,
      pointerX,
      0.06
    )

    mouse.current.y = THREE.MathUtils.lerp(
      mouse.current.y,
      pointerY,
      0.06
    )

    let introRotationX = 0

    if (time < duration) {
      const t = time / duration

      // easeOutBack (overshoot suave)
      const c1 = 1.70158
      const c3 = c1 + 1

      const eased =
        1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2)

      introRotationX = THREE.MathUtils.lerp(
        -Math.PI / 2,
        0,
        eased
      )
    }

    groupRef.current.rotation.x =
      introRotationX + mouse.current.y * 0.35

    groupRef.current.rotation.y =
      mouse.current.x * 0.35
  })

  return (
    <group ref={groupRef} position={[0, -0.1, 0]}>
      {/* Borda/outline por trás do corpo principal */}
      <RoundedBox
        args={[16.16, 8.16, 1.95]}
        radius={0.24}
        smoothness={8}
        position={[0, 0, -0.04]}
      >
        <meshStandardMaterial
          color="#3a3d42"
          metalness={0.4}
          roughness={0.5}
        />
      </RoundedBox>

      {/* Corpo principal */}
      <RoundedBox
        args={[16, 8, 2]}
        radius={0.22}
        smoothness={8}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial
          color="#2a2d32"
          metalness={0.5}
          roughness={0.4}
        />
      </RoundedBox>

      {/* Parafusos superiores */}
      {[[-7.2, 3.5], [7.2, 3.5]].map(([x, y], i) => (
        <mesh key={i} position={[x, y, 1.05]} castShadow>
          <cylinderGeometry args={[0.18, 0.18, 0.08, 24]} />
          <meshStandardMaterial
            color="#c0c0c0"
            metalness={1}
            roughness={0.2}
          />
        </mesh>
      ))}

      {/* Knobs */}
      {knobs.map((knob, i) => {
        const spacing = 1.42
        const startX = -6.4
        const x = startX + i * spacing
        const y = 1.9

        return (
          <group key={knob.label}>
            {/* LED */}
            {knob.led && (
              <group position={[x, y + 0.95, 1.06]}>
                <mesh>
                  <sphereGeometry args={[0.12, 16, 16]} />
                  <meshStandardMaterial
                    color={knob.led}
                    emissive={knob.led}
                    emissiveIntensity={4}
                  />
                </mesh>

                <pointLight
                  color={knob.led}
                  intensity={1.2}
                  distance={1.4}
                />
              </group>
            )}

            {/* Knob */}
            <group position={[x, y, 1.08]}>
              <mesh castShadow>
                <cylinderGeometry args={[0.42, 0.42, 0.35, 32]} />
                <meshStandardMaterial
                  color="#2a2d32"
                  metalness={0.3}
                  roughness={0.75}
                />
              </mesh>

              {/* Borda do knob */}
              <mesh castShadow>
                <torusGeometry args={[0.42, 0.05, 12, 32]} />
                <meshStandardMaterial
                  color="#6a6f7a"
                  metalness={0.6}
                  roughness={0.4}
                />
              </mesh>

              {/* Linha indicadora */}
              <mesh position={[0, 0.22, 0.18]}>
                <boxGeometry args={[0.03, 0.18, 0.02]} />
                <meshStandardMaterial color="white" />
              </mesh>
            </group>

            {/* Label knob */}
            <Text
              position={[x, y - 0.78, 1.08]}
              fontSize={0.22}
              color="white"
              anchorX="center"
              anchorY="middle"
            >
              {knob.label}
            </Text>
          </group>
        )
      })}

      {/* Footswitches */}
      {[
        { x: -5.7, label: 'A' },
        { x: 0, label: 'B' },
        { x: 5.7, label: 'C' },
      ].map((foot, i) => (
        <group key={i}>
          {/* LED branco */}
          <group position={[foot.x, -1.35, 1.08]}>
            <mesh>
              <sphereGeometry args={[0.12, 16, 16]} />
              <meshStandardMaterial
                color="#ffffff"
                emissive="#ffffff"
                emissiveIntensity={3}
              />
            </mesh>

            <pointLight
              color="#ffffff"
              intensity={0.7}
              distance={1.2}
            />
          </group>

          {/* Corpo footswitch */}
          <mesh
            position={[foot.x, -3, 1.18]}
            castShadow
            receiveShadow
          >
            <cylinderGeometry args={[0.9, 0.9, 0.45, 40]} />
            <meshStandardMaterial
              color="#d0d0d0"
              metalness={1}
              roughness={0.1}
            />
          </mesh>

          {/* Topo cônico cromado */}
          <mesh position={[foot.x, -2.82, 1.34]} castShadow>
            <cylinderGeometry args={[0.28, 0.5, 0.35, 40]} />
            <meshStandardMaterial
              color="#e5e5e5"
              metalness={1}
              roughness={0.08}
            />
          </mesh>

          {/* Label */}
          <Text
            position={[foot.x, -4.2, 1.08]}
            fontSize={0.4}
            color="white"
            anchorX="center"
            anchorY="middle"
          >
            {foot.label}
          </Text>
        </group>
      ))}
    </group>
  )
}

export default function CubeBaby3D() {
  return (
    <div
      style={{
        width: '100%',
        maxWidth: '700px',
        aspectRatio: '16 / 9',
        margin: '0 auto',
      }}
    >
      <Canvas
        shadows
        camera={{
          position: [0, 0, 18],
          fov: 38,
        }}
        style={{
          width: '100%',
          height: '100%',
          background: 'transparent',
        }}
        gl={{ antialias: true }}
      >
        {/* Iluminação */}
        <ambientLight intensity={0.8} />

        {/* Luz principal superior */}
        <pointLight
          position={[8, 8, 10]}
          intensity={3}
          castShadow
        />

        {/* Luz lateral */}
        <pointLight
          position={[-6, 2, 5]}
          intensity={0.6}
        />

        {/* Luz inferior para os footswitches */}
        <pointLight
          position={[-8, -4, 8]}
          intensity={1.5}
        />

        {/* Rim Light (Luz de contorno traseira) */}
        <pointLight
          position={[0, 0, -5]}
          color="#444444"
          intensity={2}
        />

        <CubeBabyModel />
      </Canvas>
    </div>
  )
}
