import React from "react";
import { motion } from "framer-motion";

const Ball = ({ number, initialX, initialY }) => {
  return (
    <motion.div
      className="ball"
      initial={{ x: initialX, y: initialY }}
      animate={{ y: [initialY, initialY - 10, initialY] }}
      transition={{ repeat: Infinity, duration: 2, repeatType: "reverse" }}
    >
      {number}
    </motion.div>
  );
};

export default Ball;
