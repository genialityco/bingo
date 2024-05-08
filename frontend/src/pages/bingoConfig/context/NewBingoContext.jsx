import React, { createContext, useState } from 'react';

export const NewBingoContext = createContext();

export const NewBingoContextProvider = (props) => {

  //estado creación de un objeto del carton del bingo personalizado
  const [bingoCard, setBingoCard] = useState({
    title: '',
    rules: '',
    creator_id: null,
    bingo_appearance: {
      background_color:'',
      background_image:'',
      banner:'',
      footer:'',
      dial_image:''
    },
    bingo_values: [
      {
        carton_value: '',
        carton_type: '',
        ballot_value: '',
        ballot_type: '',
        position: [],
      },
    ],
    positions_disabled: [
      {
        position: 0,
        default_image: '',
      },
    ],
    dimensions: '',
  });

   // Función para modificar el estado bingoCard
   const updateBingoCard = (updatedCard) => {
    setBingoCard(updatedCard);
  };
  



  return (
    <NewBingoContext.Provider value={{bingoCard, updateBingoCard}}>
      {props.children}
    </NewBingoContext.Provider>
  );
};