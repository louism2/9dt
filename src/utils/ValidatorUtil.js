const isValidPlayerName = (name) => {
    if (typeof name !== "string" || name.length === 0) {
        return false;
    }

    return true;
}

const isNumber = (num) => {
    if (typeof num !== "number") {
        return false;
    }

    return true;
}

export {
    isValidPlayerName,
    isNumber
}