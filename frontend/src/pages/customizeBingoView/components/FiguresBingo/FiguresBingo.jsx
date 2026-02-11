import { useContext, useEffect, useMemo, useState } from "react";
import {
  Card,
  CardBody,
  Typography,
  Button,
  Input,
} from "@material-tailwind/react";
import { v4 as uuidv4 } from "uuid";
import { NewBingoContext } from "../../context/NewBingoContext";
import { useLoading } from "../../../../context/LoadingContext";
import bingoFigureServices from "../../../../services/bingoFigureServices";
import { uploadBase64ImageToFirebase } from "../../../../utils/validationImageExternalUrl";

const DEFAULT_FORMATS = ["3x3", "4x4", "5x5"];

const FiguresBingo = () => {
  const { bingo } = useContext(NewBingoContext);
  const { showLoading, hideLoading } = useLoading();

  const [figures, setFigures] = useState([]);
  const [filterFormat, setFilterFormat] = useState(bingo?.dimensions || "5x5");
  const [form, setForm] = useState({
    title: "",
    format: bingo?.dimensions || "5x5",
    category: "",
    indices: "",
    imageBase64: "",
  });
  const [selectedPositions, setSelectedPositions] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const gridColsClass = {
    "3x3": "grid-cols-3",
    "4x4": "grid-cols-4",
    "5x5": "grid-cols-5",
  };

  const loadFigures = async () => {
    try {
      const data = await bingoFigureServices.getAllFigures();
      setFigures(data || []);
    } catch (err) {
      setError("Error al cargar figuras");
    }
  };

  useEffect(() => {
    loadFigures();
  }, []);

  const groupedFigures = useMemo(() => {
    const filtered = filterFormat
      ? figures.filter((figure) => figure.format === filterFormat)
      : figures;

    return filtered.reduce((acc, figure) => {
      const category = figure.category || "Sin categoria";
      if (!acc[category]) acc[category] = [];
      acc[category].push(figure);
      return acc;
    }, {});
  }, [figures, filterFormat]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormatChange = (event) => {
    const value = event.target.value;
    setForm((prev) => ({ ...prev, format: value, indices: "" }));
    setSelectedPositions([]);
  };

  const handleFilterChange = (event) => {
    setFilterFormat(event.target.value);
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setForm((prev) => ({ ...prev, imageBase64: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const parseIndices = (value) => {
    return value
      .split(",")
      .map((item) => parseInt(item.trim(), 10))
      .filter((item) => Number.isFinite(item));
  };

  const handleTogglePosition = (index) => {
    setSelectedPositions((prev) => {
      const updated = prev.includes(index)
        ? prev.filter((pos) => pos !== index)
        : [...prev, index];
      const sorted = [...updated].sort((a, b) => a - b);
      setForm((prevForm) => ({
        ...prevForm,
        indices: sorted.join(","),
      }));
      return updated;
    });
  };

  const handleClearPositions = () => {
    setSelectedPositions([]);
    setForm((prev) => ({ ...prev, indices: "" }));
  };

  const renderPositionGrid = () => {
    const gridSizeMap = {
      "3x3": 9,
      "4x4": 16,
      "5x5": 25,
    };
    const total = gridSizeMap[form.format] || 0;

    return (
      <div
        className={`grid ${gridColsClass[form.format]} gap-1 justify-center items-center`}
      >
        {Array.from({ length: total }, (_, index) => (
          <button
            key={index}
            type="button"
            className={`w-8 h-8 text-xs rounded ${
              selectedPositions.includes(index)
                ? "bg-green-500 text-white"
                : "bg-blue-100 text-blue-gray-700"
            }`}
            onClick={() => handleTogglePosition(index)}
          >
            {index}
          </button>
        ))}
      </div>
    );
  };

  const handleCreateFigure = async () => {
    setError("");
    const indexArray = parseIndices(form.indices);

    if (!form.title || !form.format || !form.category || !indexArray.length) {
      setError("Completa titulo, formato, categoria e indices");
      return;
    }

    if (!form.imageBase64) {
      setError("Selecciona una imagen para la figura");
      return;
    }

    setIsSaving(true);
    showLoading();

    try {
      const imageUrl = await uploadBase64ImageToFirebase(
        form.imageBase64,
        uuidv4()
      );

      await bingoFigureServices.createFigure({
        title: form.title,
        format: form.format,
        category: form.category,
        image: imageUrl,
        index_to_validate: indexArray,
      });

      setForm({
        title: "",
        format: form.format,
        category: "",
        indices: "",
        imageBase64: "",
      });
      setSelectedPositions([]);

      await loadFigures();
    } catch (err) {
      setError("No se pudo crear la figura");
    } finally {
      hideLoading();
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full">
      <div className="w-full max-w-6xl mx-auto">
        <div className="mb-6 rounded-2xl border border-blue-gray-100 bg-gradient-to-br from-amber-50 to-sky-50 p-6">
          <Typography variant="h4" className="mb-2">
            Figuras de bingo
          </Typography>
          <Typography variant="paragraph" color="gray">
            Crea y organiza figuras segun el formato del carton.
          </Typography>
        </div>
      </div>

      <Card className="w-full max-w-6xl mx-auto mb-6 rounded-2xl border border-blue-gray-100 shadow-sm">
        <CardBody>
          <div className="flex flex-col gap-1 mb-4">
            <Typography variant="h5">Crear figura</Typography>
            <Typography variant="small" color="gray">
              Define la figura y selecciona las celdas del carton.
            </Typography>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              label="Titulo"
              name="title"
              value={form.title}
              onChange={handleInputChange}
            />
            <Input
              label="Categoria"
              name="category"
              value={form.category}
              onChange={handleInputChange}
            />
            <div>
              <label className="text-sm text-blue-gray-600">Formato</label>
              <select
                className="w-full border border-blue-gray-200 rounded-md px-2 py-2"
                value={form.format}
                onChange={handleFormatChange}
              >
                {DEFAULT_FORMATS.map((format) => (
                  <option key={format} value={format}>
                    {format}
                  </option>
                ))}
              </select>
            </div>
            <Input
              label="Indices (coma separados)"
              name="indices"
              value={form.indices}
              onChange={handleInputChange}
              readOnly
              placeholder="0,1,2,3,4"
            />
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-blue-gray-100 bg-blue-gray-50/40 p-4">
              <div className="flex items-center justify-between mb-3">
                <Typography variant="small" color="blue-gray">
                  Selecciona indices del carton
                </Typography>
                <Button
                  variant="text"
                  size="sm"
                  onClick={handleClearPositions}
                >
                  Limpiar
                </Button>
              </div>
              <div className="rounded-lg bg-white/80 p-3 shadow-inner">
                {renderPositionGrid()}
              </div>
            </div>
            <div className="rounded-xl border border-blue-gray-100 bg-white p-4">
              <Typography variant="small" color="blue-gray" className="mb-2">
                Imagen de la figura
              </Typography>
              <input
                type="file"
                accept="image/*"
                className="block w-full text-sm text-blue-gray-700"
                onChange={handleImageChange}
              />
              {form.imageBase64 && (
                <div className="mt-3 rounded-lg border border-blue-gray-100 bg-blue-gray-50/40 p-3">
                  <img
                    src={form.imageBase64}
                    alt="Preview"
                    className="w-full h-28 object-contain"
                  />
                </div>
              )}
            </div>
          </div>
          {error && (
            <Typography color="red" className="mt-3">
              {error}
            </Typography>
          )}
          <Button
            className="mt-4"
            onClick={handleCreateFigure}
            disabled={isSaving}
          >
            {isSaving ? "Guardando..." : "Crear figura"}
          </Button>
        </CardBody>
      </Card>

      <Card className="w-full max-w-6xl mx-auto rounded-2xl border border-blue-gray-100 shadow-sm">
        <CardBody>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
            <Typography variant="h5">Figuras disponibles</Typography>
            <div className="flex items-center gap-2">
              <Typography variant="small">Formato</Typography>
              <select
                className="border border-blue-gray-200 rounded-md px-2 py-1"
                value={filterFormat}
                onChange={handleFilterChange}
              >
                {DEFAULT_FORMATS.map((format) => (
                  <option key={format} value={format}>
                    {format}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {Object.keys(groupedFigures).length ? (
            Object.entries(groupedFigures).map(([category, items]) => (
              <div key={category} className="mb-5">
                <Typography variant="h6" className="mb-2">
                  {category}
                </Typography>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {items.map((figure) => (
                    <Card
                      key={figure._id}
                      className="p-3 rounded-xl border border-blue-gray-100 shadow-sm"
                    >
                      <Typography
                        variant="small"
                        className="mb-2 text-blue-gray-700"
                      >
                        {figure.title}
                      </Typography>
                      <img
                        src={figure.image}
                        alt={figure.title}
                        className="w-full h-24 object-contain"
                      />
                      <Typography
                        variant="small"
                        className="mt-2 text-blue-gray-500"
                      >
                        {figure.format}
                      </Typography>
                    </Card>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <Typography>No hay figuras para este formato</Typography>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default FiguresBingo;
