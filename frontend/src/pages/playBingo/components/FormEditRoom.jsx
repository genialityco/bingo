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
import bingoRoomService from "../../../services/bingoRoomService";

export const FormEditRoom = ({ bingoRoom, fetchRoomData }) => {
  const { _id, title, roomCode, capacity } = bingoRoom;
  const [dialogOpen, setDialogOpen] = useState(false);
  const [roomTitle, setRoomTitle] = useState(title);
  const [roomCodeForm, setRoomCodeForm] = useState(roomCode);
  const [roomCapacity, setRoomCapacity] = useState(capacity);

  useEffect(() => {
    setRoomTitle(title);
    setRoomCodeForm(roomCode);
    setRoomCapacity(capacity);
  }, [title]);

  const toggleDialog = () => setDialogOpen(!dialogOpen);

  const handleSubmit = async () => {
    if (roomTitle && roomCodeForm && roomCapacity) {
      try {
        const updateData = {
          title: roomTitle,
          roomCode: roomCodeForm,
          capacity: roomCapacity,
        };
        await bingoRoomService.updateRoom(_id, updateData);
        fetchRoomData();
        toggleDialog();
      } catch (error) {
        console.error("Error updating room:", error);
      }
    } else {
      alert("Por favor, completa todos los campos.");
    }
  };

  return (
    <div className="flex flex-col">
      <Button onClick={toggleDialog} className="rounded-l-lg rounded-r-none">
        Configurar Sala
      </Button>

      <Dialog open={dialogOpen} handler={toggleDialog}>
        <DialogBody className="space-y-4">
          <Typography variant="h5">Configurar Sala</Typography>
          <Input
            label="Título de la Sala"
            value={roomTitle}
            onChange={(e) => setRoomTitle(e.target.value)}
          />
          <Input
            label="Código de la sala"
            value={roomCodeForm}
            onChange={(e) => setRoomCodeForm(e.target.value)}
          />
          <Input
            label="Aforo/Capacidad"
            value={roomCapacity}
            onChange={(e) => setRoomCapacity(e.target.value)}
          />
        </DialogBody>
        <DialogFooter>
          <Button variant="text" color="blue-gray" onClick={toggleDialog}>
            Cancelar
          </Button>
          <Button variant="filled"  onClick={handleSubmit}>
            Guardar
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
};
