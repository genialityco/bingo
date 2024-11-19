import React, { useRef, useEffect } from "react";
import { useBox } from "@react-three/cannon";
import * as THREE from "three";

function BoxWithLines() {
  const [ref] = useBox(() => ({
    args: [2, 2, 2],
    mass: 0,
    position: [0, 1, 0],
  }));

  useEffect(() => {
    if (ref.current) {
      const boxGeometry = new THREE.BoxGeometry(2, 2, 2);
      const edges = new THREE.EdgesGeometry(boxGeometry);
      const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
      const lineSegments = new THREE.LineSegments(edges, lineMaterial);

      ref.current.add(lineSegments);

      return () => {
        if (ref.current) {
          ref.current.remove(lineSegments);
        }
        boxGeometry.dispose();
        edges.dispose();
        lineMaterial.dispose();
      };
    }
  }, [ref]);

  return (
    <mesh ref={ref}>
      <boxGeometry args={[2, 2, 2]} />
      <meshPhysicalMaterial
        color="skyblue"
        transparent
        opacity={0.5}
        transmission={0.9}
        roughness={0}
        metalness={0}
        clearcoat={1}
        clearcoatRoughness={0}
      />
    </mesh>
  );
}

export default BoxWithLines;
