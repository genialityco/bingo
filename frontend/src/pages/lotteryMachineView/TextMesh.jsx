import { extend } from "@react-three/fiber";
import * as React from "react";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";
import { FontLoader } from "three/addons/loaders/FontLoader.js";
import helvetiker from "./fonts/helvetiker_regular.typeface.json";

const font = new FontLoader().parse(helvetiker);

export function TextMesh({ numero = 5 }) {
  extend({ TextGeometry });
  return (
    <mesh position={[0, 0.2, 0]}>
      <textGeometry
        args={[numero, { font, size: 0.25, depth: 1, color: "blue" }]}
      />

      <meshBasicMaterial color="green" />
    </mesh>
  );
}
