import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogBody,
  DialogFooter,
  Button,
  Input,
  Select,
  Option,
  Typography,
} from "@material-tailwind/react";
import bingoService from "../../../services/bingoService";
import { useLoading } from "../../../context/LoadingContext";

export const FormEditRoom = ({ bingo, fetchBingoData }) => {
  const { _id, name, bingo_code, capacity } = bingo;
  const { showLoading, hideLoading } = useLoading();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [bingoName, setBingoName] = useState(name);
  const [bingoCodeForm, setBingoCodeForm] = useState(bingo_code);
  const [bingoCapacity, setBingoCapacity] = useState(capacity);

  useEffect(() => {
    setBingoName(name);
    setBingoCodeForm(bingo_code);
    setBingoCapacity(capacity);
  }, [name]);

  const toggleDialog = () => setDialogOpen(!dialogOpen);

  const handleSubmit = async () => {
    if (bingoName && bingoCodeForm && bingoCapacity) {
      try {
        const updateData = {
          name: bingoName,
          bingo_code: bingoCodeForm,
          capacity: bingoCapacity,
        };
        await bingoService.updateBingo(_id, updateData, showLoading, hideLoading);
        fetchBingoData();
        toggleDialog();
      } catch (error) {
        console.error("Error updating bingo:", error);
      }
    } else {
      alert("Por favor, completa todos los campos.");
    }
  };

  return (
    <div className="flex flex-col">
      <Button
        onClick={toggleDialog}
        className="rounded-l-lg rounded-r-none normal-case"
      >
        Configurar Bingo
      </Button>

      <Dialog open={dialogOpen} handler={toggleDialog}>
        <DialogBody className="space-y-4">
          <Typography variant="h5">Configurar Bingo</Typography>
          <Input
            label="Nombre del bingo"
            value={bingoName}
            onChange={(e) => setBingoName(e.target.value)}
          />
          <Input
            label="Código del bingo"
            value={bingoCodeForm}
            onChange={(e) => setBingoCodeForm(e.target.value)}
          />
          <Input
            label="Aforo/Capacidad"
            value={bingoCapacity}
            onChange={(e) => setBingoCapacity(e.target.value)}
          />
        </DialogBody>
        <DialogFooter>
          <Button variant="text" color="blue-gray" onClick={toggleDialog}>
            Cancelar
          </Button>
          <Button variant="filled" onClick={handleSubmit}>
            Guardar
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
};
