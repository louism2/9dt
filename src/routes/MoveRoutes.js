import express from "express";
import Move from "../models/Move";
import { isNumber, isUUID, isValidPlayerName } from "../utils/ValidatorUtil";

const router = express.Router()

// Post Move
router.post("/drop-token/:gameId/:playerName", (req, res) => {
    const { gameId, playerName } = req.params;
    const { column } = req.body || {};

    const isValid = validateCreateMoveRequest(gameId, playerName, column);
    if (!isValid) {
        return res.status(400).send();
    }

    Move.createMove(gameId, column, playerName).then((move) => {
        if (move.outOfTurnError) {
            res.status(409).send();
        } else if (move.gameNotFoundError) {
            res.status(404).send();
        } else if (move.illegalMoveError) {
            res.status(400).send();
        } else {
            const { id, moveNumber } = move;
            res.send({move: `${id}/moves/${moveNumber}`});
        }
    }).catch((err) => {
        res.status(500).send();
    });
});

// Player quit
router.delete("/drop-token/:gameId/:playerName", (req, res) => {
    const { gameId, playerName } = req.params;

    Move.playerQuit(gameId, playerName).then((response) => {
        if (response.gameNotFoundError) {
            res.status(404).send();
        } else if (response.gameCompletedError) {
            res.status(410).send();
        } else {
            res.status(202).send();
        }
    }).catch((err) => {
        res.status(500).send();
    });
});

// Get Moves
router.get("/drop-token/:gameId/moves", (req, res) => {
    const { gameId } = req.params;
    const { start, until } = req.query;

    const isValid = validateGetMovesRequest(gameId, start, until);
    if (!isValid) {
        return res.status(400).end();
    }

    Move.getMoves(gameId, start, until).then((moves) => {
        if (moves.length === 0) {
            res.status(404).send();
        } else {
            res.send({ moves });
        }
    }).catch((err) => {
        res.status(500);
    });
});


// VALIDATORS //
const validateCreateMoveRequest = (gameId, playerName, column) => {
    if (!isUUID(gameId)) {
        return false;
    }

    if (!isValidPlayerName(playerName)) {
        return false;
    }

    if (!isNumber(column)) {
        return false;
    }

    return true;
}

const validateGetMovesRequest = (gameId, start, until) => {
    if (!isUUID(gameId)) { 
        return false;
    }

    if (start !== undefined || until !== undefined) {
        if (start >= 0 && until >= start) {
            return true;
        } else {
            return false;
        }
    } else {
        return true;
    }
}

export default router;