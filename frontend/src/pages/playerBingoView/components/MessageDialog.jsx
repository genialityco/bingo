import React, { useState } from "react";
import {
  Typography,
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  Input,
} from "@material-tailwind/react";

export function MessageDialog({ onSaveCardboard, getExistingCardboard }) {
  const [open, setOpen] = useState(true);
  const [showInputCode, setShowInputCode] = useState(false);
  const [code, setCode] = useState("");

  const handleCreateNewCardboard = () => {
    // onSaveCardboard();
    setOpen(false);
  };

  const handleUseExistingCardboard = () => {
    if (code.trim()) {
      getExistingCardboard(code);
      setOpen(false);
    } else {
      alert("Por favor, ingrese un código válido.");
    }
  };

  return (
    <Dialog open={open} size="xs">
      <DialogBody>
        {!showInputCode ? (
          <div className="flex flex-col text-center">
            <Typography variant="h5" className="mb-5">
              ¿Cómo deseas continuar?
            </Typography>
            <div className="flex m-auto gap-5">
              <Button
                color="blue"
                className="normal-case rounded-full"
                variant="outlined"
                onClick={handleCreateNewCardboard}
              >
                Nuevo cartón
              </Button>
              <Button
                color="gray"
                className="normal-case rounded-full"
                variant="outlined"
                onClick={() => setShowInputCode(true)}
              >
                Ya tengo un cartón
              </Button>
            </div>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleUseExistingCardboard();
            }}
          >
            <Typography variant="h6" className="mb-5">
              Ingrese el código de su cartón
            </Typography>
            <Input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              label="Código de Cartón"
            />
            <DialogFooter>
              <Button
                onClick={() => setShowInputCode(false)}
                size="sm"
                variant="outlined"
                className="normal-case mr-1 rounded-full"
              >
                Regresar
              </Button>
              <Button
                type="submit"
                size="sm"
                variant="gradient"
                color="gray"
                className="normal-case rounded-full"
              >
                Usar este cartón
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogBody>
    </Dialog>
  );
}
