import React, { useRef, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as THREE from "three";

const Model = ({ customizeBalls, mixBalls, extractBall }) => {
  const group = useRef();
  const [model, setModel] = useState(null);
  const mixer = useRef();
  const balls = useRef([]);
  const [ballIndex, setBallIndex] = useState(0);

  useEffect(() => {
    const loader = new GLTFLoader();
    loader.load(
      "/models3d/balotera-gltf-glb/scene.glb",
      (gltf) => {
        gltf.scene.scale.set(0.05, 0.05, 0.05);
        gltf.scene.position.set(0, -1.5, 0);
        setModel(gltf.scene);

        // Identificar y personalizar las balotas
        gltf.scene.traverse((node) => {
          if (node.isMesh && node.name.includes("Ball")) {
            balls.current.push(node);
            if (customizeBalls) {
              node.material = new THREE.MeshStandardMaterial({
                color: customizeBalls.color,
                roughness: customizeBalls.roughness,
                metalness: customizeBalls.metalness,
              });
            }
            // Inicializar las balotas dentro de la esfera de la balotera
            node.position.set(
              Math.random() * 0.5 - 0.25,
              Math.random() * 0.5 - 0.25,
              Math.random() * 0.5 - 0.25
            );
          }
        });
      },
      undefined,
      (error) => {
        console.error("Error loading GLTF model:", error);
      }
    );
  }, [customizeBalls]);

  useFrame((state, delta) => {
    if (mixBalls) {
      balls.current.forEach((ball, index) => {
        ball.position.x = Math.sin(index + state.clock.elapsedTime * 2) * 0.5;
        ball.position.z = Math.cos(index + state.clock.elapsedTime * 2) * 0.5;
      });
    }
  });

  useEffect(() => {
    if (extractBall && balls.current.length > 0) {
      const ball = balls.current[ballIndex];
      if (ball) {
        const initialPosition = ball.position.clone();
        const finalPosition = initialPosition.clone().add(new THREE.Vector3(0, 2, 0));

        const keyframes = new THREE.VectorKeyframeTrack(
          `${ball.name}.position`,
          [0, 1, 2],
          [
            initialPosition.x, initialPosition.y, initialPosition.z,
            initialPosition.x, initialPosition.y + 1, initialPosition.z,
            finalPosition.x, finalPosition.y, finalPosition.z,
          ]
        );

        const clip = new THREE.AnimationClip("extractBall", 2, [keyframes]);
        mixer.current = new THREE.AnimationMixer(ball);
        const action = mixer.current.clipAction(clip);
        action.setLoop(THREE.LoopOnce);
        action.clampWhenFinished = true;
        action.play();

        setTimeout(() => {
          ball.visible = false;
          setBallIndex((prevIndex) => prevIndex + 1);
        }, 2000);
      }
    }
  }, [extractBall, ballIndex]);

  useFrame((state, delta) => {
    if (mixer.current) {
      mixer.current.update(delta);
    }
  });

  return model ? <primitive object={model} ref={group} dispose={null} /> : null;
};

const App = () => {
  const [mixBalls, setMixBalls] = useState(false);
  const [extractBall, setExtractBall] = useState(false);
  const [customizeBalls, setCustomizeBalls] = useState({
    color: "#0000ff",
    roughness: 0.5,
    metalness: 0.5,
  });

  const handleMixToggle = () => {
    setMixBalls((prev) => !prev);
  };

  const handleExtractBall = () => {
    setExtractBall(true);
    setTimeout(() => {
      setExtractBall(false);
    }, 2000);
  };

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
        <Model
          customizeBalls={customizeBalls}
          mixBalls={mixBalls}
          extractBall={extractBall}
        />
        <OrbitControls />
      </Canvas>
      <div style={{ position: "absolute", top: "80px", left: "20px", zIndex: 1 }}>
        <button onClick={handleMixToggle}>
          {mixBalls ? "Stop Mixing" : "Mix Balls"}
        </button>
        <button onClick={handleExtractBall} style={{ marginLeft: "10px" }}>
          Extract Ball
        </button>
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
