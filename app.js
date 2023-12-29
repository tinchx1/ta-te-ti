// Utilizando IIFE para crear un módulo
const juegoTateti = (function () {
    // Fábrica para crear el tablero de juego
    const Gameboard = function () {
        // Representación del tablero como una matriz 3x3
        const board = [
            ['', '', ''],
            ['', '', ''],
            ['', '', '']
        ];

        // Método para obtener el estado actual del tablero
        const getBoard = () => board;

        // Método para reiniciar el tablero
        const resetBoard = () => {
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    board[i][j] = '';
                }
            }
        };

        const placeMark = (row, col, mark) => {
            if (board[row][col] === '') {
                board[row][col] = mark;
                return true; // Movimiento válido
            }
            return false; // Movimiento inválido
        };

        return {
            getBoard,
            placeMark,
            resetBoard
        };
    };

    // Fábrica para crear jugadores
    const Player = function (name, mark) {
        return {
            name,
            mark
        };
    };

    // Objeto para controlar el flujo del juego
    const GameController = (function () {
        let currentPlayer;
        let playerX;
        let playerO;
        let gameboard;
        let infoDisplay;

        // Método para cambiar al siguiente jugador
        const switchPlayer = () => {
            currentPlayer = (currentPlayer === playerX) ? playerO : playerX;
            updateInfoDisplay();
        };

        // Método para gestionar el clic en una celda
        const handleCellClick = (row, col) => {
            // Elimina la clase de selección de la última celda
            const selectedCell = document.querySelector('.selected');
            if (selectedCell) {
                selectedCell.classList.remove('selected');
            }

            if (gameboard.placeMark(row, col, currentPlayer.mark)) {
                const cell = document.querySelector(`#tictactoe-board .cell[data-row="${row}"][data-col="${col}"]`);
                cell.textContent = currentPlayer.mark; // Actualiza el contenido de la celda con la marca del jugador actual
                cell.classList.add('selected');  // Agrega la clase de selección a la nueva celda

                if (checkWinner()) {
                    showResult(`${currentPlayer.name} ha ganado. Haz clic en Reiniciar para jugar otra vez.`);
                    disableCellClick();
                } else if (isBoardFull()) {
                    showResult('¡Empate! Haz clic en Reiniciar para jugar otra vez.');
                    disableCellClick();
                } else {
                    switchPlayer();
                }
            }
        };

        const updateInfoDisplay = () => {
            if (infoDisplay) {
                infoDisplay.textContent = `Turno de ${currentPlayer.name}`;
            }
        };

        // Método para mostrar el resultado en la pantalla de información
        const showResult = (result) => {
            if (infoDisplay) {
                infoDisplay.textContent = result;
            }
        };

        // Método para desactivar eventos de clic en las celdas
        const disableCellClick = () => {
            const cells = document.querySelectorAll('#tictactoe-board .cell');
            cells.forEach(cell => {
                cell.removeEventListener('click', handleCellClick);
            });
        };

        // Método para verificar si hay un ganador
        const checkWinner = () => {
            const board = gameboard.getBoard();

            // Combinaciones ganadoras en el ta-te-ti
            const winningCombinations = [
                [[0, 0], [0, 1], [0, 2]], // Fila 1
                [[1, 0], [1, 1], [1, 2]], // Fila 2
                [[2, 0], [2, 1], [2, 2]], // Fila 3
                [[0, 0], [1, 0], [2, 0]], // Columna 1
                [[0, 1], [1, 1], [2, 1]], // Columna 2
                [[0, 2], [1, 2], [2, 2]], // Columna 3
                [[0, 0], [1, 1], [2, 2]], // Diagonal principal
                [[0, 2], [1, 1], [2, 0]]  // Diagonal secundaria
            ];

            // Verificar si alguna combinación tiene todas las marcas iguales
            for (const combination of winningCombinations) {
                const [a, b, c] = combination;
                if (board[a[0]][a[1]] !== '' &&
                    board[a[0]][a[1]] === board[b[0]][b[1]] &&
                    board[a[0]][a[1]] === board[c[0]][c[1]]) {
                    return true; // ¡Hay un ganador!
                }
            }

            return false; // No hay ganador en esta iteración
        };

        // Método para verificar si el tablero está lleno
        const isBoardFull = () => {
            const board = gameboard.getBoard();

            // Iterar sobre todas las filas y columnas del tablero
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    // Si alguna celda está vacía, el tablero no está lleno
                    if (board[i][j] === '') {
                        return false;
                    }
                }
            }

            // Si no se encontró ninguna celda vacía, el tablero está lleno
            return true;
        };

        // Método para reiniciar el juego
        const resetGame = () => {
            gameboard.resetBoard();
            currentPlayer = playerX;
            updateInfoDisplay();
            initializeBoardDOM();

            // Limpia el resultado cuando se reinicia el juego
        };

        const initializeBoardDOM = () => {
            const cells = document.querySelectorAll('#tictactoe-board .cell');
            cells.forEach(cell => {
                cell.textContent = ''; // Inicializa el contenido de cada celda
                const row = cell.dataset.row;
                const col = cell.dataset.col;
                cell.addEventListener('click', handleCellClick);
            });

            // Agregar un controlador de eventos al botón de reinicio
            const restartButton = document.getElementById('restart-button');
            restartButton.addEventListener('click', resetGame);
        };

        const initializeGame = () => {
            gameboard = Gameboard();
            playerX = Player("Jugador X", "X");
            playerO = Player("Jugador O", "O");
            currentPlayer = playerX;
            updateInfoDisplay();
            infoDisplay = document.getElementById('info-display');

            initializeBoardDOM();
        };

        return {
            initializeGame,
            handleCellClick,
            resetGame
        };
    })();

    // Inicialización del juego al cargar la página
    document.addEventListener('DOMContentLoaded', function () {
        GameController.initializeGame();
    });

    return {
        handleCellClick: GameController.handleCellClick
    };
})();

document.addEventListener('DOMContentLoaded', function () {
    GameController.initializeGame();
});
