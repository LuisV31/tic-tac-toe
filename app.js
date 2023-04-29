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

    const render = (board) => {
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
    // let isGameOver = false;

    const startGame = () => {
        //
    };
    
    const playTurn = (index) => {
        const currentPlayerSymbol = activePlayer.getSymbol();
        if (gameBoard.getBoard()[index] === '') {
            gameBoard.updateCell(index, currentPlayerSymbol);
            gameBoard.render((gameBoard.getBoard()));
        }  else {
            //square is taken, show message, chose empty square!!//
        }
    };

    const toggleActivePlayer = () => {

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
    }

    const checkTie = () => {

    };

    return { playTurn };
})();



