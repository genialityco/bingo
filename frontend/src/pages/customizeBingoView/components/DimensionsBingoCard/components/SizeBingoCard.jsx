import { useContext, useState, useEffect, useRef, useCallback } from "react";
import { Carousel, Typography, Button } from "@material-tailwind/react";
import { NewBingoContext } from "../../../context/NewBingoContext";

const SizeBingoCard = ({ getPositionsDisablesAndDimension }) => {
  const { bingo, updateBingo } = useContext(NewBingoContext);
  const [selectedDimensions, setSelectedDimensions] = useState(null);
  const [disabledPositions, setDisabledPositions] = useState([]);
  const [sizeChangeCount, setSizeChangeCount] = useState(0);
  const carouselRef = useRef(null);

  const dimensionRefs = {
    "3x3": useRef(null),
    "4x4": useRef(null),
    "5x5": useRef(null),
  };

  useEffect(() => {
    if (bingo) {
      setSelectedDimensions(bingo.dimensions);
      setDisabledPositions(bingo.positions_disabled.map(({ position }) => position));
    }
  }, [bingo]);

  useEffect(() => {
    getPositionsDisablesAndDimension(disabledPositions, selectedDimensions);
  }, [disabledPositions, selectedDimensions, getPositionsDisablesAndDimension]);

  const toggleDisabledPosition = useCallback((index) => {
    setDisabledPositions((prev) => {
      const isSelected = prev.includes(index);
      const updatedPositions = isSelected
        ? prev.filter((pos) => pos !== index)
        : [...prev, index];

      updateBingo((prevState) => {
        const newBingoCard = { ...prevState };
        const existingIndex = newBingoCard.positions_disabled.findIndex(
          (item) => item.position === index
        );

        if (isSelected && existingIndex !== -1) {
          newBingoCard.positions_disabled.splice(existingIndex, 1);
        } else if (!isSelected && existingIndex === -1) {
          newBingoCard.positions_disabled.push({ position: index, default_image: "" });
        }

        return newBingoCard;
      });

      return updatedPositions;
    });
  }, [updateBingo]);

  const handleSizeChange = useCallback((newDimension) => {
    if (sizeChangeCount > 0 && bingo.dimensions !== newDimension) {
      const confirmChange = window.confirm("¿Estás seguro de cambiar el tamaño del cartón?");
      if (!confirmChange) return;
    }

    if (bingo.dimensions !== newDimension) {
      updateBingo((prevBingoCard) => ({
        ...prevBingoCard,
        dimensions: newDimension,
        bingo_values: prevBingoCard.bingo_values.map((value) => ({ ...value, positions: [] })),
      }));
      setSelectedDimensions(newDimension);
      moveToSlide(newDimension);
      setSizeChangeCount((prev) => prev + 1);
    }
  }, [bingo.dimensions, sizeChangeCount, updateBingo]);

  const moveToSlide = useCallback((dimension) => {
    dimensionRefs[dimension]?.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const renderGrid = (size) => {
    const gridSize = parseInt(size[0], 10);
    return (
      <Button color="white" className={`my-2 ${selectedDimensions === size ? "bg-yellow-300" : "bg-white"}`}>
        <div className={`grid grid-cols-${gridSize} gap-1`}>
          {[...Array(gridSize * gridSize)].map((_, index) => (
            <div
              key={index}
              className={`w-6 h-6 m-auto ${disabledPositions.includes(index) ? "bg-red-500" : "bg-blue-500 cursor-pointer"}`}
              onClick={() => toggleDisabledPosition(index)}
            ></div>
          ))}
        </div>
      </Button>
    );
  };

  return (
    <Carousel
      ref={carouselRef}
      className="rounded-xl h-auto w-full bg-blue-gray-50 pb-7"
      autoplay={false}
      loop={false}
      navigation={({ setActiveIndex, activeIndex, length }) => (
        <div className="w-20 absolute bottom-4 left-2/4 z-50 -translate-x-2/4 flex justify-evenly items-center">
          {Array.from({ length }, (_, i) => (
            <span
              key={i}
              className={`block h-1 cursor-pointer rounded-2xl transition-all ${
                activeIndex === i ? "w-8 bg-white" : "w-4 bg-white/50"
              }`}
              onClick={() => {
                setActiveIndex(i);
                moveToSlide(["3x3", "4x4", "5x5"][i]);
              }}
            />
          ))}
        </div>
      )}
    >
      {["3x3", "4x4", "5x5"].map((size, index) => (
        <div key={index} ref={dimensionRefs[size]} className="flex flex-col justify-center items-center">
          <Typography variant="paragraph" className="text-center mt-2">Inhabilitar celdas en el cartón</Typography>
          {renderGrid(size)}
          <div className="flex flex-col items-center mt-4">
            <Typography variant="paragraph" className="text-center mb-1">Seleccionar tamaño del cartón</Typography>
            <Button className="text-center" size="sm" onClick={() => handleSizeChange(size)}>{size}</Button>
          </div>
        </div>
      ))}
    </Carousel>
  );
};

export default SizeBingoCard;
