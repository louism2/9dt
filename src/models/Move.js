import DbService from "../utils/DbService";

import Board from "./Board";

const conn = DbService.getSequelizeConnection();

const CONSECUTIVE_PEICE_COUNT = 4;
const TUPLES = 0;

class Move {

    static async createMove (gameId, column, playerName) {
        // Does game exist?
        const gameQuery = conn.query(`
            SELECT * FROM games 
            WHERE id = :gameId AND 
            :playerName = ANY(players) AND
            state != 'DONE';
        ;`, {
            replacements: { gameId, playerName }
        });

        // Is it the submitting players turn?
        const movesQuery = conn.query(`
            SELECT * FROM moves
            WHERE "gameId" = :gameId
            ORDER BY "createdAt"
        ;`, {
            replacements: { gameId }
        });

        const response = await Promise.all([gameQuery, movesQuery]);
        const game = response[0][TUPLES][0];
        const moves = response[1][TUPLES];

        if (!game) {
            return {gameNotFoundError: "A game with that id and player was not found"}; 
        } else if (column < 0 || column > game.columns - 1) {
            return {malformedInputError: "The column number is not in the valid range"};
        }

        const mostRecentMove = moves[moves.length - 1];
        if (moves.length === 0 && game.players[0] !== playerName) {
            return {outOfTurnError: "It's not your turn to make a move, you cheater!"};
        } else if (mostRecentMove?.player === playerName) {
            return {outOfTurnError: "It's not your turn to make a move, you cheater!"};
        }

        const movesByColumn = moves.filter((move) => move.column === column);
        if (movesByColumn.length >= game.rows) {
            return {illegalMoveError: "The column you want to drop into is full"};
        } else if (moves.length + 1 >= (game.rows * game.columns)) {
            await conn.query(`
                UPDATE games SET state = 'DONE'
                WHERE id = :gameId;
            ;`, {
                replacements: { gameId }
            });
        }

        // is there a win?
        const isWinningDrop = this.determineIfWinningDrop(game, moves, column, playerName);
        if (isWinningDrop) {
            await conn.query(`
                UPDATE games SET state = 'DONE', winner = :playerName
                WHERE id = :gameId;
            ;`, {
                replacements: { gameId, playerName }
            });
        }

        await conn.query(`
            INSERT INTO moves ("gameId", "column", type, player)
            VALUES (:gameId, :column, 'MOVE', :playerName);
        ;`, {
            replacements: { gameId, column, playerName }
        });

        return {id: game.id, moveNumber: moves.length + 1};
    }

    static determineIfWinningDrop (game, moves, column, playerName) {
        const copyOfMoves = [...moves];
        copyOfMoves.push({ column, player: playerName });

        const board = new Board(copyOfMoves, game.columns, CONSECUTIVE_PEICE_COUNT, playerName);

        const hasVerticalMatch = board.detectVerticalMatch(column);
        if (hasVerticalMatch) {
            return true;
        }

        const hasHorizontalMatch = board.detectHorizontalMatch(column);
        if (hasHorizontalMatch) {
            return true;
        }

        const hasDiagonalMatch = board.detectDiagonalMatch(column);
        if (hasDiagonalMatch) {
            return true;
        }

        return false;
    }

    static async playerQuit (gameId, playerName) {
        const gameResponse = await conn.query(`
            SELECT state FROM games
            WHERE id = :gameId AND
            :playerName = ANY(players);
        `, {
            replacements: { gameId, playerName }
        });

        const game = gameResponse[TUPLES][0];
        if (!game) {
            return {gameNotFoundError: "Game with id or player not found"};
        } else if (game.state === 'DONE') {
            return {gameCompletedError: "Game already completed"};
        }

        return await conn.query(`
            UPDATE games 
            SET state = 'DONE'
            WHERE id = :gameId;

            INSERT INTO moves ("gameId", type, player)
            VALUES (:gameId, 'QUIT', :playerName);
        `, {
            replacements: { gameId, playerName }
        });
    }

    static async getMoves (gameId, start, until) {
        let rangeQuery = "";
        let limit;
        if (start >= 0) {
            limit = (until - start) + 1;
            rangeQuery = `OFFSET :start LIMIT :limit`;
        }

        const movesResponse = await conn.query(`
            SELECT * FROM moves
            WHERE "gameId" = :gameId ORDER BY "createdAt"
            ${rangeQuery}
        ;`, {
            replacements: { gameId, start, limit }
        });

        return movesResponse[TUPLES];
    }

    static async getMoveById (moveId) {
        const moveQuery = await conn.query(`
            SELECT * FROM moves
            WHERE id = :moveId
        ;`, {
            replacements: { moveId }
        });

        return moveQuery[TUPLES][0];
    }

}

export default Move;