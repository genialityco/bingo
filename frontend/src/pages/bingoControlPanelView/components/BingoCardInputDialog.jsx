import React, { useState } from "react";
import {
  Dialog,
  DialogBody,
  DialogHeader,
  IconButton,
  Button,
  Input,
} from "@material-tailwind/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import BingoCardStatic from "../../../components/BingoCard";
import bingoServices from "../../../services/bingoService";
import bingoCardboardService from "../../../services/bingoCardboardService";

export const BingoCardInputDialog = ({ isOpen, onClose }) => {
  const [cardboardCode, setCardboardCode] = useState("");
  const [cardboardDetails, setCardboardDetails] = useState(null);
  const [bingoAppearance, setBingoAppearance] = useState({});

  const fetchCardboardDetails = async () => {
    try {
      const details = await bingoCardboardService.findCardboardByField(
        "cardboard_code",
        cardboardCode
      );
      const bingoData = await bingoServices.getBingoById(details.data.bingoId);
      setBingoAppearance(bingoData.bingo_appearance);
      setCardboardDetails(details.data);
    } catch (error) {
      console.error("Error al obtener detalles del cartón:", error);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} size="sm">
      <DialogHeader className="flex justify-between items-center">
        <h4 className="text-lg">Ver un cartón</h4>

        <IconButton variant="text" onClick={onClose}>
          <XMarkIcon className="h-6 w-6" />
        </IconButton>
      </DialogHeader>
      <DialogBody>
        <div className="relative flex w-full w-full pb-2">
          <Input
            type="text"
            value={cardboardCode}
            onChange={(e) => setCardboardCode(e.target.value)}
            label="Código del Cartón"
            className="pr-20"
            containerProps={{
              className: "min-w-0",
            }}
          />
          <Button
            size="sm"
            className="!absolute right-1 top-1 rounded"
            onClick={fetchCardboardDetails}
          >
            Buscar
          </Button>
        </div>
        {cardboardDetails && (
          <BingoCardStatic
            bingoCard={cardboardDetails.game_card_values}
            rows={Math.sqrt(cardboardDetails.game_card_values.length)}
            bingoAppearance={bingoAppearance}
            markedSquares={cardboardDetails.game_marked_squares}
            onMarkSquare={() => {}}
          />
        )}
      </DialogBody>
    </Dialog>
  );
};
