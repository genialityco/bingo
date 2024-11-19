/**
 * Baraja (mezcla) los elementos de un arreglo de forma aleatoria.
 * @param {Array} array - El arreglo que se va a barajar.
 * @returns {Array} - El arreglo barajado.
 *
 * Esta función implementa el algoritmo de Fisher-Yates para mezclar de manera aleatoria
 * los elementos de un arreglo. El algoritmo recorre el arreglo de atrás hacia adelante,
 * intercambiando cada elemento con otro elemento aleatorio que viene antes de él (o consigo mismo).
 */
export const shuffle = (array) => {
  let currentIndex = array.length,
    randomIndex;

  // Mientras queden elementos a mezclar
  while (currentIndex !== 0) {
    // Selecciona un elemento restante de manera aleatoria
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // Intercambia el elemento actual con el elemento aleatorio
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
  return array;
};
