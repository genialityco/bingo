let numbers = [];
let markedNumbers = [];
let drawBallElement = document.getElementById('draw-ball');

// Generar números únicos para el cartón de bingo
function generateNumbers() {
    numbers = [];
    for (let i = 1; i <= 25; i++) {
        numbers.push(i);
    }
    numbers = shuffleArray(numbers);
}

// Función para barajar un array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Iniciar juego
function startGame() {
    generateNumbers();
    renderBoard();
    drawBall();
}

// Marcar número en el cartón
function markNumber(number) {
    if (!markedNumbers.includes(number)) {
        markedNumbers.push(number);
        document.getElementById(`square-${number}`).classList.add('marked');
        checkWin();
    }
    drawBall();
}

// Verificar si se ha ganado el juego
function checkWin() {
    if (markedNumbers.length === 25) {
        alert('¡Bingo! ¡Has ganado!');
    }
}

// Renderizar el cartón de bingo
function renderBoard() {
    const bingoBoard = document.getElementById('bingo-board');
    bingoBoard.innerHTML = '';
    for (let i = 0; i < numbers.length; i++) {
        const square = document.createElement('div');
        square.classList.add('square');
        square.id = `square-${numbers[i]}`;
        square.textContent = numbers[i];
        square.addEventListener('click', () => markNumber(numbers[i]));
        bingoBoard.appendChild(square);
    }
}

// Generar y mostrar una bola al azar
function drawBall() {
    let drawnNumber;
    do {
        drawnNumber = Math.ceil(Math.random() * 25);
    } while (markedNumbers.includes(drawnNumber));

    drawBallElement.textContent = `Bola: ${drawnNumber}`;
}
