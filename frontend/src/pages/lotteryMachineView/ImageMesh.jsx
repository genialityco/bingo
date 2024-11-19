import { extend, useLoader } from "@react-three/fiber";
import * as React from "react";
import { TextureLoader } from "three";

export function ImageMesh({ imageUrl, width = 1, height = 1 }) {
  const texture = useLoader(TextureLoader, imageUrl);

  return (
    <mesh position={[0, 0.5, 0]}>
      <planeGeometry args={[width, height]} />
      <meshBasicMaterial map={texture} />
    </mesh>
  );
}
