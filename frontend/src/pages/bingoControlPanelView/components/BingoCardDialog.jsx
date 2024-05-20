import React, { useState, useEffect } from 'react';
import { Dialog, DialogBody, DialogHeader, IconButton } from "@material-tailwind/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import BingoCardStatic from "../../../components/BingoCard";
import bingoCardboardService from "../../../services/bingoCardboardService";
import bingoServices from "../../../services/bingoService";

export const BingoCardDialog = ({ isOpen, onClose, cardboardCode }) => {
  const [cardboardDetails, setCardboardDetails] = useState(null);
  const [bingoAppearance, setBingoAppearance] = useState({});

  useEffect(() => {
    if (isOpen) {
      const fetchDetails = async () => {
        try {
          const details = await bingoCardboardService.findCardboardByField("cardboard_code", cardboardCode);
          const bingoData = await bingoServices.getBingoById(details.data.bingoId);
          setBingoAppearance(bingoData.bingo_appearance);
          setCardboardDetails(details.data);
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
