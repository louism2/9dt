class Board {
    constructor (moves, columns, consecutivePieceCount, playerName) {
        this.moves = moves;
        this.columns = columns;
        this.consecutivePieceCount = consecutivePieceCount;
        this.playerName = playerName;
        this.boardSpace = this.initializeBoardSpace();
    }

    initializeBoardSpace () {
        const columns = new Array(this.columns);
        for (let i = 0; i < columns.length; i++) {
            columns[i] = [];
        }

        this.moves.forEach((move) => columns[move.column].push(move.player));

        return columns;
    }

    detectVerticalMatch (column) {
        if (this.boardSpace[column].length < this.consecutivePieceCount) {
            return false;
        } else {
            return this.boardSpace[column].every((player) => player === this.playerName);
        }
    }

    detectHorizontalMatch (column) {
        let index = 0;
        let hasHorizontalMatch = false;
        const horizontalWindow = [];
        const row = this.boardSpace[column].length - 1;
        for(let i = 0; i < this.consecutivePieceCount; i++) {
            horizontalWindow.push(i);
        }

        while (index <= this.consecutivePieceCount - 1) {
            const localCoordWindow = [];
            horizontalWindow.forEach((addend) => {
                const coord = {
                    row: row,
                    col: column + addend
                }
                localCoordWindow.push(coord);
            })

            const isHorizontalMatch = localCoordWindow.every((coords) => {
                const column = this.boardSpace[coords.col];
                if (!column) {
                    return false;
                }
                const playerName = this.boardSpace[coords.col][coords.row];
                return playerName === this.playerName;
            });

            if (isHorizontalMatch) {
                hasHorizontalMatch = true;
                break;
            }

            for (let i = 0; i <= horizontalWindow.length - 1; i++) {
                horizontalWindow[i] = horizontalWindow[i] - 1;
            }
            index++;
        }

        return hasHorizontalMatch;
    }

    detectDiagonalMatch (column) {
        const row = this.boardSpace[column].length - 1;

        let hasDiagonalMatch = false;

        let index = 0;
        let forwardWindow = [];
        for(let i = 0; i < this.consecutivePieceCount; i++) {
            forwardWindow.push(i);
        }

        // Look for forward sloping diagonal match
        while (index <= this.consecutivePieceCount - 1) {
            const localCoordWindow = [];
            forwardWindow.forEach((addend) => {
                const coord = {
                    col: (column + addend),
                    row: (row + addend)
                }
                localCoordWindow.push(coord);
            });

            const isMatch = localCoordWindow.every((coords) => {
                const column = this.boardSpace[coords.col];
                if (!column) {
                    return false;
                }
                const playerName = this.boardSpace[coords.col][coords.row];
                return playerName === this.playerName;
            });

            if (isMatch) {
                hasDiagonalMatch = true;
                break;
            }

            for (let i = 0; i <= forwardWindow.length - 1; i++) {
                forwardWindow[i] = forwardWindow[i] - 1;
            }
            index++;
        }

        if (hasDiagonalMatch) {
            return true;
        }

        let backwardWindow = [];
        for(let i = 0; i < this.consecutivePieceCount; i++) {
            backwardWindow.push(i);
        }

        // Look for backward sloping diagonal match
        index = 0;
        while (index <= this.consecutivePieceCount - 1) {
            const localCoordWindow = [];
            backwardWindow.forEach((addend) => {
                const coord = {
                    col: (column + addend),
                    row: (row - addend)
                }
                localCoordWindow.push(coord);
            });

            const isMatch = localCoordWindow.every((coords) => {
                const column = this.boardSpace[coords.col];
                if (!column) {
                    return false;
                }
                const playerName = this.boardSpace[coords.col][coords.row];
                return playerName === this.playerName;
            });

            if (isMatch) {
                hasDiagonalMatch = true;
                break;
            }

            for (let i = 0; i <= backwardWindow.length - 1; i++) {
                backwardWindow[i] = backwardWindow[i] - 1;
            }
            index++;
        }

        return hasDiagonalMatch;

    }
}

export default Board