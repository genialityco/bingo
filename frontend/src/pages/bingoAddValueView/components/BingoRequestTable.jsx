import React, { useState } from "react";
import { Typography, Chip } from "@material-tailwind/react";
import { EyeIcon } from "@heroicons/react/24/outline";
import { BingoCardDialog } from "./BingoCardDialog"; // Importando el nuevo componente de diálogo

export const BingoRequestTable = ({
  bingoRequests,
  STATUS_VALIDATING,
  STATUS_WINNER,
}) => {
  const [selectedCardboard, setSelectedCardboard] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleViewCardboard = async (cardboardCode) => {
    setSelectedCardboard(cardboardCode);
    setIsDialogOpen(true);
  };

  return (
    <div>
      <table className="w-full text-left">
        <thead>
          <tr>
            <th className="p-2 border-y border-blue-gray-100 bg-blue-gray-50/50">
              Ver
            </th>
            <th className="p-2 border-y border-blue-gray-100 bg-blue-gray-50/50">
              Jugador
            </th>
            <th className="p-2 border-y border-blue-gray-100 bg-blue-gray-50/50">
              Estado
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

      <BingoCardDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        cardboardCode={selectedCardboard}
      />
    </div>
  );
};
