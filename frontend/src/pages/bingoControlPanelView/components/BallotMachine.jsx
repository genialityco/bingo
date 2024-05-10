import React, { useEffect, useRef, useState } from "react";
import { Button, Typography } from "@material-tailwind/react";
import * as THREE from "three";

export const BallotMachine = ({ drawBallot, currentBallot }) => {
  const mountRef = useRef(null);
  const [isAnimating, setIsAnimating] = useState(true);
  const [selectedBallot, setSelectedBallot] = useState(null);

  useEffect(() => {
    const width = 300;
    const height = 300;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });

    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    mountRef.current.appendChild(renderer.domElement);

    // Fondo personalizado
    const textureLoader = new THREE.TextureLoader();
    const backgroundUrl =
      "https://th.bing.com/th/id/R.68f6f6dced784c09d7f00ff814f4bc8f?rik=t4oO%2b%2bSMkiHMTQ&pid=ImgRaw&r=0";
    textureLoader.load(
      backgroundUrl,
      (texture) => {
        // Aplicar la textura como fondo de la escena
        scene.background = texture;
      },
      undefined,
      (err) => {
        console.error("Error al cargar la textura:", err);
      }
    );

    // Esfera y estructura
    const drumGeometry = new THREE.SphereGeometry(10, 20, 20);
    const drumMaterial = new THREE.MeshBasicMaterial({
      color: 0x000000,
      wireframe: true,
    });
    const drum = new THREE.Mesh(drumGeometry, drumMaterial);
    scene.add(drum);

    // Añadir estructura de soporte
    const supportGeometry = new THREE.BoxGeometry(1, 10, 1);
    const supportMaterial = new THREE.MeshStandardMaterial({ color: 0x888888 });
    const support1 = new THREE.Mesh(supportGeometry, supportMaterial);
    const support2 = new THREE.Mesh(supportGeometry, supportMaterial);
    support1.position.set(-5, 12, 0);
    support2.position.set(5, 12, 0);
    scene.add(support1, support2);

    // Añadir manivela
    const handleGeometry = new THREE.CylinderGeometry(0.2, 0.2, 5);
    const handleMaterial = new THREE.MeshStandardMaterial({ color: 0xc21b12 });
    const handle = new THREE.Mesh(handleGeometry, handleMaterial);
    handle.rotation.z = Math.PI / 2;
    handle.position.set(0, -5, 5);
    scene.add(handle);

    // Añadir tubo de salida
    const tubeGeometry = new THREE.CylinderGeometry(1, 1, 8);
    const tubeMaterial = new THREE.MeshStandardMaterial({ color: 0x555555 });
    const tube = new THREE.Mesh(tubeGeometry, tubeMaterial);
    tube.rotation.z = Math.PI / -4;
    tube.position.set(-5, -7, 6);
    scene.add(tube);

    const balls = [];

    // Crear balotas numeradas
    for (let i = 0; i < 60; i++) {
      const ballGeometry = new THREE.SphereGeometry(0.5, 32, 32);
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = 64;
      canvas.height = 64;

      // Dibujar el número en la textura de la balota
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, 64, 64);
      ctx.fillStyle = "black";
      ctx.font = "30px Arial";
      ctx.fillText(i + 1, 20, 40);

      const texture = new THREE.CanvasTexture(canvas);
      const ballMaterial = new THREE.MeshBasicMaterial({ map: texture });
      const ball = new THREE.Mesh(ballGeometry, ballMaterial);

      // Posicionar balotas en la esfera de manera uniforme
      const radius = 7;
      const theta = Math.random() * Math.PI;
      const phi = Math.random() * 2 * Math.PI;
      const x = radius * Math.sin(theta) * Math.cos(phi);
      const y = radius * Math.sin(theta) * Math.sin(phi);
      const z = radius * Math.cos(theta);

      ball.position.set(x, y, z);
      balls.push(ball);
      drum.add(ball);
    }

    const ambientLight = new THREE.AmbientLight(0xffffff, 2);
    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(10, 10, 10);
    pointLight.castShadow = true;
    scene.add(ambientLight, pointLight);

    camera.position.z = 20;

    const animate = () => {
      if (isAnimating) {
        drum.rotation.y += 0.005;
        handle.rotation.y -= 0.3;
        balls.forEach((ball) => {
          ball.position.x += 0.2 * (Math.random() - 0.5);
          ball.position.y += 0.2 * (Math.random() - 0.5);
          ball.position.z += 0.2 * (Math.random() - 0.5);
        });
      }
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      mountRef.current.removeChild(renderer.domElement);
    };
  }, [isAnimating]);

  const startAnimation = () => {
    setTimeout(() => {
      const randomBall = Math.floor(Math.random() * 60);
      setSelectedBallot(randomBall + 1);
      setIsAnimating(false);
    }, 2000);
  };

  return (
    <div>
      <Button onClick={drawBallot}>Sacar Balota</Button>
      <div ref={mountRef} />
      {currentBallot !== null && (
        <Typography variant="h5">
          Balota seleccionada: {currentBallot.ballot_value}
        </Typography>
      )}
    </div>
  );
};
