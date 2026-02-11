import {
  Typography,
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import { useState } from "react";

const DialogGenerateBallots = ({
  openDialogGenerateBallots,
  setOpenDialogGenerateBallots,
  handleNumValuesToPlayChange,
}) => {
  const [generateBallots, setGenerateBallots] = useState("");
  const [generationMode, setGenerationMode] = useState("sequential");
  const [startNumber, setStartNumber] = useState("1");

  const handleInputChange = (event) => {
    setGenerateBallots(event.target.value);
  };

  const handleStartNumberChange = (event) => {
    setStartNumber(event.target.value);
  };

  const handleCloseDialog = () => {
    setGenerateBallots(0);
    setOpenDialogGenerateBallots(!openDialogGenerateBallots)
  }

  return (
    <Dialog
      open={openDialogGenerateBallots}
      size="xs"
      handler={setOpenDialogGenerateBallots}
    >
      <div className="flex items-center justify-between"></div>
      <DialogBody>
        <Typography color="gray" variant="paragraph" className="mb-4">
          Ingresa una cantidad a generar
        </Typography>
        <div className="w-full flex justify-center mb-4">
          <input
            type="number"
            className="border border-gray-300 rounded-md px-2 py-1 w-1/2"
            onChange={handleInputChange}
            value={generateBallots}
          />
        </div>

        <div className="w-full mb-4">
          <Typography color="gray" variant="small" className="mb-2">
            Generar valores numericos consecutivos
          </Typography>
          <div className="flex items-center gap-2">
            <input
              type="radio"
              id="mode-sequential"
              name="generationMode"
              value="sequential"
              checked={generationMode === "sequential"}
              onChange={() => setGenerationMode("sequential")}
            />
            <label htmlFor="mode-sequential" className="text-sm">
              Desde
            </label>
            <input
              type="number"
              className="border border-gray-300 rounded-md px-2 py-1 w-24"
              onChange={handleStartNumberChange}
              value={startNumber}
              min="1"
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            size="md"
            variant="text"
            className="mr-1"
            onClick={() =>
              handleCloseDialog()
            }
          >
            Cerrar
          </Button>
          <Button
            size="md"
            onClick={() => {
              handleNumValuesToPlayChange({
                count: generateBallots,
                mode: generationMode,
                start: startNumber,
              });
              setOpenDialogGenerateBallots(!openDialogGenerateBallots);
            }}
          >
            Enviar
          </Button>
        </DialogFooter>
      </DialogBody>
    </Dialog>
  );
};

export default DialogGenerateBallots;
