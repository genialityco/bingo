import {
  Typography,
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
  Tabs,
  TabsHeader,
  Tab,
  TabsBody,
  TabPanel,
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
      setInitialValues(selectedItem);
    }
  }, [selectedItem]);

  const setInitialValues = (item) => {
    setSelectedCartonType(item.carton_type || "");
    setSelectedBallotType(item.ballot_type || "");
    setSelectedPositions(item.positions || []);

    const initialCartonValues = getInitialValues(
      item.carton_type,
      item.carton_value
    );
    const initialBallotValues = getInitialValues(
      item.ballot_type,
      item.ballot_value
    );

    setEditInputsCarton(initialCartonValues);
    setEditInputsBallot(initialBallotValues);
  };

  const getInitialValues = (type, value) => {
    switch (type) {
      case "default":
        return { number: value || "", text: "", imageUrl: "" };
      case "text":
        return { number: "", text: value || "", imageUrl: "" };
      case "image":
        return { number: "", text: "", imageUrl: value || "" };
      default:
        return { number: "", text: "", imageUrl: "" };
    }
  };

  const renderInputs = (
    type,
    editInputs,
    handleChange,
    errors,
    handleImageChange
  ) => {
    switch (type) {
      case "default":
        return (
          <div className="my-2">
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
      case "text":
        return (
          <div className="my-2">
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
      case "image":
        return (
          <>
            <Typography className="mb-3" color="gray" variant="paragraph">
              Carga una imagen o ingresa la url de la imagen.
            </Typography>
            <div className="grid gap-2">
              <Input
                label="Selecciona un archivo"
                type="file"
                placeholder="Selecciona un archivo de imagen"
                onChange={handleImageChange}
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
      default:
        return null;
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
    const newSelectedPositions = togglePosition(selectedPositions, index);
    setSelectedPositions(newSelectedPositions);
    updateSelectedPositionsInBingo(newSelectedPositions);
  };

  const togglePosition = (positions, index) => {
    return positions.includes(index)
      ? positions.filter((pos) => pos !== index)
      : [...positions, index];
  };

  const updateSelectedPositionsInBingo = (newPositions) => {
    updateBingo((prev) => {
      const updatedValues = prev.bingo_values.map((value, idx) => {
        if (idx === editIndex) {
          value.positions = newPositions;
        }
        return value;
      });
      return { ...prev, bingo_values: updatedValues };
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
      saveUpdatedValues();
    }
    setEditIndex(null);
    setOpenDialogValueCartonAndBallot(false);
  };

  const saveUpdatedValues = () => {
    const updatedBingoValues = [...bingo.bingo_values];
    const editedItem = updatedBingoValues[editIndex];

    editedItem.carton_type = selectedCartonType;
    editedItem.ballot_type = selectedBallotType;

    editedItem.carton_value = getUpdatedValue(
      selectedCartonType,
      editInputsCarton,
      newCustomValueCartonImageFile
    );
    editedItem.ballot_value = getUpdatedValue(
      selectedBallotType,
      editInputsBallot,
      newCustomValueBallotImageFile
    );

    updateBingo((prev) => ({ ...prev, bingo_values: updatedBingoValues }));
  };

  const getUpdatedValue = (type, editInputs, newImageFile) => {
    switch (type) {
      case "default":
        return editInputs.number;
      case "text":
        return editInputs.text;
      case "image":
        return editInputs.imageUrl || newImageFile;
      default:
        return "";
    }
  };

  const renderPositionGrid = (dimension) => {
    const dimensions = {
      "3x3": 9,
      "4x4": 16,
      "5x5": 25,
    };

    const gridSize = dimensions[dimension] || 0;
    const gridCols = Math.sqrt(gridSize);

    return (
      <div
        className={`w-[166px] m-auto p-3 grid grid-cols-${gridCols} gap-1 justify-center items-center bg-blue-gray-900`}
      >
        {[...Array(gridSize)].map((_, index) => (
          <button
            key={index}
            className={`aspect-square w-full h-full flex justify-center items-center ${
              selectedPositions.includes(index)
                ? "bg-yellow-600"
                : positionsDisabled.includes(index)
                ? "bg-red-600 cursor-not-allowed"
                : "bg-blue-500"
            }`}
            onClick={() => handleSelectedPosition(index)}
            disabled={positionsDisabled.includes(index)}
          />
        ))}
      </div>
    );
  };

  return (
    <Dialog
      open={openDialogValueCartonAndBallot}
      size="sm"
      handler={() => setOpenDialogValueCartonAndBallot(false)}
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
      <DialogBody className="overflow-y-auto max-h-[70vh]">
        <Tabs value="0">
          <TabsHeader>
            <Tab key="carton" value="0">
              Valor Cartón
            </Tab>
            <Tab key="balota" value="1">
              Valor Balota
            </Tab>
          </TabsHeader>
          <TabsBody>
            <TabPanel key="carton" value="0">
              <hr className="mt-5 border-blue-gray-200" />
              <Typography color="gray" variant="h6" className="my-2">
                Tipo de contenido
              </Typography>
              <Typography color="gray" variant="small" className="my-2">
                Escoge aquí si las celdas en el cartón tendrán, números, texto o
                imagenes.
              </Typography>
              <div className="grid grid-cols-3 gap-2 my-3">
                {["default", "text", "image"].map((type) => (
                  <Button
                    key={type}
                    className={`bg-gray-200 cursor-pointer text-gray-700 w-full flex justify-center items-center ${
                      selectedCartonType === type
                        ? "bg-blue-500 text-white"
                        : ""
                    }`}
                    onClick={() => setSelectedCartonType(type)}
                  >
                    <h6 className="m-auto">
                      {type === "default"
                        ? "Numeros"
                        : type === "text"
                        ? "Texto"
                        : "Imagenes"}
                    </h6>
                  </Button>
                ))}
              </div>

              <hr className="mt-5 border-blue-gray-200" />
              <Typography color="gray" variant="h6" className="my-3">
                Valor en el Cartón
              </Typography>
              <Typography color="gray" variant="small" className="mb-4">
                Ingresa aquí el valor de la celda en el cartón.
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

              <hr className="mt-5 border-blue-gray-200" />
              <Typography color="gray" variant="h6" className="my-3">
                Posiciones
              </Typography>
              <Typography color="gray" variant="small" className="mb-4">
                Ingresa aquí las celdas en las que podrá aparecer este valor en
                el cartón.
              </Typography>
              {renderPositionGrid(dimension)}
              <hr className="mt-5 border-blue-gray-200" />
            </TabPanel>
            <TabPanel key="balota" value="1">
              <hr className="mt-5 border-blue-gray-200" />
              <Typography color="gray" variant="h6" className="my-2">
                Cambiar el tipo
              </Typography>
              <Typography color="gray" variant="small" className="my-2">
                Escoge aquí si las balotas del bingo tendrán, números, texto o
                imagenes.
              </Typography>
              <div className="grid grid-cols-3 gap-3">
                {["default", "text", "image"].map((type) => (
                  <Button
                    key={type}
                    className={`bg-gray-200 cursor-pointer text-gray-700 w-full flex justify-center items-center ${
                      selectedBallotType === type
                        ? "bg-blue-500 text-white"
                        : ""
                    }`}
                    onClick={() => setSelectedBallotType(type)}
                  >
                    <h6>
                      {type === "default"
                        ? "Numeros"
                        : type === "text"
                        ? "Texto"
                        : "Imagenes"}
                    </h6>
                  </Button>
                ))}
              </div>
              <hr className="mt-5 border-blue-gray-200" />
              <Typography color="gray" variant="h6" className="my-2">
                Ingresa el valor de la balota
              </Typography>
              <Typography color="gray" variant="small" className="mb-4">
                Ingresa aquí el valor de la balota en el bingo.
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
              <hr className="mt-5 border-blue-gray-200" />
            </TabPanel>
          </TabsBody>
        </Tabs>
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
            Object.values(errorsInputsCarton).some(Boolean) ||
            Object.values(errorsInputsBallot).some(Boolean)
          }
        >
          Enviar
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default DialogValueCartonAndBallot;
