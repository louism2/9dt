class Board {
    constructor (moves, columns, consecutivePieceCount, playerName) {
        this.moves = moves;
        this.columns = columns;
        this.consecutivePieceCount = consecutivePieceCount;
        this.playerName = playerName;
        this.boardSpace = this.initializeBoardSpace();
    }

    initializeBoardSpace () {
        console.log(">>>>>>> COLUMNS")
        const columns = new Array(this.columns);
        for (let i = 0; i < columns.length; i++) {
            columns[i] = [];
        }

        this.moves.forEach((move) => {
            columns[move.column].push(move.player)
        });

        console.log(columns);
        return columns;
    }

    
    // TODO: Add row/col for the spaces
    detectVerticalMatch (column) {
        const end = this.boardSpace[column].length - 1;
        const window = this.boardSpace[column].slice(end - (this.consecutivePieceCount - 1), end + 1);

        if (window.length < this.consecutivePieceCount) {
            return false;
        }

        return window.every((player) => player === this.playerName);
    }

    detectHorizontalMatch (column) {
        const row = this.boardSpace[column].length - 1;
        const window = [];

        for (let col = column - 3; col <= column + 3; col++) {
            window.push({row: row, col: col});
        }

        let consecutive = 0;
        for (let x = 0; x <= window.length - 1; x++) {
            if (consecutive >= this.consecutivePieceCount) {
                break;
            }

            const coord = window[x];
            const column = this.boardSpace[coord.col];
            if (!column) {
                consecutive = 0;
                continue;
            }

            const player = this.boardSpace[coord.col][coord.row];
            if (player === this.playerName) {
                consecutive += 1;
            } else {
                consecutive = 0;
            }
        }

        return consecutive >= 4;
    }

    detectDiagonalMatch (column) {
        const row = this.boardSpace[column].length - 1;
        
        const buffer = this.consecutivePieceCount - 1;
        const forwardWindow = [];
        for (let z = -buffer; z <= buffer; z++) {
            const coord = {
                row: row + z,
                col: column + z
            }

            forwardWindow.push(coord);
        }

        console.log(">>>>>> FW: ", forwardWindow);

        let forwardConsecutive = 0;
        for (let x = 0; x <= forwardWindow.length - 1; x++) {
            if (forwardConsecutive >= this.consecutivePieceCount) {
                break;
            }

            const currentWindowEl = forwardWindow[x];
            const column = currentWindowEl.col;
            const row =  currentWindowEl.row;

            if (this.boardSpace[column]) {
                const name = this.boardSpace[column][row];
                if (name === this.playerName) {
                    forwardConsecutive += 1;
                } else {
                    forwardConsecutive = 0;
                }
            } else {
                forwardConsecutive = 0;
            }
        }
        
        if (forwardConsecutive >= this.consecutivePieceCount) {
            return true;
        }

        let backwardConsecutive = 0;
        let backwardWindow = [];
        for (let z = -buffer; z <= buffer; z++) {
            const coord = {
                row: row - z,
                col: column + z
            }

            backwardWindow.push(coord);
        }

        
        for (let x = 0; x <= backwardWindow.length - 1; x++) {
            if (backwardConsecutive >= this.consecutivePieceCount) {
                break;
            }

            const currentWindowEl = backwardWindow[x];
            const column = currentWindowEl.col;
            const row =  currentWindowEl.row;

            if (this.boardSpace[column]) {
                const name = this.boardSpace[column][row];
                if (name === this.playerName) {
                    backwardConsecutive += 1;
                } else {
                    backwardConsecutive = 0;
                }
            } else {
                backwardConsecutive = 0;
            }
        }

        return backwardConsecutive >= this.consecutivePieceCount;
    }
}

export default Board