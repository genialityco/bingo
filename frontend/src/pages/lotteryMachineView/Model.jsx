import React, { useRef, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { motion } from "framer-motion-3d";

const Model = () => {
  const group = useRef();
  const { scene } = useGLTF("/models3d/balotera/scene.glb");

  useEffect(() => {
    console.log("Scene:", scene);
  }, [scene]);

  return (
    <motion.group
      ref={group}
      dispose={null}
      initial={{ rotation: [0, 0, 0] }}
      animate={{ rotation: [0, Math.PI * 2, 0] }}
      transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
    >
      <primitive object={scene} />
    </motion.group>
  );
};

export default Model;
