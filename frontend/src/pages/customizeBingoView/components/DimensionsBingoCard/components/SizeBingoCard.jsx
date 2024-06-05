import { useContext, useState, useEffect, useRef, useCallback } from "react";
import { Carousel, Typography, Button } from "@material-tailwind/react";
import { NewBingoContext } from "../../../context/NewBingoContext";

const SizeBingoCard = ({
  getPositionsDisablesAndDimension,
  onConfigChange,
}) => {
  const { bingo, updateBingo } = useContext(NewBingoContext);
  const [selectedDimensions, setSelectedDimensions] = useState(null);
  const [disabledPositions, setDisabledPositions] = useState([]);
  const [sizeChangeCount, setSizeChangeCount] = useState(0);
  const carouselRef = useRef(null);

  const sectionRefs = {
    "3x3": useRef(null),
    "4x4": useRef(null),
    "5x5": useRef(null),
  };

  useEffect(() => {
    if (bingo) {
      setSelectedDimensions(bingo.dimensions);
      setDisabledPositions(
        bingo.positions_disabled.map((item) => item.position)
      );
    }
  }, [bingo]);

  useEffect(() => {
    getPositionsDisablesAndDimension(disabledPositions, selectedDimensions);
  }, [disabledPositions, selectedDimensions, getPositionsDisablesAndDimension]);

  const handleDisabledPosition = useCallback(
    (index) => {
      setDisabledPositions((prevDisabledPositions) => {
        const isSelected = prevDisabledPositions.includes(index);
        const newDisabledPositions = isSelected
          ? prevDisabledPositions.filter((pos) => pos !== index)
          : [...prevDisabledPositions, index];

        updateBingo((prevState) => {
          const newBingoCard = { ...prevState };
          const existingIndex = newBingoCard.positions_disabled.findIndex(
            (item) => item.position === index
          );

          if (isSelected && existingIndex !== -1) {
            newBingoCard.positions_disabled.splice(existingIndex, 1);
          } else if (!isSelected && existingIndex === -1) {
            newBingoCard.positions_disabled.push({
              position: index,
              default_image: "",
            });
          }

          return newBingoCard;
        });

        return newDisabledPositions;
      });
    },
    [updateBingo]
  );

  const handleSizeChange = useCallback(
    (newDimension) => {
      const currentDimension = bingo.dimensions;

      if (sizeChangeCount > 0 && currentDimension !== newDimension) {
        const confirmChange = window.confirm(
          "¿Estás seguro de cambiar el tamaño del cartón?"
        );
        if (!confirmChange) return;
      }

      if (currentDimension !== newDimension) {
        updateBingo((prevBingoCard) => ({
          ...prevBingoCard,
          dimensions: newDimension,
          bingo_values: prevBingoCard.bingo_values.map((value) => ({
            ...value,
            positions: [],
          })),
        }));

        setSelectedDimensions(newDimension);
        moveToSlide(newDimension);
        setSizeChangeCount((prevCount) => prevCount + 1);
      }
    },
    [bingo.dimensions, sizeChangeCount, updateBingo]
  );

  const moveToSlide = useCallback((dimension) => {
    const index = ["3x3", "4x4", "5x5"].indexOf(dimension);
    if (carouselRef.current && sectionRefs[dimension]?.current) {
      sectionRefs[dimension].current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  const renderGrid = (size) => {
    const gridSize = parseInt(size[0]);
    return (
      <Button
        color="white"
        className={`my-2 ${
          selectedDimensions === size ? "bg-yellow-300" : "bg-white"
        }`}
      >
        <div
          className={`grid grid-cols-${gridSize} gap-1 justify-center items-center`}
        >
          {[...Array(gridSize * gridSize)].map((_, index) => (
            <div
              key={index}
              className={`square w-6 h-6 m-auto ${
                disabledPositions.includes(index)
                  ? "bg-red-500"
                  : "bg-blue-500 cursor-pointer"
              }`}
              onClick={() => handleDisabledPosition(index)}
            ></div>
          ))}
        </div>
      </Button>
    );
  };

  const renderSizeButton = (size) => (
    <Button
      className="text-center"
      size="sm"
      onClick={() => handleSizeChange(size)}
    >
      {size}
    </Button>
  );

  return (
    <Carousel
      ref={carouselRef}
      className="rounded-xl h-auto w-full bg-blue-gray-50 pb-7"
      navigation={({ setActiveIndex, activeIndex, length }) => (
        <div className="w-20 absolute bottom-4 left-2/4 z-50 -translate-x-2/4 flex justify-evenly items-center">
          {new Array(length).fill("").map((_, i) => (
            <span
              key={i}
              className={`block h-1 cursor-pointer rounded-2xl transition-all content-[''] ${
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
      autoplay={false}
      loop={false}
    >
      {["3x3", "4x4", "5x5"].map((size, index) => (
        <div
          key={index}
          ref={sectionRefs[size]}
          className="flex flex-col justify-center items-center"
        >
          <Typography variant="paragraph" className="text-center mt-2">
            Inhabilitar celdas en el cartón
          </Typography>
          {renderGrid(size)}
          <div className="flex flex-col items-center mt-4">
            <Typography variant="paragraph" className="text-center mb-1">
              Seleccionar tamaño del cartón
            </Typography>
            {renderSizeButton(size)}
          </div>
        </div>
      ))}
    </Carousel>
  );
};

export default SizeBingoCard;
