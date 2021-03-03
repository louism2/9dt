import express from "express";

import Game from "../models/Game";
import { isValidPlayerName, isNumber, isUUID } from "../utils/ValidatorUtil";

const router = express.Router();

// Get Games
router.get("/drop-token", (req, res) => {
    Game.getAllGames().then((games) => {
        res.send({games: games});
    }).catch((err) => {
        res.status(500).send();
    });
});

// Create Game
router.post("/drop-token", (req, res) => {
    const { players, rows, columns } = req.body || {};

    const isValid = validateCreateGameRequest(players, rows, columns);
    if (!isValid) {
        return res.status(400).send();
    }

    Game.createGame(players, rows, columns).then((game) => {
        if (game.validationError) {
            res.status(400).send();
        } else {
            res.send({gameId: game.id});
        }
    }).catch((err) => {
        res.status(500).send();
    });
});

// Get Game state
router.get("/drop-token/:gameId", (req, res) => {
    const { gameId } = req.params;
    const isValid = validateGetGameStateRequest(gameId);
    if (!isValid) {
        return res.status(400).send();
    }

    Game.getGameStateById(gameId).then((gameState) => {
        if (!gameState) {
            return res.status(404).end();
        }
    
        if (!gameState.winner) {
            delete gameState.winner;
        }
    
        res.send(gameState);
    }).catch((err) => {
        res.status(500).send();
    });
});




// VALIDATORS //
const validateCreateGameRequest = (playersArray, rows, columns) => {
    if (!Array.isArray(playersArray) || playersArray.length !== 2) {
        return false;
    }

    const isValidPlayerNames = playersArray.every((name) => isValidPlayerName(name));
    if (!isValidPlayerNames) {
        return false;
    }

    if (!isNumber(rows) || !isNumber(columns)) {
        return false;
    }

    return true;
}

const validateGetGameStateRequest = (gameId) => {
    if(!isUUID(gameId)) {
        return false;
    }

    return true;
}

export default router;