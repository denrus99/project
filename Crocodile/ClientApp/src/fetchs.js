String.prototype.hashCode = function () {
    var hash = 0;

    try {

        if (this.length == 0) return hash;

        for (i = 0; i < this.length; i++) {
            char = this.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return hash;

    } catch (e) {
        throw new Error('hashCode: ' + e);
    }
};

const createGame = async function (isOpen, roundsCount, roundTime, creatorUserLogin) {
    let gameFroRequest = {
        isOpen,
        roundsCount,
        roundTime,
        creatorUserLogin
    };
    let response = await fetch("/game/creategame", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(gameFroRequest)
    });
    if (!response.ok) {
        throw new Error(response.status.toString());
    }
    let game = await response.json();
    return game.id;
};

const joinToGame = async function (gameId, userLogin) {
    let gameFroRequest = {
        gameId,
        userLogin
    };
    let response = await fetch("/game/joinToGame", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(gameFroRequest)
    });
    return response.ok;
};

const getWords = async function () {
    let response = await fetch("/game/getWords");
    return await response.json();
};

const startGame = async function (gameId) {
    let response = await fetch("/game/startGame", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: gameId
    });
    return response.ok;
};

const getLeaderBoard = async function (gameId) {
    let response = await fetch("/game/getLeaderBoard", {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: gameId
    });
    return await response.json();
};

const loginUser = async function (login, password) {
    let user = {
        login,
        password
    };
    let response = await fetch("/authentication/login", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(user)
    });
    if (!response.ok) {
        throw new Error(response.status.toString());
    }
    return response.status;
};

const register = async function (login, password) { 
    let user = {
        login,
        password
    };
    let response = await fetch("/authentication/register", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(user)
    });
    if (!response.ok) {
        throw new Error(response.status.toString());
    }
    return response.status;
};

const logoutUser = async function () {
    let response = await fetch("/authentication/logout");
    return await response.json();
};


export {createGame, joinToGame, getWords, startGame, getLeaderBoard, loginUser, register, logoutUser}