import React, { useState } from "react";
import {
  Typography,
  Chip,
  Dialog,
  DialogBody,
  DialogHeader,
  DialogFooter,
  IconButton,
} from "@material-tailwind/react";
import { EyeIcon, XMarkIcon } from "@heroicons/react/24/outline";
import bingoCardboardService from "../../../services/bingoCardboardService";
import BingoCardStatic from "../../../components/BingoCard";
import bingoService from "../../../services/bingoService";

export const BingoRequestTable = ({
  bingoRequests,
  STATUS_VALIDATING,
  STATUS_WINNER,
}) => {
  const [selectedCardboard, setSelectedCardboard] = useState(null);
  const [bingoAppearance, setBingoAppearance] = useState({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleViewCardboard = async (cardboardCode) => {
    try {
      const cardboardDetails = await bingoCardboardService.findCardboardByField(
        "cardboard_code",
        cardboardCode
      );

      const bingoData = await bingoService.getBingoById(
        cardboardDetails.data.bingoId
      );

      setBingoAppearance(bingoData.bingo_appearance);
      setSelectedCardboard(cardboardDetails.data);
      setIsDialogOpen(true);
    } catch (error) {
      console.error("Error al obtener detalles del cartón:", error);
    }
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setSelectedCardboard(null);
  };

  return (
    <div>
      <table className="w-full text-left">
        <thead>
          <tr>
            <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-2">
              <Typography
                color="blue-gray"
                className="font-normal leading-none opacity-70"
              >
                Ver
              </Typography>
            </th>
            <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-2">
              <Typography
                color="blue-gray"
                className="font-normal leading-none opacity-70"
              >
                Jugador
              </Typography>
            </th>
            <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-2">
              <Typography
                color="blue-gray"
                className="font-normal leading-none opacity-70"
              >
                Estado
              </Typography>
            </th>
          </tr>
        </thead>
        <tbody>
          {bingoRequests.map((request, index) => (
            <tr key={index}>
              <td className="p-1 border-b border-blue-gray-50">
                <button
                  onClick={() => handleViewCardboard(request.cardboardCode)}
                  className="p-2 rounded-full hover:bg-gray-200"
                >
                  <EyeIcon className="h-5 w-5 text-gray-700" />
                </button>
              </td>
              <td className="p-1 border-b border-blue-gray-50">
                <Typography>{request.user}</Typography>
              </td>
              <td className="p-1 border-b border-blue-gray-50">
                <Chip
                  size="md"
                  value={request.status}
                  color={
                    request.status === STATUS_VALIDATING
                      ? "deep-orange"
                      : request.status === STATUS_WINNER
                      ? "green"
                      : "red"
                  }
                  className="text-center p-1"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {isDialogOpen && (
        <div align="center">
          <Dialog open={isDialogOpen} onClose={closeDialog} size="sm">
            <DialogHeader className="flex justify-between items-center">
              <h4 className="text-lg">Detalles del Cartón</h4>
              <IconButton variant="text" onClick={closeDialog}>
                <XMarkIcon className="h-6 w-6" />
              </IconButton>
            </DialogHeader>
            <DialogBody>
              <BingoCardStatic
                bingoCard={selectedCardboard.game_card_values}
                rows={Math.sqrt(selectedCardboard.game_card_values.length)}
                bingoAppearance={bingoAppearance}
                markedSquares={selectedCardboard.game_marked_squares}
                onMarkSquare={() => {}}
              />
            </DialogBody>
          </Dialog>
        </div>
      )}
    </div>
  );
};
