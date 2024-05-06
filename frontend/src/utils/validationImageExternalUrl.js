import { storage } from '../firebase';
import { ref,  getDownloadURL, uploadString } from 'firebase/storage';

// Verifica si la URL comienza con el prefijo "data:image"
export function isBase64Url(url) {
  
  if (url.startsWith('data:image')) {
    const type = url.split(';')[0].split(':')[1];
    if (
      ['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml'].includes(type)
    ) {
      return true;
    }
  }
  return false;
}

// Función para subir una imagen base64 a Firebase Storage
export const uploadBase64ImageToFirebase = async (base64Image, fileName) => {
  const storageRef = ref(storage, `images/${fileName}`);
  const snapshot = await uploadString(storageRef, base64Image, 'data_url');
  console.log('Uploaded a blob or file!', snapshot);
  return await getDownloadURL(ref(storageRef));
};
