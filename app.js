const gameBoard = (() => {
    let board = ["", "", "", "", "", "", "", "", ""];
    
    const getBoard = () => board;

    const clearBoard = () => {
        board = board.fill("");
        render(board);
    };

    const updateCell = (index, symbol) => {
        board[index] = symbol;
    };

    const render = () => {
        const squares = document.querySelectorAll('.square');
        squares.forEach((square, index) => {
            square.textContent = board[index];
            square.addEventListener('click', () => {
                gameController.playTurn(index);
            });
        });
    };
    
    return {
        getBoard, clearBoard, updateCell, render 
    }
})();

const playerCreator = (name, symbol) => {
    const getName = () => name;
    const getSymbol = () => symbol;
    return { getName, getSymbol };
};

const gameController = (() => {
    const player1 = playerCreator("Player 1", "X");
    const player2 = playerCreator("Player 2", "O");
    let activePlayer = player1;
    let isGameOver = false;

    // const startGame = () => {
    //   clearBoard, render, gameover=false //
    // };
    
    const playTurn = (index) => {
        const currentPlayerSymbol = activePlayer.getSymbol();
        if (gameBoard.getBoard()[index] !== '') {
            return;
        }

            gameBoard.updateCell(index, currentPlayerSymbol);
            gameBoard.render((gameBoard.getBoard()));
        

        if (checkWin(currentPlayerSymbol)) {
            isGameOver = true;
            alert(`${activePlayer.getName()} wins!`);
            return;
        }

        if (checkTie()) {
            isGameOver = true;
            alert("It's a tie!");
            return;
        }

        toggleActivePlayer();
        console.log(activePlayer.getName(), activePlayer.getSymbol());
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

    return { playTurn };
})();



