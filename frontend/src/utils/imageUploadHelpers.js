import { v4 as uuidv4 } from "uuid";
import {
  isBase64Url,
  uploadBase64ImageToFirebase,
} from "./validationImageExternalUrl";

/**
 * Maneja la subida de imágenes de apariencia en base64 a Firebase Storage.
 * @param {Object} bingoAppearance - Objeto que contiene las apariencias del bingo.
 * @returns {Promise<void>} - Una promesa que se resuelve cuando todas las imágenes han sido subidas.
 */
export const handleAppearanceImageUploads = async (bingoAppearance) => {
  const appearancePromises = Object.entries(bingoAppearance)
    .slice(1)
    .map(async ([clave, valor]) => {
      if (valor && valor.trim() !== "") {
        // Asegurarse de que el valor no es nulo y no está vacío
        if (isBase64Url(valor)) {
          try {
            const url = await uploadBase64ImageToFirebase(valor, uuidv4());
            bingoAppearance[clave] = url;
          } catch (error) {
            console.error("Error al cargar la imagen de la apariencia:", error);
          }
        }
      }
    });

  await Promise.all(appearancePromises);
};

/**
 * Maneja la subida de imágenes de valores de bingo en base64 a Firebase Storage.
 * @param {Array} bingoValues - Arreglo que contiene los valores del bingo.
 * @returns {Promise<void>} - Una promesa que se resuelve cuando todas las imágenes han sido subidas.
 */
export const handleBingoValuesImageUploads = async (bingoValues) => {
  const bingoPromises = bingoValues.map(async (bingo, index) => {
    if (bingo.carton_type === "image" && isBase64Url(bingo.carton_value)) {
      try {
        const url = await uploadBase64ImageToFirebase(bingo.carton_value, uuidv4());
        bingoValues[index].carton_value = url;
      } catch (error) {
        console.error("Error al cargar la imagen del cartón:", error);
      }
    }
    if (bingo.ballot_type === "image" && isBase64Url(bingo.ballot_value)) {
      try {
        const url = await uploadBase64ImageToFirebase(bingo.ballot_value, uuidv4());
        bingoValues[index].ballot_value = url;
      } catch (error) {
        console.error("Error al cargar la imagen de la balota:", error);
      }
    }
  });

  await Promise.all(bingoPromises);
};
