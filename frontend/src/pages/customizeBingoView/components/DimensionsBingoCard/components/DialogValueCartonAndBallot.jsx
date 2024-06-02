import {
  Typography,
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
} from "@material-tailwind/react";
import { useContext, useState, useEffect } from "react";
import { NewBingoContext } from "../../../context/NewBingoContext";
import {
  validationsEditInputsBallot,
  validationsEditInputsCarton,
} from "../../../../../utils/validationsEditInputs";

const DialogValueCartonAndBallot = ({
  openDialogValueCartonAndBallot,
  setOpenDialogValueCartonAndBallot,
  editIndex,
  setEditIndex,
  positionsDisabled,
  dimension,
}) => {
  const { bingo, updateBingo } = useContext(NewBingoContext);

  const [editInputsCarton, setEditInputsCarton] = useState({
    number: "",
    text: "",
    imageUrl: "",
  });
  const [editInputsBallot, setEditInputsBallot] = useState({
    number: "",
    text: "",
    imageUrl: "",
  });
  const [selectedCartonType, setSelectedCartonType] = useState("");
  const [selectedBallotType, setSelectedBallotType] = useState("");
  const [selectedPositions, setSelectedPositions] = useState([]);
  const [newCustomValueCartonImageFile, setNewCustomValueCartonImageFile] =
    useState(null);
  const [newCustomValueBallotImageFile, setNewCustomValueBallotImageFile] =
    useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [errorsInputsCarton, setErrorsInputsCarton] = useState({});
  const [errorsInputsBallot, setErrorsInputsBallot] = useState({});

  useEffect(() => {
    if (editIndex !== null) {
      setSelectedItem(bingo.bingo_values[editIndex]);
    }
  }, [editIndex, bingo.bingo_values]);

  useEffect(() => {
    if (selectedItem) {
      setSelectedCartonType(selectedItem.carton_type || "");
      setSelectedBallotType(selectedItem.ballot_type || "");
      setSelectedPositions(selectedItem.positions || []);

      const initialCartonValues = { number: "", text: "", imageUrl: "" };
      const initialBallotValues = { number: "", text: "", imageUrl: "" };

      if (selectedItem.carton_type === "default") {
        initialCartonValues.number = selectedItem.carton_value || "";
      } else if (selectedItem.carton_type === "text") {
        initialCartonValues.text = selectedItem.carton_value || "";
      } else if (selectedItem.carton_type === "image") {
        initialCartonValues.imageUrl = selectedItem.carton_value || "";
      }

      if (selectedItem.ballot_type === "default") {
        initialBallotValues.number = selectedItem.ballot_value || "";
      } else if (selectedItem.ballot_type === "text") {
        initialBallotValues.text = selectedItem.ballot_value || "";
      } else if (selectedItem.ballot_type === "image") {
        initialBallotValues.imageUrl = selectedItem.ballot_value || "";
      }

      setEditInputsCarton(initialCartonValues);
      setEditInputsBallot(initialBallotValues);
    }
  }, [selectedItem]);

  const renderInputs = (
    type,
    editInputs,
    handleChange,
    errors,
    handleImageChange
  ) => {
    if (type === "default") {
      return (
        <div>
          <Input
            label="Ingresar valor numérico"
            placeholder="Ingrese un número"
            name="number"
            onChange={handleChange}
            value={editInputs.number}
          />
          {errors.number && <p>{errors.number}</p>}
        </div>
      );
    } else if (type === "text") {
      return (
        <div>
          <Input
            label="Ingresar valor de texto"
            placeholder="Ingrese un texto"
            name="text"
            onChange={handleChange}
            value={editInputs.text}
          />
          {errors.text && <p>{errors.text}</p>}
        </div>
      );
    } else if (type === "image") {
      return (
        <>
          <Typography className="mb-1" color="gray" variant="lead">
            Elige una Imagen
          </Typography>
          <div className="grid gap-2">
            <Input
              label="Selecciona un archivo"
              type="file"
              placeholder="Selecciona un archivo de imagen"
              onChange={(e) => handleImageChange(e)}
            />
            <Input
              label="Ingresar URL de la imagen"
              placeholder="URL de la imagen"
              name="imageUrl"
              onChange={handleChange}
              value={editInputs.imageUrl}
            />
            {errors.imageUrl && <p>{errors.imageUrl}</p>}
          </div>
        </>
      );
    }
  };

  const handleChangeEditInputs = (e, setEditInputs, setErrors, validations) => {
    const { name, value } = e.target;
    setEditInputs((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({
      ...prev,
      [name]: validations({ ...prev, [name]: value })[name],
    }));
  };

  const handleSelectedPosition = (index) => {
    const isSelected = selectedPositions.includes(index);
    const newSelectedPositions = isSelected
      ? selectedPositions.filter((pos) => pos !== index)
      : [...selectedPositions, index];

    setSelectedPositions(newSelectedPositions);
    updateBingo((prev) => {
      const newBingoCard = { ...prev };
      newBingoCard.bingo_values = newBingoCard.bingo_values.map(
        (value, idx) => {
          if (idx === editIndex) {
            value.positions = newSelectedPositions;
          }
          return value;
        }
      );
      return newBingoCard;
    });
  };

  const handleImageChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === "carton") {
          setNewCustomValueCartonImageFile(reader.result);
        } else if (type === "balota") {
          setNewCustomValueBallotImageFile(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveCustomValue = () => {
    if (editIndex !== null) {
      const updatedBingoValues = [...bingo.bingo_values];
      const editedItem = updatedBingoValues[editIndex];
      editedItem.carton_type = selectedCartonType;
      editedItem.ballot_type = selectedBallotType;

      if (selectedCartonType === "default") {
        editedItem.carton_value = editInputsCarton.number;
      } else if (selectedCartonType === "text") {
        editedItem.carton_value = editInputsCarton.text;
      } else if (selectedCartonType === "image") {
        editedItem.carton_value =
          editInputsCarton.imageUrl || newCustomValueCartonImageFile;
      }

      if (selectedBallotType === "default") {
        editedItem.ballot_value = editInputsBallot.number;
      } else if (selectedBallotType === "text") {
        editedItem.ballot_value = editInputsBallot.text;
      } else if (selectedBallotType === "image") {
        editedItem.ballot_value =
          editInputsBallot.imageUrl || newCustomValueBallotImageFile;
      }

      updateBingo((prev) => ({ ...prev, bingo_values: updatedBingoValues }));
    }

    setEditIndex(null);
    setOpenDialogValueCartonAndBallot(false);
  };

  return (
    <Dialog
      open={openDialogValueCartonAndBallot}
      size="xs"
      handler={() => setOpenDialogValueCartonAndBallot(false)}
      className="overflow-y-auto max-h-[80vh]"
    >
      <div className="flex items-center justify-between">
        <DialogHeader className="flex flex-col items-start">
          <Typography color="gray" variant="lead">
            Personalizar Contenido
          </Typography>
        </DialogHeader>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="mr-3 h-5 w-5"
          onClick={() => setOpenDialogValueCartonAndBallot(false)}
        >
          <path
            fillRule="evenodd"
            d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      <DialogBody>
        <div className="flex flex-col gap-2">
          <Typography color="gray" variant="h6">
            Ingresar Valor en el Cartón
          </Typography>
          {renderInputs(
            selectedCartonType,
            editInputsCarton,
            (e) =>
              handleChangeEditInputs(
                e,
                setEditInputsCarton,
                setErrorsInputsCarton,
                validationsEditInputsCarton
              ),
            errorsInputsCarton,
            (e) => handleImageChange(e, "carton")
          )}
          <Typography color="gray" variant="h6">
            Posiciones
          </Typography>
          {dimension === "3x3" && (
            <div className="w-[166px] m-auto p-3 grid grid-cols-3 grid-rows-3 gap-1 justify-center items-center bg-blue-gray-900">
              {[...Array(9)].map((_, index) => (
                <button
                  key={index}
                  className={`square w-5 h-5 m-auto ${
                    selectedPositions.includes(index)
                      ? "bg-yellow-600"
                      : "bg-blue-500"
                  } ${
                    positionsDisabled.includes(index)
                      ? "bg-red-600 cursor-not-allowed"
                      : "bg-blue-500"
                  }`}
                  onClick={() => handleSelectedPosition(index)}
                  disabled={positionsDisabled.includes(index)}
                />
              ))}
            </div>
          )}
          {dimension === "4x4" && (
            <div className="w-[166px] m-auto p-3 grid grid-cols-4 grid-rows-4 gap-1 justify-center items-center bg-blue-gray-900">
              {[...Array(16)].map((_, index) => (
                <button
                  key={index}
                  className={`square w-5 h-5 m-auto ${
                    selectedPositions.includes(index)
                      ? "bg-yellow-600"
                      : "bg-blue-500"
                  } ${
                    positionsDisabled.includes(index)
                      ? "bg-red-600 cursor-not-allowed"
                      : "bg-blue-500"
                  }`}
                  onClick={() => handleSelectedPosition(index)}
                  disabled={positionsDisabled.includes(index)}
                />
              ))}
            </div>
          )}
          {dimension === "5x5" && (
            <div className="w-[166px] m-auto p-3 grid grid-cols-5 grid-rows-5 gap-1 justify-center items-center bg-blue-gray-900">
              {[...Array(25)].map((_, index) => (
                <button
                  key={index}
                  className={`square w-5 h-5 m-auto ${
                    selectedPositions.includes(index)
                      ? "bg-yellow-600"
                      : "bg-blue-500"
                  } ${
                    positionsDisabled.includes(index)
                      ? "bg-red-600 cursor-not-allowed"
                      : "bg-blue-500"
                  }`}
                  onClick={() => handleSelectedPosition(index)}
                  disabled={positionsDisabled.includes(index)}
                />
              ))}
            </div>
          )}
          <Typography color="gray" variant="h6">
            Cambiar el tipo
          </Typography>
          <div className="grid grid-cols-3 gap-3">
            <Button
              className={`bg-gray-200 cursor-pointer text-gray-700 text-center ${
                selectedCartonType === "default" ? "bg-blue-500 text-white" : ""
              }`}
              onClick={() => setSelectedCartonType("default")}
            >
              <h6>Numeros</h6>
            </Button>
            <Button
              className={`h-10 bg-gray-200 cursor-pointer text-gray-700 text-center ${
                selectedCartonType === "text" ? "bg-blue-500 text-white" : ""
              }`}
              onClick={() => setSelectedCartonType("text")}
            >
              <h6>Texto</h6>
            </Button>
            <Button
              className={`h-10 bg-gray-200 cursor-pointer text-gray-700 text-center ${
                selectedCartonType === "image" ? "bg-blue-500 text-white" : ""
              }`}
              onClick={() => setSelectedCartonType("image")}
            >
              <h6>Imagenes</h6>
            </Button>
          </div>
          <Typography color="gray" variant="h6">
            Ingresar Valor en la Balota
          </Typography>
          {renderInputs(
            selectedBallotType,
            editInputsBallot,
            (e) =>
              handleChangeEditInputs(
                e,
                setEditInputsBallot,
                setErrorsInputsBallot,
                validationsEditInputsBallot
              ),
            errorsInputsBallot,
            (e) => handleImageChange(e, "balota")
          )}
          <Typography color="gray" variant="h6">
            Cambiar el tipo
          </Typography>
          <div className="grid grid-cols-3 gap-3">
            <Button
              className={`bg-gray-200 cursor-pointer text-gray-700 text-center ${
                selectedBallotType === "default" ? "bg-blue-500 text-white" : ""
              }`}
              onClick={() => setSelectedBallotType("default")}
            >
              <h6>Numeros</h6>
            </Button>
            <Button
              className={`h-10 bg-gray-200 cursor-pointer text-gray-700 text-center ${
                selectedBallotType === "text" ? "bg-blue-500 text-white" : ""
              }`}
              onClick={() => setSelectedBallotType("text")}
            >
              <h6>Texto</h6>
            </Button>
            <Button
              className={`h-10 bg-gray-200 cursor-pointer text-gray-700 text-center ${
                selectedBallotType === "image" ? "bg-blue-500 text-white" : ""
              }`}
              onClick={() => setSelectedBallotType("image")}
            >
              <h6>Imagenes</h6>
            </Button>
          </div>
        </div>
      </DialogBody>
      <DialogFooter className="space-x-2">
        <Button
          variant="text"
          color="gray"
          onClick={() => setOpenDialogValueCartonAndBallot(false)}
        >
          Cancelar
        </Button>
        <Button
          variant="gradient"
          color="gray"
          onClick={handleSaveCustomValue}
          disabled={
            errorsInputsCarton.number ||
            errorsInputsCarton.text ||
            errorsInputsCarton.imageUrl ||
            errorsInputsBallot.number ||
            errorsInputsBallot.text ||
            errorsInputsBallot.imageUrl
          }
        >
          Enviar
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default DialogValueCartonAndBallot;
