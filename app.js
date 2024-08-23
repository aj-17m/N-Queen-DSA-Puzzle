'use strict'
const numberbox = document.getElementById("numberbox");
const slider = document.getElementById("slider");
const progressBar = document.getElementById("progress-bar");
const playButton = document.getElementById('play-button');
const pauseButton = document.getElementById("pause-button");

const queen = '<i class="fas fa-chess-queen" style="color:#000"></i>';

let n, speed, tempSpeed, q, Board = 0;
let array = [0, 2, 1, 1, 3, 11, 5, 41, 93]; // The number of possible arrangements

// Used to store the state of the boards;
let pos = {};

// Setting the slider value onSlide
speed = (100 - slider.value) * 10;
tempSpeed = speed;
slider.oninput = function () {
    progressBar.style.width = this.value + "%";
    speed = (100 - slider.value) * 10;
}

class Queen {
    constructor() {
        this.position = Object.assign({}, pos);
        this.uuid = [];
    }

    nQueen = async () => {
        Board = 0;
        this.position[`${Board}`] = {};
        numberbox.disabled = true;
        await this.solveQueen(Board, 0, n);
        await this.clearColor(Board);
        numberbox.disabled = false;
    }

    isValid = async (board, r, col, n) => {
        const table = document.getElementById(`table-${this.uuid[board]}`);
        const currentRow = table.firstChild.childNodes[r];
        const currentColumn = currentRow.getElementsByTagName("td")[col];
        currentColumn.innerHTML = queen;
        await this.delay();

        // Checking column
        for (let i = r - 1; i >= 0; --i) {
            const row = table.firstChild.childNodes[i];
            const column = row.getElementsByTagName("td")[col];
            const value = column.innerHTML;

            if (value == queen) {
                column.style.backgroundColor = "#FB5607";
                currentColumn.innerHTML = "-";
                return false;
            }
            column.style.backgroundColor = "#ffca3a";
            await this.delay();
        }

        // Checking upper left diagonal
        for (let i = r - 1, j = col - 1; i >= 0 && j >= 0; --i, --j) {
            const row = table.firstChild.childNodes[i];
            const column = row.getElementsByTagName("td")[j];
            const value = column.innerHTML;

            if (value == queen) {
                column.style.backgroundColor = "#FB5607";
                currentColumn.innerHTML = "-";
                return false;
            }
            column.style.backgroundColor = "#ffca3a";
            await this.delay();
        }

        // Checking upper right diagonal
        for (let i = r - 1, j = col + 1; i >= 0 && j < n; --i, ++j) {
            const row = table.firstChild.childNodes[i];
            const column = row.getElementsByTagName("td")[j];
            const value = column.innerHTML;

            if (value == queen) {
                column.style.backgroundColor = "#FB5607";
                currentColumn.innerHTML = "-";
                return false;
            }
            column.style.backgroundColor = "#ffca3a";
            await this.delay();
        }

        return true;
    }

    clearColor = async (board) => {
        const table = document.getElementById(`table-${this.uuid[board]}`);
        for (let j = 0; j < n; ++j) {
            const row = table.firstChild.childNodes[j];
            for (let k = 0; k < n; ++k) {
                (j + k) & 1
                    ? (row.getElementsByTagName("td")[k].style.backgroundColor = "#FF9F1C")
                    : (row.getElementsByTagName("td")[k].style.backgroundColor = "#FCCD90");
            }
        }
    }

    delay = async () => {
        return new Promise((resolve) => setTimeout(resolve, speed));
    }

    solveQueen = async (board, r, n) => {
        if (r == n) {
            ++Board;
            const table = document.getElementById(`table-${this.uuid[Board]}`);
            for (let k = 0; k < n; ++k) {
                const row = table.firstChild.childNodes[k];
                row.getElementsByTagName("td")[this.position[board][k]].innerHTML = queen;
            }
            this.position[Board] = { ...this.position[board] };
            return true;
        }

        for (let i = 0; i < n; ++i) {
            await this.clearColor(board);
            if (await this.isValid(board, r, i, n)) {
                this.position[board][r] = i;

                if (await this.solveQueen(board, r + 1, n)) {
                    return true;
                }

                await this.clearColor(board);
                const table = document.getElementById(`table-${this.uuid[board]}`);
                const row = table.firstChild.childNodes[r];
                row.getElementsByTagName("td")[i].innerHTML = "-";
                delete this.position[board][r];
            }
        }
        return false;
    }
}

playButton.onclick = async function visualise() {
    const chessBoard = document.getElementById("n-queen-board");
    const arrangement = document.getElementById("queen-arrangement");

    n = parseInt(numberbox.value);
    q = new Queen();

    if (n > 8 || n < 1) {
        numberbox.value = "";
        alert("Please enter a valid number between 1 and 8.");
        return;
    }

    // Clear previous chessboards
    while (chessBoard.hasChildNodes()) {
        chessBoard.removeChild(chessBoard.firstChild);
    }
    if (arrangement.hasChildNodes()) {
        arrangement.removeChild(arrangement.lastChild);
    }

    const para = document.createElement("p");
    para.setAttribute("class", "queen-info");
    para.innerHTML = `For ${n}x${n} board, ${array[n] - 1} arrangements are possible.`;
    arrangement.appendChild(para);

    // Adding boards to the div
    for (let i = 0; i < array[n]; ++i) {
        q.uuid.push(Math.random());
        let div = document.createElement('div');
        let table = document.createElement('table');
        let header = document.createElement('h4');
        header.innerHTML = `Board ${i + 1}`;
        table.setAttribute("id", `table-${q.uuid[i]}`);
        header.setAttribute("id", `paragraph-${i}`);
        chessBoard.appendChild(div);
        div.appendChild(header);
        div.appendChild(table);

        for (let rowIdx = 0; rowIdx < n; ++rowIdx) {
            const row = table.insertRow(rowIdx);
            row.setAttribute("id", `Row${rowIdx}`);
            for (let colIdx = 0; colIdx < n; ++colIdx) {
                const col = row.insertCell(colIdx);
                (rowIdx + colIdx) & 1
                    ? (col.style.backgroundColor = "#FF9F1C")
                    : (col.style.backgroundColor = "#FCCD90");
                col.innerHTML = "-";
                col.style.border = "0.3px solid #373f51";
            }
        }
    }

    await q.nQueen();
};
