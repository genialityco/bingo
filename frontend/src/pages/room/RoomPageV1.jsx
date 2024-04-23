import React, { useEffect, useRef, useState } from "react";
import {
  Card,
  CardBody,
  Typography,
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
  Button,
  Alert,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
  Textarea,
} from "@material-tailwind/react";
import { DndContext, useDraggable } from "@dnd-kit/core";
import { useLocation } from "react-router-dom";
import BingoCardStatic from "../../components/BingoCard";
import io from "socket.io-client";
import bingoRoomService from "../../services/bingoRoomService";
import bingoService from "../../services/bingoService";

const SOCKET_SERVER_URL = import.meta.env.VITE_SOCKET_SERVER_URL;

export const RoomPageV1 = () => {
  const [bingoConfig, setBingoConfig] = useState(null);
  const [bingoCard, setBingoCard] = useState([]);
  const [markedIds, setMarkedIds] = useState(new Set()); // Usamos un Set para evitar duplicados

  const location = useLocation();
  const { roomId, bingoId } = location.state || {};

  useEffect(() => {
    const getBingo = async () => {
      const response = await bingoService.getBingoById(bingoId);
      setBingoConfig(response);
      if (response) {
        generateBingoCard(
          response.bingo_values,
          response.dimensions,
          response.positions_disabled,
          true
        ); // true para restricciones
      }
    };
    getBingo();
  }, [bingoId]);

  const generateBingoCard = (
    values,
    dimensions,
    positionsDisabled,
    useRestrictions
  ) => {
    const [rows, cols] = dimensions.split("x").map(Number);
    let card = Array.from({ length: rows * cols }, () => ({
      value: null,
      _id: null,
      marked: false,
      default_image: null,
    }));

    // Aplicar posiciones deshabilitadas
    positionsDisabled.forEach((disabled) => {
      card[disabled.position] = {
        ...card[disabled.position],
        value: "Disabled",
        default_image: disabled.default_image,
        marked: true,
      };
    });

    // Mezclar y asignar valores
    let shuffledValues = shuffle(values);
    shuffledValues.forEach((value) => {
      let availablePositions = useRestrictions
        ? value.positions.filter((pos) => card[pos].value === null)
        : Array.from(card.keys()).filter((pos) => card[pos].value === null);

      if (availablePositions.length > 0) {
        let chosenPosition =
          availablePositions[
            Math.floor(Math.random() * availablePositions.length)
          ];
        card[chosenPosition] = {
          ...card[chosenPosition],
          value: value.carton_value,
          _id: value._id,
        };
      }
    });

    setBingoCard(card);
  };

  const handleMark = (index) => {
    const newCard = [...bingoCard];
    if (
      newCard[index]._id &&
      !newCard[index].marked &&
      newCard[index].value !== "Disabled"
    ) {
      newCard[index].marked = true;
      setMarkedIds((prev) => new Set(prev).add(newCard[index]._id));
      setBingoCard(newCard);
    }
  };

  return (
    <>
      <div className="flex flex-col w-full bg-gray-300 p-2">
        <section>{/* Accordion y otros componentes */}</section>
        <section className="mt-4 grid grid-cols-5 gap-2">
          {bingoCard.map((cell, index) => (
            <Card
              key={index}
              onClick={() => handleMark(index)}
              className={cell.marked ? "bg-blue-500" : "bg-white"}
            >
              <CardBody
                className="flex justify-center items-center w-full h-full"
                style={{ width: "50px", height: "50px" }}
              >
                {cell.default_image ? (
                  <img
                    className="w-full object-cover object-center"
                    src={cell.default_image}
                    alt="Disabled"
                  />
                ) : (
                  cell.value
                )}
              </CardBody>
            </Card>
          ))}
        </section>
      </div>
    </>
  );
};

function shuffle(array) {
  let currentIndex = array.length,
    randomIndex;
  // Mientras queden elementos a mezclar...
  while (currentIndex !== 0) {
    // Elegir un elemento restante...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    // E intercambiarlo con el elemento actual.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
  return array;
}
const Accordion = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-1 bg-black rounded">
      <div className="cursor-pointer p-4" onClick={() => setIsOpen(!isOpen)}>
        <Typography
          variant="h6"
          color="white"
          className="uppercase text-sm md:text-base"
        >
          {title}
        </Typography>
      </div>
      {isOpen && <div className="p-3 text-white">{children}</div>}
    </div>
  );
};
