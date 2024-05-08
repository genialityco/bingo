import {
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
import { Link } from "react-router-dom";
import bingoService from "../../services/bingoService";
import bingoRoomService from "../../services/bingoRoomService";

const BingiList = () => {
  // Estados para listas de bingos y plantillas
  const [bingos, setBingos] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [loadingBingos, setLoadingBingos] = useState(true);
  const [loadingTemplates, setLoadingTemplates] = useState(true);
  const [errorBingos, setErrorBingos] = useState(null);
  const [errorTemplates, setErrorTemplates] = useState(null);
  // const [isModalOpen, setIsModalOpen] = useState(false);
  // const [rooms, setRooms] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newBingo, setNewBingo] = useState({
    title: "",
    code: "",
    bingoId: "",
  });

  // Función para obtener la lista de bingos
  const fetchBingos = useCallback(async () => {
    try {
      const { data } = await bingoRoomService.getAllRooms();
      setBingos(data);
    } catch (err) {
      setErrorBingos("Error al obtener la lista de bingos");
    } finally {
      setLoadingBingos(false);
    }
  }, []);

  // Función para obtener la lista de plantillas
  const fetchTemplates = useCallback(async () => {
    try {
      const { data } = await bingoService.listAllBingos();
      setTemplates(data);
    } catch (err) {
      setErrorTemplates("Error al obtener la lista de plantillas");
    } finally {
      setLoadingTemplates(false);
    }
  }, []);

  useEffect(() => {
    fetchBingos();
    fetchTemplates();
  }, [fetchBingos, fetchTemplates]);

  // Funciones para abrir y cerrar el modal y el dialog
  // const openModal = async (bingoId) => {
  //   try {
  //     const response = await bingoRoomService.findRoomByField(
  //       "bingoId",
  //       bingoId
  //     );
  //     let data = Array.isArray(response.data) ? response.data : [response.data];

  //     if (!data.length || !data[0]._id) {
  //       const newRoomData = {
  //         title: `Sala por defecto`,
  //         bingoId: bingoId,
  //         capacity: 100,
  //         roomCode: `ROOM${Math.random().toString(36).substring(2, 8)}`,
  //       };
  //       const newRoom = await bingoRoomService.createRoom(newRoomData);
  //       data = [newRoom.data];
  //     }

  //     setRooms(data);
  //     setIsModalOpen(true);
  //   } catch (error) {
  //     console.error("Error fetching rooms:", error);
  //   }
  // };

  const openDialog = () => {
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  // Función para manejar el formulario de creación del nuevo bingo
  const handleBingoChange = (event) => {
    const { name, value } = event.target;
    setNewBingo({ ...newBingo, [name]: value });
  };

  const handleTemplateSelect = (value) => {
    setNewBingo({ ...newBingo, bingoId: value });
  };

  const createNewBingo = async () => {
    try {
      // Crear los datos básicos para el nuevo Bingo
      const newBingoData = {
        ...newBingo,
        capacity: 100,
        roomCode: `ROOM${Math.random().toString(36).substring(2, 8)}`,
      };

      // Obtener el template original
      const originalTemplate = await bingoService.getBingoById(
        newBingoData.bingoId
      );

      if (!originalTemplate) {
        console.error("Template no encontrado");
        return;
      }

      // Hacer una copia del template
      const copiedTemplate = { ...originalTemplate };
      copiedTemplate._id = undefined; // Limpiar el _id para generar uno nuevo al copiar
      copiedTemplate.title = `Copia del Bingo: ${newBingoData.roomCode} - Template: ${originalTemplate.title}`;

      // Crear el nuevo template copiado en el sistema
      const newTemplate = await bingoService.createBingo(copiedTemplate);

      if (!newTemplate || !newTemplate._id) {
        console.error("No se pudo crear el nuevo template");
        return;
      }

      // Asignar el _id del nuevo template al Bingo
      newBingoData.bingoId = newTemplate._id;

      // Crear el nuevo Bingo con el nuevo template
      const newBingoCreated = await bingoRoomService.createRoom(newBingoData);

      if (newBingoCreated) {
        console.log("Nuevo Bingo creado con éxito:", newBingo.title);
        fetchBingos();
        fetchTemplates();
        closeDialog(); // Cerrar el diálogo si está abierto
      } else {
        console.error("No se pudo crear el nuevo Bingo");
      }
    } catch (error) {
      console.error("Error al crear el nuevo Bingo:", error);
    }
  };

  // Componentes de carga y error para las listas
  const LoadingOrErrorComponent = ({ loading, error, children }) => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-24">
          <svg
            className="animate-spin w-8 h-8 text-green-500"
            viewBox="0 0 64 64"
          ></svg>
        </div>
      );
    }

    if (error) {
      return <div className="text-red-600 text-center mt-8">{error}</div>;
    }

    return children;
  };

  // Renderizado de la lista de bingos
  const renderBingos = () => (
    <div className="w-full m-auto my-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {bingos.length ? (
        bingos.map((bingo) => (
          <Card
            key={bingo._id}
            className="bg-blue-gray-100 flex flex-col justify-between h-full"
          >
            <CardBody className="flex-grow">
              <h3 className="text-xl font-bold">{bingo.title}</h3>
            </CardBody>
            <CardFooter>
              <div className="flex gap-2 w-full">
                <Link
                  to={`/bingo-config?bingoId=${bingo.bingoId}&id=${bingo._id}`}
                  className="w-1/2"
                >
                  <Button className="w-full">Personalizar</Button>
                </Link>
                <Link to={`/play-bingo/${bingo._id}`}>
                  <Button>Iniciar bingo</Button>
                </Link>
              </div>
            </CardFooter>
          </Card>
        ))
      ) : (
        <div className="text-center text-lg text-gray-500">
          No se encontraron bingos.
        </div>
      )}
    </div>
  );

  // Renderizado de la lista de plantillas
  const renderTemplates = () => (
    <div className="w-full m-auto my-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {templates.length ? (
        templates.map((template) => (
          <Card
            key={template._id}
            className="bg-teal-100 flex flex-col justify-between h-full"
          >
            <CardBody className="flex-grow">
              <h3 className="text-xl font-bold">{template.title}</h3>
            </CardBody>
            <CardFooter>
              <div className="flex w-full">
                <Link
                  to={`/bingo-config?bingoId=${template._id}`}
                  className="w-1/2"
                >
                  <Button className="w-full">Modificar Plantilla</Button>
                </Link>
              </div>
            </CardFooter>
          </Card>
        ))
      ) : (
        <div className="text-center text-lg text-gray-500">
          No se encontraron plantillas.
        </div>
      )}
    </div>
  );

  return (
    <>
      <LoadingOrErrorComponent loading={loadingBingos} error={errorBingos}>
        <div className="p-5">
          <div className="flex gap-5 items-center">
            <h2 className="text-2xl font-bold my-4">Lista de Bingos</h2>
            <Button onClick={openDialog}>Crear Nuevo Bingo</Button>
          </div>
          {renderBingos()}
        </div>
      </LoadingOrErrorComponent>

      <LoadingOrErrorComponent
        loading={loadingTemplates}
        error={errorTemplates}
      >
        <div className="p-5">
          <div className="flex gap-5 items-center">
            <h2 className="text-2xl font-bold my-4">Lista de Plantillas</h2>
            <Button>Crear Nueva Plantilla</Button>
          </div>
          {renderTemplates()}
        </div>
      </LoadingOrErrorComponent>

      {/* Modal */}
      {/* {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h3 className="text-xl font-bold mb-4">Salas disponibles</h3>
            <ul>
              {rooms.length > 0 ? (
                rooms.map((room) => (
                  <li
                    key={room._id}
                    className="flex justify-between items-center mb-4"
                  >
                    <span>{room.title || room.name}</span>
                    <Link to={`/play-bingo/${room._id}`}>
                      <Button>Ir a la sala</Button>
                    </Link>
                  </li>
                ))
              ) : (
                <div>No hay salas disponibles.</div>
              )}
            </ul>
            <Button className="mt-4" onClick={closeModal}>
              Cerrar
            </Button>
          </div>
        </div>
      )} */}

      {/* Dialog */}
      <Dialog open={isDialogOpen} handler={closeDialog}>
        <DialogHeader>Crear Nuevo Bingo</DialogHeader>
        <DialogBody divider>
          <Input
            label="Nombre del Bingo"
            name="title"
            value={newBingo.title}
            onChange={handleBingoChange}
            required
          />
          <Select
            label="Seleccionar plantilla del sistema"
            onChange={handleTemplateSelect}
            value={newBingo.bingoId}
            required
          >
            {templates.map((template) => (
              <Option key={template._id} value={template._id}>
                {template.title}
              </Option>
            ))}
          </Select>
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={closeDialog}
            className="mr-1"
          >
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

export default BingiList;
