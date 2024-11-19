import { extend, Canvas, useFrame, useLoader } from "@react-three/fiber";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import helvetiker from "./fonts/helvetiker_regular.typeface.json";
import { Physics, usePlane, useSphere, useCylinder } from "@react-three/cannon";
import { Environment, OrbitControls } from "@react-three/drei";
import { Suspense, useEffect, useRef, useState } from "react";
import { Group } from "three";
import { TextureLoader } from "three";
import * as THREE from "three";
import bingoServices from "../../services/bingoService";

const font = new FontLoader().parse(helvetiker);

function Plane(props) {
  const [ref] = usePlane(
    () => ({ material: "ground", type: "Static", ...props }),
    useRef < Group > null
  );

  return (
    <group ref={ref}>
      <mesh receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#303030" />
      </mesh>
    </group>
  );
}

function PlaneSide(props) {
  const [ref] = usePlane(
    () => ({ material: "ground", type: "Static", ...props }),
    useRef < Group > null
  );

  return (
    <group ref={ref}>
      <mesh receiveShadow>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color={props.color} />
      </mesh>
    </group>
  );
}

function TextMesh({ numero = 5 }) {
  extend({ TextGeometry });
  return (
    <mesh position={[0.425, -0.08, 0]} rotation={[0, 2.03, 0]}>
      <textGeometry
        args={[
          `${numero}`,
          {
            font,
            size: 0.2,
            depth: 0,
            curveSegments: 12,
            bevelEnabled: true,
            bevelThickness: 0.03,
            bevelSize: 0.02,
            bevelOffset: 0,
            bevelSegments: 2,
          },
        ]}
      />
      <meshBasicMaterial color="black" />
    </mesh>
  );
}

function ImageMesh({
  imageUrl,
  radius = 0.4,
  widthSegments = 32,
  heightSegments = 32,
  phiLength = Math.PI / 2,
  thetaLength = Math.PI / 2,
}) {
  const texture = useLoader(THREE.TextureLoader, imageUrl);

  return (
    <>
      <mesh>
        <sphereGeometry
          args={[
            radius,
            widthSegments,
            heightSegments,
            Math.PI / 2 - phiLength / 2,
            phiLength,
            Math.PI / 2 - thetaLength / 2,
            thetaLength,
          ]}
        />
        <meshBasicMaterial map={texture} side={THREE.DoubleSide} />
      </mesh>
    </>
  );
}
function InstancedSpheres(props) {
  const sphereSize = [0.4];
  const [ref, api] = useSphere(() => ({
    args: sphereSize,
    mass: 0.4,
    ...props,
  }));

  useFrame(() => {
    if (props.applyImpulse) {
      api.applyImpulse(props.impulse, [0, 0, 0]);
    }
  });

  return (
    <>
      <mesh ref={ref} castShadow receiveShadow>
        <sphereGeometry args={sphereSize}></sphereGeometry>
        <meshPhongMaterial color={"white"} />
        {props.typeSphere === "default" && (
          <TextMesh numero={props.valueSphere} />
        )}
        {props.typeSphere === "text" && <TextMesh numero={props.valueSphere} />}
        {props.typeSphere === "image" && (
          <ImageMesh imageUrl={props.valueSphere} />
        )}
      </mesh>
    </>
  );
}

function Fan({ angularVelocity }) {
  const [ref, api] = useCylinder(() => ({
    mass: 3,
    position: [0, 0, 0],
    args: [1, 1, 1, 32],
  }));

  useFrame(() => {
    // Rotar el ventilador en torno al eje Y
    api.angularVelocity.set(0, angularVelocity, 0);
  });

  return (
    <group ref={ref}>
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[1, 1, 1, 32]} />
        <meshStandardMaterial color="black" />
      </mesh>
      {/* Barra 1 de la cruz */}
      <mesh position={[0, 1.5, 0]} rotation={[0, 0, Math.PI / 2]}>
        <boxGeometry args={[2, 0.1, 0.1]} />
        <meshStandardMaterial color="white" />
      </mesh>
      {/* Barra 2 de la cruz */}
      <mesh position={[0, 1.5, 0]}>
        <boxGeometry args={[2, 0.1, 0.1]} />
        <meshStandardMaterial color="white" />
      </mesh>
    </group>
  );
}

