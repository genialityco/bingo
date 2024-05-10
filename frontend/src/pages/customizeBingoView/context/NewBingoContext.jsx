import React, { createContext, useState } from "react";

export const NewBingoContext = createContext();

export const NewBingoContextProvider = (props) => {
  //estado creación de un objeto del carton del bingo personalizado
  const [bingo, setBingo] = useState({
    name: "",
    rules: "",
    creator_id: null,
    bingo_appearance: {
      background_color: "",
      background_image: "",
      banner: "",
      footer: "",
      dial_image: "",
    },
    bingo_values: [
      {
        carton_value: "",
        carton_type: "",
        ballot_value: "",
        ballot_type: "",
        position: [],
      },
    ],
    positions_disabled: [
      {
        position: 0,
        default_image: "",
      },
    ],
    dimensions: "",
  });

  // Función para modificar el estado del bingo
  const updateBingo = (updatedData) => {
    setBingo(updatedData);
  };

  return (
    <NewBingoContext.Provider value={{ bingo, updateBingo }}>
      {props.children}
    </NewBingoContext.Provider>
  );
};
