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
import bingoServices from "../../../services/bingoService";

export const SelectFigure = ({
  figures,
  selectedFigure,
  setSelectedFigure,
  bingo,
  dimensions,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleChangeFigure = async (figureId) => {
    try {
      await bingoServices.updateBingo(bingo._id, {
        bingo_figure: figureId,
      });
      setSelectedFigure(figureId);
      setIsDialogOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  const filteredFigures = figures.filter(
    (figure) => figure.format === dimensions
  );

  const groupedFigures = filteredFigures.reduce((acc, figure) => {
    const { category } = figure;
    if (!acc[category]) acc[category] = [];
    acc[category].push(figure);
    return acc;
  }, {});

  return (
    <div align="center">
      <Typography>
        {figures.find((t) => t._id === filteredFigures)?.title ||
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
              {Object.keys(groupedFigures).length ? (
                Object.entries(groupedFigures).map(([category, figure]) => (
                  <div key={category}>
                    <Typography variant="h6" className="mb-2">
                      {category}
                    </Typography>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {figure.map((figure) => (
                        <Button
                          key={figure._id}
                          onClick={() => handleChangeFigure(figure._id)}
                          className="flex flex-col items-center"
                        >
                          <img
                            src={figure.image}
                            alt={figure.title}
                            className="mb-2"
                            style={{ maxWidth: "100px", maxHeight: "100px" }}
                          />
                          <Typography>{figure.title}</Typography>
                        </Button>
                      ))}
                    </div>
                  </div>
                ))
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

      {selectedFigure && (
        <img
          src={figures.find((t) => t._id === selectedFigure)?.image}
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
