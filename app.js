const X_SYMBOL = "×";
const O_SYMBOL = "○";
const BOARD_X_CLASS = "board--x-turn";
const BOARD_O_CLASS = "board--o-turn";
const PLAYER_X_CLASS = "current-player--x";
const PLAYER_O_CLASS = "current-player--o";
const RESULT_TIE = "TIE";
const RESULT_WIN = "WIN";

const boardElem = document.querySelector(".board");
const restartBtn = document.getElementById("reset-btn");
const cells = document.querySelectorAll(".cell");
const infoDisplayMsgElem = document.querySelector(".info-display__msg");



const players = [O_SYMBOL, X_SYMBOL];

let board;
let availableCells;
let startPlayer = players[0];
let currentPlayer;
let currentBoardClass;

restartBtn.addEventListener('click', setup);
setup();


function setup() {
    // Set clean board
    board = [
        ["", "", ""],
        ["", "", ""],
        ["", "", ""],
    ];
    // Set available cells
    availableCells = 9
    // Clear all cells and make them available
    cells.forEach(cell => {
        cell.classList.remove("cell--available", "cell--x", "cell--o");
        cell.classList.add("cell--available");
        cell.removeEventListener('click', handleClick);
        cell.addEventListener('click', handleClick, { once: true })
    });
    // Set current player
    currentPlayer = startPlayer;
    // Clear and set board class depending on current player
    setBoardClass();
    // Set infomation which player is move now
    setPlayerInfo(currentPlayer);
    // Set starting player in next round
    setNextStartPlayer();
}


function handleClick(e) {
    const cell = e.target;
    if (cell.classList.contains("cell--available")) {
        const cellRow = cell.getAttribute("data-cell-row");
        const cellColumn = cell.getAttribute("data-cell-column");

        // Update the game board
        updateBoard(cell, cellRow, cellColumn, currentPlayer);

        //Check if win or draw, otherwise switch to next player
        if (checkWin(currentPlayer)) {
            endGame(RESULT_WIN);
        } else if (checkTie()) {
            endGame(RESULT_TIE)
        } else {
            switchPlayer(); 
        }
    }
    
}

function updateBoard(cell, row, column, player) {
    // Update board array and available cells
    board[row][column] = player;
    availableCells -= 1;
    // Update UI
    drawSymbol(cell, player)
}

function drawSymbol(cell, symbol) {
    if (symbol == X_SYMBOL) {
        cell.classList.add("cell--x")
    } else if (symbol == O_SYMBOL) {
        cell.classList.add("cell--o")
    }
    cell.classList.remove("cell--available")
}

function switchPlayer() {
    if (currentPlayer == X_SYMBOL) {
        currentPlayer = players[0];
    } else if (currentPlayer == O_SYMBOL) {
        currentPlayer = players[1];
    }
    setBoardClass();
    setPlayerInfo(currentPlayer);
}

function setBoardClass() {
    boardElem.classList.remove(BOARD_O_CLASS, BOARD_X_CLASS);
    currentBoardClass = currentPlayer == players[0] ? BOARD_O_CLASS : BOARD_X_CLASS;
    boardElem.classList.add(currentBoardClass);
}

function setPlayerInfo(player) {
    const playerClass = player == X_SYMBOL ? PLAYER_X_CLASS : PLAYER_O_CLASS;
    let playerInfoMsg = `Ruch Gracza <span class="info-display__current-player ${playerClass}"></span>`
    infoDisplayMsgElem.innerHTML = playerInfoMsg;
}

function setNextStartPlayer() {
    if (startPlayer == players[0]) {
        startPlayer = players[1];
    } else if (startPlayer == players[1]) {
        startPlayer = players[0];
    }
}

function checkWin(playerSymbol) {
    isWinner = false
    // Check horizontal combinations
    for (let i = 0; i < 3; i++) {
        if (areEquals(board[i][0], board[i][1], board[i][2]) && board[i][0] == playerSymbol) {
            isWinner = true;
            break;
        }
    }
    // Check vertical combinations
    for (let i = 0; i < 3; i++) {
        if (areEquals(board[0][i], board[1][i], board[2][i]) && board[0][i] == playerSymbol) {
            isWinner = true;
            break;
        }
    }
    // Check diagonal combinations
    if (areEquals(board[0][0], board[1][1], board[2][2]) && board[0][0] == playerSymbol) {
        isWinner = true;
    }
    if (areEquals(board[2][0], board[1][1], board[0][2]) && board[2][0] == playerSymbol) {
        isWinner = true;
    } 

    return isWinner;
}

function areEquals(a, b, c) {
    return (a == b && b == c && a != "")
}

function checkTie() {
    return availableCells == 0 ? true : false;
}


function endGame(result) {
    if (result == RESULT_WIN) {
        // Remove hover class and event listeners from cells
        cells.forEach(cell => {
            cell.classList.remove("cell--available")
            cell.removeEventListener('click', handleClick);
        });
        // Set result message
        const playerClass = currentPlayer == X_SYMBOL ? PLAYER_X_CLASS : PLAYER_O_CLASS;
        const resultMsg = `Zwyciężył Gracz <span class="info-display__current-player ${playerClass}"></span>!`
        infoDisplayMsgElem.innerHTML = resultMsg;
    } else {
        // Set result message
        const resultMsg = `Remis!`
        infoDisplayMsgElem.innerHTML = resultMsg;
    }

}