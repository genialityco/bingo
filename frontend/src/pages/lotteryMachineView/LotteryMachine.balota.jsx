import React, { useRef, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as THREE from "three";

const Model = ({ customizeBalls }) => {
  const group = useRef();
  const [model, setModel] = useState(null);
  const ball = useRef(null);

  useEffect(() => {
    const loader = new GLTFLoader();
    loader.load(
      "/models3d/pelota.glb",
      (gltf) => {
        gltf.scene.scale.set(0.05, 0.05, 0.05);
        gltf.scene.position.set(0, -1.5, 0);
        setModel(gltf.scene);

        // Identificar y personalizar la pelota
        gltf.scene.traverse((node) => {
          if (node.isMesh) {
            ball.current = node;
            if (customizeBalls) {
              node.material = new THREE.MeshStandardMaterial({
                color: customizeBalls.color,
                roughness: customizeBalls.roughness,
                metalness: customizeBalls.metalness,
              });
            }
          }
        });
      },
      undefined,
      (error) => {
        console.error("Error loading GLTF model:", error);
      }
    );
  }, [customizeBalls]);

  return model ? <primitive object={model} ref={group} dispose={null} /> : null;
};

const App = () => {
  const [customizeBalls, setCustomizeBalls] = useState({
    color: "#0000ff",
    roughness: 0.5,
    metalness: 0.5,
  });

  const handleBallCustomization = (e) => {
    const { name, value } = e.target;
    setCustomizeBalls((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <Canvas
        camera={{ position: [0, 1, 5], fov: 45 }}
        style={{ width: "100vw", height: "100vh" }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 10]} />
        <Model customizeBalls={customizeBalls} />
        <OrbitControls />
      </Canvas>
      <div style={{ position: "absolute", top: "80px", left: "20px", zIndex: 1 }}>
        <div style={{ marginTop: "20px" }}>
          <label>
            Color:
            <input
              type="color"
              name="color"
              value={customizeBalls.color}
              onChange={handleBallCustomization}
            />
          </label>
          <label>
            Roughness:
            <input
              type="range"
              name="roughness"
              min="0"
              max="1"
              step="0.1"
              value={customizeBalls.roughness}
              onChange={handleBallCustomization}
            />
          </label>
          <label>
            Metalness:
            <input
              type="range"
              name="metalness"
              min="0"
              max="1"
              step="0.1"
              value={customizeBalls.metalness}
              onChange={handleBallCustomization}
            />
          </label>
        </div>
      </div>
    </>
  );
};

export default App;
