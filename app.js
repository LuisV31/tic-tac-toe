const gameBoardContainer = document.getElementById("game-container");
const startScreen = document.getElementById("start-screen");
const gameScreen = document.getElementById("game-screen");

const player1NameDisplay = document.querySelector('#player1 .name');
const player1SymbolDisplay = document.querySelector('#player1 .symbol');
const player1TurnDisplay = document.getElementById("player1-turn");
const player2NameDisplay = document.querySelector('#player2 .name');
const player2SymbolDisplay = document.querySelector('#player2 .symbol');
const player2TurnDisplay = document.getElementById("player2-turn");
        

const gameBoard = (() => {
    let board = ["", "", "", "", "", "", "", "", ""];
    
    const getBoard = () => board;

    const clearBoard = () => {
        board = board.fill("");
        render();
    };

    const updateCell = (index, symbol) => {
        board[index] = symbol;
        render();
    };

    const render = () => {
        const squares = document.querySelectorAll('.square');
        squares.forEach((square, index) => {
            square.textContent = board[index];
        });
    };
    
    return { getBoard, clearBoard, updateCell, render };
})();

const playerCreator = (name, symbol) => {
    const getName = () => name;
    const getSymbol = () => symbol;
    return { getName, getSymbol };
};

const gameController = (() => {
    let player1, player2, activePlayer, isGameOver;

    const startGame = () => {
        const symbol1 = document.querySelector('input[name="symbol"]:checked').value;
        const symbol2 = symbol1 === 'X' ? 'O' : 'X';
        player1 = playerCreator(document.getElementById('player1-name-input').value, symbol1);
        player2 = playerCreator("Computer", symbol2);
        activePlayer = player1;
        startScreen.style.display = 'none';
        gameScreen.style.display = 'block';
        isGameOver = false;
        updatePlayerDisplay();
    };
    
    const updatePlayerDisplay = () => {
        player1NameDisplay.textContent = player1.getName();
        player1SymbolDisplay.textContent = player1.getSymbol();
        player2NameDisplay.textContent = player2.getName();
        player2SymbolDisplay.textContent = player2.getSymbol();
    };
    
    const updateGameMessage = (message) => {
        const gameMessage = document.getElementById("game-message");
        gameMessage.textContent = message;
    };

    const getRandomMove = () => {
        const board = gameBoard.getBoard();
        const availableMoves = board.reduce((moves, cell, index) => {
            if (cell === "") {
                moves.push(index);
            }
            return moves;
        }, []);
        const randomIndex = Math.floor(Math.random() * availableMoves.length);

        return availableMoves[randomIndex];
    };

    const playTurn = (index) => {
        const currentPlayerSymbol = activePlayer.getSymbol();
        const board = gameBoard.getBoard();

        if (board[index] !== '' || isGameOver) {
            return;
        }

        gameBoard.updateCell(index, currentPlayerSymbol);
        
        if (checkWin(currentPlayerSymbol)) {
            isGameOver = true;
            updateGameMessage(`${activePlayer.getName()} wins!`);
            return;
        }

        if (checkTie()) {
            isGameOver = true;
            updateGameMessage("It's a tie!");
            return;
        }

        toggleActivePlayer();

        if (activePlayer === player2) {
            
            setTimeout(() => {
                const aiMoveIndex = getRandomMove();
                gameBoard.updateCell(aiMoveIndex, player2.getSymbol());

                if (checkWin(player2.getSymbol())) {
                    isGameOver = true;
                    updateGameMessage(`${player2.getName()} wins!`);
                    return;
                }
                
                if (checkTie()) {
                    isGameOver = true;
                    updateGameMessage("It's a tie!");
                    return;
                }

                toggleActivePlayer();
            }, 1000);
        }
    };

    const toggleActivePlayer = () => {
        activePlayer = activePlayer === player1 ? player2 : player1;
    };

    const checkWin = (symbol) => {
        const winningCombos = [
            //rows
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            //columns
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            //diagonals
            [0, 4, 8],
            [2, 4, 6],
        ];

        return winningCombos.some((combo) =>
            combo.every((index) => gameBoard.getBoard()[index] === symbol)
        );
    };

    const checkTie = () => {
        return !gameBoard.getBoard().includes("");
    };

    const restartGame = () => {
        activePlayer = player1;
        gameBoard.clearBoard();
        isGameOver = false;
        updateGameMessage("*three in a row makes you a winner*")
    }

    return { startGame, playTurn, restartGame };
})();

document.getElementById("start-btn").addEventListener("click", () => {
    gameController.startGame();
});
const squares = document.querySelectorAll(".square");
squares.forEach((square, index) => {
    square.addEventListener("click", () => {
        if (!gameController.isGameOver) {
            gameController.playTurn(index);
        }
    });
});

document.getElementById("restart-btn").addEventListener("click", () => {
    gameController.restartGame();
});
