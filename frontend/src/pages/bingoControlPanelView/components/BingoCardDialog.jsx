import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogBody,
  DialogHeader,
  IconButton,
} from "@material-tailwind/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import BingoCardStatic from "../../../components/BingoCard";
import bingoCardboardService from "../../../services/bingoCardboardService";
import bingoServices from "../../../services/bingoService";
import { useLoading } from "../../../context/LoadingContext";

export const BingoCardDialog = ({ isOpen, onClose, cardboardCode }) => {
  const [cardboardDetails, setCardboardDetails] = useState(null);
  const [bingoAppearance, setBingoAppearance] = useState({});
  const { showLoading, hideLoading } = useLoading();

  useEffect(() => {
    if (isOpen) {
      const fetchDetails = async () => {
        try {
          console.log("Buscando detalles del cartón:", cardboardCode);
          // Llamar a la función para buscar los detalles del cartón de bingo
          const details = await bingoCardboardService.findCardboardsByFields(
            {
              cardboard_code: cardboardCode,
            },
            showLoading,
            hideLoading
          );

          
          // Obtener los detalles adicionales del bingo usando el ID del bingo
          const bingoData = await bingoServices.getBingoById(
            details.data[0].bingoId
          );

          // Actualizar el estado con los detalles obtenidos
          setBingoAppearance(bingoData.bingo_appearance);
          setCardboardDetails(details.data[0]);
        } catch (error) {
          console.error("Error al obtener detalles del cartón:", error);
        }
      };

      fetchDetails();
    }
  }, [isOpen, cardboardCode]);

  if (!cardboardDetails) return null;

  return (
    <Dialog open={isOpen} onClose={onClose} size="sm">
      <DialogHeader className="flex justify-between items-center">
        <h4 className="text-lg">Detalles del Cartón</h4>
        <IconButton variant="text" onClick={onClose}>
          <XMarkIcon className="h-6 w-6" />
        </IconButton>
      </DialogHeader>
      <DialogBody>
        <BingoCardStatic
          bingoCard={cardboardDetails.game_card_values}
          rows={Math.sqrt(cardboardDetails.game_card_values.length)}
          bingoAppearance={bingoAppearance}
          markedSquares={cardboardDetails.game_marked_squares}
          onMarkSquare={() => {}}
        />
      </DialogBody>
    </Dialog>
  );
};
