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
        console.log(err)
        res.status(500).send();
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

export default router;