const EscapeTube = ({ position, rotation, color }) => {
  const [ref] = useCylinder(() => ({
    mass: 1,
    position: position,
    rotation: rotation,
    position: "Kinematic",
    args: [0.5, 0.5, 5, 32], // Radio superior, radio inferior, altura, segmentos
  }));

  return (
    <mesh ref={ref} castShadow>
      <cylinderGeometry args={[0.5, 0.5, 5, 32]} />
      <meshPhysicalMaterial
        color={color}
        transmission={1}
        opacity={0.5}
        roughness={0}
        metalness={0}
        clearcoat={1}
        clearcoatRoughness={0}
        thickness={0.1}
      />
      <mesh>
        <ringGeometry args={[0.4, 0.5, 32, 1, 0, Math.PI * 2]} />
        <meshPhysicalMaterial
        color={color}
        transmission={1}
        opacity={0.5}
        roughness={0}
        metalness={0}
        clearcoat={1}
        clearcoatRoughness={0}
        thickness={0.1}
      />
      </mesh>
    </mesh>
  );
};

const style = {
  color: "white",
  fontSize: "1.2em",
  left: 50,
  position: "absolute",
  top: 70,
};

const scene = () => {
  const [numberSpheres, setNumberSpheres] = useState([]);
  const [velocityFan, setVelocityFan] = useState(20);
  const [impulse, setImpulse] = useState([0, 0, 0]);
  const [applyImpulse, setApplyImpulse] = useState(false);

  const getBingo = async () => {
    const response = await bingoServices.getBingoById(
      "66511229742c0fdc2418d99e"
    );
    setNumberSpheres(response.bingo_values);
  };

  useEffect(() => {
    getBingo();
  }, []);

  const handleApplyImpulse = () => {
    const impulseX = Math.random() * 2 - 1; // Valor entre -1 y 1
    const impulseZ = Math.random() * 2 - 1; // Valor entre -1 y 1
    setImpulse([impulseX, 12, impulseZ]);
    setApplyImpulse(true);
    setTimeout(() => setApplyImpulse(false), 100);
  };

  return (
    <>
      <Canvas
        camera={{ fov: 50, position: [-3, 5, 15] }}
        shadows
        style={{ width: "100vw", height: "90vh" }}
      >
        <fog attach="fog" args={["#171720", 10, 50]} />
        <color attach="background" args={["#171720"]} />
        <ambientLight intensity={0.1 * Math.PI} />
        <spotLight
          angle={0.5}
          castShadow
          decay={0}
          intensity={Math.PI}
          penumbra={0.5}
          position={[0, 20, 0]}
          target-position={[0, 0, 0]}
        />
        <Physics
          broadphase="SAP"
          defaultContactMaterial={{
            contactEquationRelaxation: 4,
            friction: 1e-3,
          }}
          allowSleep
          gravity={[0, -30, 0]}
        >
          <Plane rotation={[-Math.PI / 2, 0, 0]} userData={{ id: "floor" }} />

          <PlaneSide
            position={[-5, 5, 0]}
            rotation={[0, Math.PI / 2, 0]}
            color="red"
          />
          <PlaneSide
            position={[5, 5, 0]}
            rotation={[0, -Math.PI / 2, 0]}
            color="pink"
          />
          <PlaneSide
            position={[0, 5, -5]}
            rotation={[0, 0, 0]}
            color="purple"
          />
          <PlaneSide
            position={[0, 5, 5]}
            rotation={[0, Math.PI, 0]}
            color="orange"
          />
          <PlaneSide
            position={[0, 10, 0]}
            rotation={[Math.PI / 2, 0, 0]}
            color="yellow"
          />

          {numberSpheres.length > 0 &&
            numberSpheres.map((sphere) => (
              <InstancedSpheres
                key={sphere._id}
                position={[
                  Math.random() * 10 - 5,
                  Math.random() * 10,
                  Math.random() * 10 - 5,
                ]}
                valueSphere={sphere.ballot_value}
                typeSphere={sphere.ballot_type}
                applyImpulse={applyImpulse}
                impulse={impulse}
              />
            ))}
          <Fan position={[0, 3, 0]} angularVelocity={velocityFan} />
          <EscapeTube position={[0, 5, -5]} color="white" />
        </Physics>
        <Suspense fallback={null}>
          <Environment preset="night" />
        </Suspense>
        <OrbitControls />
      </Canvas>
      <div style={style}>
        <pre>
          Opciones
          <button onClick={handleApplyImpulse}>Agitar balotas</button>
          <button onClick={() => setVelocityFan((prev) => prev + 10)}>
            Aumentar velocidad
          </button>
          <button onClick={() => setVelocityFan(1)}> Detener ventilador</button>
        </pre>
      </div>
    </>
  );
};

export default scene;
