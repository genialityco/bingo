import React, { useEffect } from "react";
import { useSphere, useBox } from "@react-three/cannon";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

function BouncingBall() {
  const [ref, api] = useSphere(() => ({
    mass: 1,
    position: [0, 0.1, 0], // Posición inicial en la base del cubo
    args: [0.1],
  }));

  // Definimos las paredes del cubo
  const [leftWallRef] = useBox(() => ({ args: [0.1, 2, 2], position: [-1, 1, 0] }));
  const [rightWallRef] = useBox(() => ({ args: [0.1, 2, 2], position: [1, 1, 0] }));
  const [frontWallRef] = useBox(() => ({ args: [2, 2, 0.1], position: [0, 1, -1] }));
  const [backWallRef] = useBox(() => ({ args: [2, 2, 0.1], position: [0, 1, 1] }));
  const [topWallRef] = useBox(() => ({ args: [2, 0.1, 2], position: [0, 2, 0] }));
  const [bottomWallRef] = useBox(() => ({ args: [2, 0.1, 2], position: [0, 0, 0] }));

  // Aplicar fuerza inicial
  useEffect(() => {
    api.velocity.set(2, 5, 2); // Velocidad inicial para la pelota
  }, [api]);

  // Aplicar fuerza continua para mantener la pelota en movimiento
  useFrame(() => {
    api.applyForce([0, -10, 0], [0, 0, 0]); // Simular gravedad
  });

  return (
    <>
      <mesh ref={ref}>
        <sphereGeometry args={[0.1, 32, 32]} />
        <meshStandardMaterial
          color="red"
          roughness={0.1}
          metalness={0.8}
          emissive="darkred"
          emissiveIntensity={0.5}
        />
      </mesh>
      {/* Paredes del cubo */}
      <mesh ref={leftWallRef} />
      <mesh ref={rightWallRef} />
      <mesh ref={frontWallRef} />
      <mesh ref={backWallRef} />
      <mesh ref={topWallRef} />
      <mesh ref={bottomWallRef} />
    </>
  );
}

export default BouncingBall;
