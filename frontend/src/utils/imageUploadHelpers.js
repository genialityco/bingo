import { v4 } from "uuid";
import {
  isBase64Url,
  uploadBase64ImageToFirebase,
} from "./validationImageExternalUrl";

export const handleAppearanceImageUploads = async (bingoAppearance) => {
  const appearancePromises = Object.entries(bingoAppearance)
    .slice(1)
    .map(async ([clave, valor]) => {
      if (valor && valor.trim() !== "") {
        // Asegurarse de que el valor no es nulo y no está vacío
        const firebaseUrl = isBase64Url(valor);
        if (firebaseUrl) {
          try {
            const url = await uploadBase64ImageToFirebase(valor, v4());
            bingoAppearance[clave] = url;
          } catch (error) {
            console.error("Error al cargar la imagen de la apariencia:", error);
          }
        }
      }
    });

  await Promise.all(appearancePromises);
};

export const handleBingoValuesImageUploads = async (bingoValues) => {
  const bingoPromises = bingoValues.map(async (bingo, index) => {
    if (bingo.carton_type === "image") {
      const firebaseUrl = isBase64Url(bingo.carton_value);
      if (firebaseUrl) {
        try {
          const url = await uploadBase64ImageToFirebase(
            bingo.carton_value,
            v4()
          );
          bingoValues[index].carton_value = url;
        } catch (error) {
          console.error("Error al cargar la imagen del cartón:", error);
        }
      }
    }
    if (bingo.ballot_type === "image") {
      const firebaseUrl = isBase64Url(bingo.ballot_value);
      if (firebaseUrl) {
        try {
          const url = await uploadBase64ImageToFirebase(
            bingo.ballot_value,
            v4()
          );
          bingoValues[index].ballot_value = url;
        } catch (error) {
          console.error("Error al cargar la imagen de la balota:", error);
        }
      }
    }
  });

  await Promise.all(bingoPromises);
};
