const isUUID = (uuid) => {
    const regex = new RegExp(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    return regex.test(uuid);
}

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
    isUUID,
    isValidPlayerName,
    isNumber
}