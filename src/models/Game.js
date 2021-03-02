import DbService from "../utils/DbService";

const conn = DbService.getSequelizeConnection();

const TUPLES = 0;
const DEFAULT_ROW_COUNT = 4;
const DEFAULT_COLUMN_COUNT = 4;

class Game {

    static async getAllGames () {
        const gamesResponse = await conn.query("SELECT * FROM games;");
        return gamesResponse[TUPLES];
    }

    static async createGame (playersArray, rows, columns) {
        if (rows !== DEFAULT_ROW_COUNT || columns !== DEFAULT_COLUMN_COUNT) {
            return {validationError: "rows or columns are not valid"};
        }

        const gameResponse = await conn.query(`
            INSERT INTO games
            (players, rows, columns)
            VALUES (Array[:playersArray], :rows, :columns)
            RETURNING id;
        ;`, {
            replacements: { playersArray, rows, columns }
        });

        return gameResponse[TUPLES][0];
    }

    static async getGameStateById (id) {
        const gameResponse = await conn.query(`
            SELECT winner, state, players FROM games
            WHERE id = :id
        ;`, {
            replacements: { id }
        });

        return gameResponse[TUPLES][0];
    }

}

export default Game;