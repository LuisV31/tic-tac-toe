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
    let player1, player2, activePlayer, isGameOver, difficultyLevel = "easy";

    const setDifficulty = (newDifficulty) => {
        difficultyLevel = newDifficulty;
        console.log("difficulty level set:", difficultyLevel);
    };
    
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

    const getRandomAiMove = () => {
        const board = gameBoard.getBoard();
        const availableMoves = board
            .map((cell, index) => (cell === "" ? index : null))
            .filter((index) => index !== null);
        
        const randomIndex = Math.floor(Math.random() * availableMoves.length);

        return availableMoves[randomIndex];
    };

    const getAIMove = () => {
        if (difficultyLevel=== "easy") {
            return getRandomAiMove();
        } else if (difficultyLevel=== "medium") {
            const move = miniMax(gameBoard.getBoard(), 0, true).move;
            // Introduce a 40% chance for a random move instead of opitmal move//
            if (Math.random() < 0.4) {
                return getRandomAiMove();
            }
            return move;
        } else if (difficultyLevel === "hard") {
            const move = miniMax(gameBoard.getBoard(), 0, true).move;
            return move;
        }
        console.log("ai diff level: ", difficultyLevel);
    };

    const miniMax = (board, depth, isMaximizingPlayer) => {
        if (checkWin(board, player2.getSymbol())) {
            return { score: 10 - depth };
        } else if (checkWin(board, player1.getSymbol())) {
            return { score: -10 + depth };
        } else if (!board.includes('')) {
            return { score: 0 };
        }
        
        if (isMaximizingPlayer) {
            let bestScore = -Infinity;
            let move;

            for (let i = 0; i < board.length; i++) {
                if (board[i] === '') {
                    board[i] = player2.getSymbol();
                    let score = miniMax([...board], depth + 1, false);
                    board[i] = '';

                    if (score.score > bestScore) {
                        bestScore = score.score;
                        move = i;
                    }
                }
            }

            return { score: bestScore, move: move };
        } else {
            let bestScore = Infinity;
            let move;

            for (let i = 0; i < board.length; i++) {
                if (board[i] === "") {
                    board[i] = player1.getSymbol();
                    let score = miniMax([...board], depth + 1, true);
                    board[i] = "";

                    if (score.score < bestScore) {
                        bestScore = score.score;
                        move = i;
                    }
                }
            }
            
            return { score: bestScore, move: move };
        }
    };
    
    const handlePlayerMove = (index) => {
        const currentPlayerSymbol = activePlayer.getSymbol();
        const board = gameBoard.getBoard();

        if (board[index] !== '' || isGameOver) {
            return;
        }

        gameBoard.updateCell(index, currentPlayerSymbol);
        
        if (checkWin(board,currentPlayerSymbol)) {
            isGameOver = true;
            updateGameMessage(`${activePlayer.getName()} wins!`);
            return;
        }

        if (checkTie()) {
            isGameOver = true;
            updateGameMessage("It's a tie!");
            return;
        }
        console.log("current player symbol:", currentPlayerSymbol);
        toggleActivePlayer();

        if (activePlayer === player2) {
            
            setTimeout(() => {
                const aiMoveIndex = getAIMove();
                gameBoard.updateCell(aiMoveIndex, player2.getSymbol());
                const updateBoard = gameBoard.getBoard();

                if (checkWin(updateBoard, player2.getSymbol())) {
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
            console.log("activeplayer:", activePlayer.getName());
    };

    const checkWin = (board, symbol) => {
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
            combo.every((index) => board[index] === symbol)
        );
    };

    const checkTie = () => {
        return !gameBoard.getBoard().includes("");
    };

    const restartGame = () => {
        activePlayer = player1;
        gameBoard.clearBoard();
        isGameOver = false;
        updateGameMessage("* three in a row makes you a winner *")
    }

    return { startGame, handlePlayerMove, restartGame, setDifficulty};
})();

const clearButtonStyles = () => {
    const buttons = document.querySelectorAll('.level-button');
    buttons.forEach(button => button.classList.remove('selected'));
}

//user must select one of these to choose difficulty//
document.getElementById("easy-btn").addEventListener("click", (event) => {
    event.preventDefault();
    clearButtonStyles();
    event.target.classList.add('selected');
    gameController.setDifficulty("easy");
});

document.getElementById("medium-btn").addEventListener("click", (event) => {
    event.preventDefault();
    clearButtonStyles();
    event.target.classList.add('selected');
    gameController.setDifficulty("medium");
});

document.getElementById("hard-btn").addEventListener("click", (event) => {
    event.preventDefault();
    clearButtonStyles();
    event.target.classList.add('selected');
    gameController.setDifficulty("hard");
});

//user must selects to set up and start game//
document.getElementById("start-btn").addEventListener("click", () => {
    gameController.startGame();
});

//event listener on all squares for user to choose and handlePlayerMove, followed by AI move.//
const squares = document.querySelectorAll(".square");
squares.forEach((square, index) => {
    square.addEventListener("click", () => {
        if (!gameController.isGameOver) {
            gameController.handlePlayerMove(index);
        }
    });
});

document.getElementById("restart-btn").addEventListener("click", () => {
    gameController.restartGame();
});