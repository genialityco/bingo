import React, { useEffect, useState } from "react";
import {
  Typography,
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  Input,
} from "@material-tailwind/react";

export function MessageDialog({ onSaveCardboard, getExistingCardboard }) {
  const [open, setOpen] = React.useState(false);
  const [userId, setUserId] = useState("");
  const [showInputCode, setShowInputCode] = useState(false);
  const [code, setCode] = useState("");
  const [hasUserEntered, setHasUserEntered] = useState(false);

  useEffect(() => {
    // Verificar si el usuario ya ha ingresado
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setHasUserEntered(true);
    } else {
      // Si el usuario no ha ingresado, abrir el diálogo automáticamente
      setOpen(true);
    }
  }, []);

  const handleButtonSendUser = (e) => {
    e.preventDefault();
    if (showInputCode) {
      getExistingCardboard(code);
    } else {
      localStorage.setItem("userId", JSON.stringify(userId));
      onSaveCardboard(userId);
    }
    setOpen(false);
    setHasUserEntered(true); // Marcar que el usuario ha ingresado
  };

  const handleCancel = () => {
    setOpen(false);
  };

  // Si el usuario ya ha ingresado, no renderizar el componente
  if (hasUserEntered) {
    return null;
  }

  return (
    <>
      <Dialog open={open} size="xs">
        <div className="flex items-center justify-between"></div>
        <DialogBody>
          <form onSubmit={handleButtonSendUser}>
            {!showInputCode && (
              <div className="grid gap-6">
                <Typography className="-mb-1" color="blue-gray" variant="h6">
                  Ingrese un nombre para jugar
                </Typography>
                <Input
                  label="Nombre"
                  onChange={(e) => setUserId(e.target.value)}
                />
                <div>
                  <Typography
                    className="cursor-pointer"
                    color="blue-gray"
                    variant="small"
                    onClick={() => setShowInputCode(true)}
                  >
                    ¿Tienes un código de cartón?
                  </Typography>
                </div>
              </div>
            )}
            {showInputCode && (
              <div className="grid gap-6">
                <Typography className="-mb-1" color="blue-gray" variant="h6">
                  Ingrese código de cartón
                </Typography>
                <Input
                  label="Código"
                  onChange={(e) => setCode(e.target.value)}
                />
                <div>
                  <Typography
                    className="cursor-pointer"
                    color="blue-gray"
                    variant="small"
                    onClick={() => setShowInputCode(false)}
                  >
                    ¿Nuevo jugador?
                  </Typography>
                </div>
              </div>
            )}

            <DialogFooter className="space-x-2">
              <Button onClick={handleCancel}>Cancel</Button>
              <Button
                variant="gradient"
                color="gray"
                type="submit"
              >
                Enviar
              </Button>
            </DialogFooter>
          </form>
        </DialogBody>
      </Dialog>
    </>
  );
}
