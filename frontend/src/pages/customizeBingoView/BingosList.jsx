import {
  ButtonGroup,
  Button,
  Card,
  CardBody,
  CardFooter,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
  Select,
  Option,
} from "@material-tailwind/react";
import { useEffect, useState, useCallback } from "react";
import { useLoading } from "../../context/LoadingContext";
import { Link } from "react-router-dom";

// Importaciones de servicios
import bingoServices from "../../services/bingoService";
import bingoTemplateServices from "../../services/bingoTemplateService";

// Componentes principales
const BingoList = () => {
  // Estados para listas y errores
  const [bingos, setBingos] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [loadingBingos, setLoadingBingos] = useState(true);
  const [loadingTemplates, setLoadingTemplates] = useState(true);
  const [errorBingos, setErrorBingos] = useState(null);
  const [errorTemplates, setErrorTemplates] = useState(null);

  // Estado del diálogo de creación
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newBingo, setNewBingo] = useState({
    name: "",
    bingo_code: "",
    templateId: "",
  });

  const { isLoading, showLoading, hideLoading } = useLoading();

  // Funciones para obtener listas
  const fetchBingos = useCallback(async () => {
    setLoadingBingos(true);
    try {
      const response = await bingoServices.getAllBingos(
        showLoading,
        hideLoading
      );
      setBingos(response);
    } catch (err) {
      setErrorBingos("Error al obtener la lista de bingos");
    } finally {
      setLoadingBingos(false);
    }
  }, [showLoading, hideLoading]);

  const fetchTemplates = useCallback(async () => {
    setLoadingTemplates(true);
    try {
      const { data } = await bingoTemplateServices.listAllTemplates(
        showLoading,
        hideLoading
      );
      setTemplates(data);
    } catch (err) {
      setErrorTemplates("Error al obtener la lista de plantillas");
    } finally {
      setLoadingTemplates(false);
    }
  }, [showLoading, hideLoading]);

  // Uso de useEffect para llamar a las funciones de carga
  useEffect(() => {
    fetchBingos();
    fetchTemplates();
  }, [fetchBingos, fetchTemplates]);

  // Manejo de diálogos
  const openDialog = () => setIsDialogOpen(true);
  const closeDialog = () => setIsDialogOpen(false);

  // Manejo del formulario de creación
  const handleBingoChange = (event) => {
    const { name, value } = event.target;
    setNewBingo({ ...newBingo, [name]: value });
  };

  const handleTemplateSelect = (value) => {
    setNewBingo({ ...newBingo, templateId: value });
  };

  const createNewBingo = async () => {
    try {
      const newBingoData = {
        ...newBingo,
        capacity: 100,
        bingo_code: `ROOM${Math.random().toString(36).substring(2, 8)}`,
      };

      const originalTemplate = await bingoTemplateServices.getTemplateById(
        newBingoData.templateId
      );
      if (!originalTemplate) {
        console.error("Template no encontrado");
        return;
      }

      const copiedTemplate = {
        ...originalTemplate,
        _id: undefined,
        name: newBingoData.name,
        bingo_code: newBingoData.bingo_code,
        is_template: false,
        is_public: false,
      };

      const newBingoCreated = await bingoServices.createBingo(
        copiedTemplate,
        showLoading,
        hideLoading
      );

      if (newBingoCreated) {
        fetchBingos();
        closeDialog();
      } else {
        console.error("No se pudo crear el nuevo Bingo");
      }
    } catch (error) {
      console.error("Error al crear el nuevo Bingo:", error);
    }
  };

  const convertToTemplate = async (bingo) => {
    try {
      const newTemplate = {
        ...bingo,
        _id: undefined,
        is_public: false,
        is_template: true,
      };
      await bingoTemplateServices.createTemplate(
        newTemplate,
        showLoading,
        hideLoading
      );
      fetchTemplates();
    } catch (error) {
      console.error(error);
    }
  };

  const BingoCard = ({ bingo }) => (
    <Card className="bg-blue-gray-100 flex flex-col justify-between h-full w-full">
      <CardBody className="flex-grow">
        <h3 className="text-xl font-bold">{bingo.name}</h3>
      </CardBody>
      <CardFooter>
        <ButtonGroup>
          <Button className="normal-case" size="sm">
            <Link to={`/customize-bingo?bingoId=${bingo._id}`}>
              Personalizar
            </Link>
          </Button>
          <Button className="normal-case" size="sm">
            <Link to={`/play-bingo/${bingo._id}`}>Iniciar bingo</Link>
          </Button>
          <Button
            className="normal-case"
            size="sm"
            onClick={() => convertToTemplate(bingo)}
          >
            Convertir en plantilla
          </Button>
        </ButtonGroup>
      </CardFooter>
    </Card>
  );

  const TemplateCard = ({ template }) => (
    <Card className="bg-teal-100 flex flex-col justify-between h-full">
      <CardBody className="flex-grow">
        <h3 className="text-xl font-bold">{template.name}</h3>
      </CardBody>
      <CardFooter>
        <Link
          to={`/customize-bingo?bingoId=${template._id}&isTemplate=true`}
          className="w-1/2"
        >
          <Button className="w-full">Modificar Plantilla</Button>
        </Link>
      </CardFooter>
    </Card>
  );

  return (
    <>
      <div className="p-5">
        <div className="flex gap-5 items-center">
          <h2 className="text-2xl font-bold my-4">Lista de Bingos</h2>
          <Button onClick={openDialog}>Crear Nuevo Bingo</Button>
        </div>
        {!loadingBingos && !errorBingos && bingos.length > 0 ? (
          <div className="grid grid-cols-2 gap-4">{bingos.map((bingo) => <BingoCard key={bingo._id} bingo={bingo} />)}</div>
        ) : loadingBingos ? (
          <p>Cargando bingos...</p>
        ) : (
          <p className="text-center">No se encontraron bingos.</p>
        )}
      </div>

      <div className="p-5">
        <h2 className="text-2xl font-bold my-4">Lista de Plantillas</h2>
        {!loadingTemplates && !errorTemplates && templates.length > 0 ? (
          <div className="grid grid-cols-2 gap-4">
            {templates.map((template) => (
              <TemplateCard key={template._id} template={template} />
            ))}
          </div>
        ) : loadingTemplates ? (
          <p>Cargando plantillas...</p>
        ) : (
          <p className="text-center">No se encontraron plantillas.</p>
        )}
      </div>

      <Dialog open={isDialogOpen} handler={closeDialog}>
        <DialogHeader>Crear Nuevo Bingo</DialogHeader>
        <DialogBody divider>
          <Input
            label="Nombre del Bingo"
            name="name"
            value={newBingo.name}
            onChange={handleBingoChange}
            required
          />
          <Select
            label="Seleccionar plantilla"
            onChange={handleTemplateSelect}
            value={newBingo.templateId}
            disabled={loadingTemplates || templates.length === 0}
            required
          >
            {templates.map((template) => (
              <Option key={template._id} value={template._id}>
                {template.name}
              </Option>
            ))}
          </Select>
        </DialogBody>
        <DialogFooter>
          <Button variant="text" color="red" onClick={closeDialog}>
            Cancelar
          </Button>
          <Button variant="gradient" color="green" onClick={createNewBingo}>
            Crear
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
};

export default BingoList;
