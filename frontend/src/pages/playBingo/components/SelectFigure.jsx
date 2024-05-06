import { useState } from "react";
import {
  Button,
  Typography,
  Dialog,
  DialogBody,
  DialogFooter,
  Card,
  CardBody,
} from "@material-tailwind/react";
import bingoRoomService from "../../../services/bingoRoomService";

export const SelectFigure = ({
  bingoTemplates,
  selectedTemplate,
  setSelectedTemplate,
  bingoRoom,
  dimensions,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleChangeFigure = async (figureId) => {
    try {
      await bingoRoomService.updateRoom(bingoRoom._id, {
        bingoFigure: figureId,
      });
      setSelectedTemplate(figureId);
      setIsDialogOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  const filteredTemplates = bingoTemplates.filter(
    (template) => template.format === dimensions
  );

  const groupedTemplates = filteredTemplates.reduce((acc, template) => {
    const { category } = template;
    if (!acc[category]) acc[category] = [];
    acc[category].push(template);
    return acc;
  }, {});

  return (
    <div align="center">
      <Typography>
        {bingoTemplates.find((t) => t._id === selectedTemplate)?.title ||
          "Ninguna seleccionada"}
      </Typography>

      <Dialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        size="lg"
      >
        <Card className="max-h-[80vh] overflow-y-auto">
          <CardBody>
            <Typography variant="h5" className="mb-4">
              Elige una figura de Bingo
            </Typography>
            <div className="space-y-4">
              {Object.keys(groupedTemplates).length ? (
                Object.entries(groupedTemplates).map(
                  ([category, templates]) => (
                    <div key={category}>
                      <Typography variant="h6" className="mb-2">
                        {category}
                      </Typography>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {templates.map((template) => (
                          <Button
                            key={template._id}
                            onClick={() => handleChangeFigure(template._id)}
                            className="flex flex-col items-center"
                          >
                            <img
                              src={template.image}
                              alt={template.title}
                              className="mb-2"
                              style={{ maxWidth: "100px", maxHeight: "100px" }}
                            />
                            <Typography>{template.title}</Typography>
                          </Button>
                        ))}
                      </div>
                    </div>
                  )
                )
              ) : (
                <Typography>No hay figuras disponibles</Typography>
              )}
            </div>
          </CardBody>
        </Card>
        <DialogFooter className="flex justify-end">
          <Button variant="text" onClick={() => setIsDialogOpen(false)}>
            Cerrar
          </Button>
        </DialogFooter>
      </Dialog>

      {selectedTemplate && (
        <img
          src={bingoTemplates.find((t) => t._id === selectedTemplate)?.image}
          alt="Figura de Bingo"
          width={"100"}
          height={"60"}
          className="m-auto mt-2"
        />
      )}
      <Button
        onClick={() => setIsDialogOpen(true)}
        size="sm"
        className="mt-2 normal-case"
      >
        Cambiar figura
      </Button>
    </div>
  );
};
