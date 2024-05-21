import {
  Card,
  Chip,
  Dialog,
  DialogHeader,
  DialogFooter,
  Button,
} from '@material-tailwind/react';
import { useState, useContext } from 'react';
import { CirclePicker, SketchPicker } from 'react-color';
import { NewBingoContext } from '../../../context/NewBingoContext';

const BackgroundColor = () => {
  const { bingo, updateBingo } = useContext(NewBingoContext);

  const [open, setOpen] = useState(false);

  const [currentColor, setCurrentColor] = useState('#ff6');

  const handleOpen = () => setOpen(!open);

  const handleOnChange = (color) => {
    const newColor = color.hex;
    setCurrentColor(newColor);

    // Actualiza el estado del contexto con el nuevo color
    updateBingo((prevState) => ({
      ...prevState,
      bingo_appearance: {
        ...prevState.bingo_appearance,
        background_color: newColor,
      },
    }));
  };

  const handleOnChangeCircleColor = (color) => {
    const newColor = color.hex; // Guarda el nuevo color
    setCurrentColor(newColor); // Actualiza el estado local

    // Actualiza el estado del contexto con el nuevo color
    updateBingo((prevState) => ({
      ...prevState,
      bingo_appearance: {
        ...prevState.bingo_appearance,
        background_color: newColor,
      },
    }));
  };

  return (
    <>
      <Card className="p-5 bg-gray-50 flex flex-row items-center gap-3">
        <div
          style={{ backgroundColor: currentColor }}
          className=" p-5  bg-blue-500 h-20 w-20 rounded-full"
          onClick={handleOpen}
        ></div>
        <Chip
          size="sm"
          variant="ghost"
          value={currentColor ? `HEX ${currentColor}`: "HEX #00BCD4"}
          className="w-24 p-2 cursor-pointer"
        />
      {/*   <Chip
          size="sm"
          variant="ghost"
          value={currentColor ? currentColor : "RGB (0,188,212)"}
          className="w-28 p-2 cursor-pointer"
        /> */}
      </Card>

      <Dialog size="md" open={open} handler={handleOpen}>
        <DialogHeader className="flex justify-around items-center bg-blue-gray-100">
          <Card className="h-3/6 p-4 border-2">
            <SketchPicker
              color={currentColor}
              onChangeComplete={handleOnChange}
              disableAlpha
            />
          </Card>

          <Card className="p-3 border-2 bg-blue-gray-200">
            <CirclePicker onChange={handleOnChangeCircleColor} />
          </Card>
        </DialogHeader>

        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={handleOpen}
            className="mr-1"
          >
            <span>Cancelar</span>
          </Button>
          <Button variant="gradient" color="green" onClick={handleOpen}>
            <span>Aceptar</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
};

export default BackgroundColor;
