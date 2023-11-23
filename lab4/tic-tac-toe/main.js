function initBoard() {
    let board = document.getElementById('board');

    for (let i = 0; i < 9; i++) {
        let boardCell = document.createElement('div');
        boardCell.classList.add('cell');
        board.append(boardCell);
    }
 
    return board;
}

function checkAvailableSteps() {
    let cells = document.querySelectorAll('.cell');

    for (let i = 0; i < cells.length; i++) {
        if (cells[i].innerHTML == '') {
            return true;
        }
    }

    return false;
}

function checkWinner() {
    let cells = document.querySelectorAll('.cell');
    let row, column, diag1, diag2;

    for (let i = 0; i < 3; i++) {
        diag2 = true;

        row = (cells[i * 3].innerHTML != '');
        column = (cells[i].innerHTML != '');
        diag1 = (cells[0].innerHTML != '');
        diag2 = (cells[2].innerHTML != '');
         
        for (let j = 0; j < 2; j++) {
            row = row && (cells[i * 3 + j].innerHTML == cells[i * 3 + j + 1].innerHTML);
            column = column && (cells[j * 3 + i].innerHTML == cells[(j + 1) * 3 + i].innerHTML);
            diag1 = diag1 && (cells[j * 3 + j].innerHTML == cells[(j + 1) * 3 + j + 1].innerHTML);
            diag2 = diag2 && (cells[j * 3 + 2 - j].innerHTML == cells[(j + 1) * 3 + 2 - (j + 1)].innerHTML);
        }

        let winner = (row && cells[i * 3].innerHTML) || (column && cells[i].innerHTML) || (diag1 && cells[0].innerHTML) || (diag2 && cells[2].innerHTML);

        if (winner) {
            return winner;
        }
    }

    return false;
}

function clickHandler(event) {
    if (event.target.className == 'cell') {
        if (gameOver) {
            alert('Игра окончена. Начните новую игру');
            return;
        }

        if (event.target.innerHTML != '') {
            alert('Эта клетка уже занята');
        }
        else {
            event.target.innerHTML = turn == 0 ? 'x' : 'o';
            turn = (turn + 1) % 2;
        }

        let winner = checkWinner();

        if (winner) {
            winner == 'x' ? alert('Игрок 1 одержал победу!') : alert('Игрок 2 одержал победу!');
            gameOver = true;
        }
        else if (!checkAvailableSteps()) {
            alert('Ничья!');
            gameOver = true;
        }
    }
}

function newGame() {
    let cells = document.querySelectorAll('.cell');

    for (let i = 0; i < cells.length; i++) {
        cells[i].innerHTML = '';
    }

    gameOver = false;
    turn = 0;
}

let gameOver = false;
let turn = 0;

window.onload = function() {
    let board = initBoard();
    board.onclick = clickHandler;
    document.querySelector('.new-game-btn').onclick = newGame;
}