import { storage } from "../firebase-config";
import { ref, getDownloadURL, uploadString } from "firebase/storage";

/**
 * Verifica si la URL comienza con el prefijo "data:image"
 * @param {string} url - La URL que se va a verificar.
 * @returns {boolean} - Retorna true si la URL es una imagen en base64, de lo contrario retorna false.
 */
export function isBase64Url(url) {
  if (url.startsWith("data:image")) {
    const type = url.split(";")[0].split(":")[1];
    if (
      ["image/jpeg", "image/png", "image/gif", "image/svg+xml"].includes(type)
    ) {
      return true;
    }
  }
  return false;
}

/**
 * Sube una imagen en formato base64 a Firebase Storage y devuelve la URL de descarga.
 * @param {string} base64Image - La imagen en formato base64.
 * @param {string} fileName - El nombre del archivo que se va a guardar en Firebase Storage.
 * @returns {Promise<string>} - Una promesa que resuelve a la URL de descarga de la imagen.
 */
export const uploadBase64ImageToFirebase = async (base64Image, fileName) => {
  // Crea una referencia al archivo en Firebase Storage.
  const storageRef = ref(storage, `bingo/images/${fileName}`);

  // Sube la imagen en formato base64 a Firebase Storage.
  await uploadString(storageRef, base64Image, "data_url");

  // Obtiene y retorna la URL de descarga del archivo subido.
  return await getDownloadURL(ref(storageRef));
};
