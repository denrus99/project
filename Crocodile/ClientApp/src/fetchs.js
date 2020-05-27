const createGame = async function (isOpen, roundsCount, roundTime) {
    let gameFroRequest = {
        isOpen,
        roundsCount,
        roundTime
    };
    let response = await fetch("/game/create", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(gameFroRequest)
    });
    if (!response.ok) {
        return { error: response.status };
    }
    let game = await response.json();
    return game.gameId;
};

const joinToGame = async function (gameId, userLogin) {
    let gameFroRequest = {
        gameId,
        userLogin
    };
    let response = await fetch("/game/join", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(gameFroRequest)
    });
    return response.ok;
};

const getWords = async function () {
    let response = await fetch("/game/words");
    return await response.json();
};

const startGame = async function (gameId) {
    let response = await fetch("/game/start", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: gameId
    });
    return response.ok;
};

const getLeaderBoard = async function (gameId) {
    let response = await fetch("/game/leaderBoard", {
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
        password: btoa(password)
    };
    let response = await fetch("/authentication/login", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(user)
    });
    let userLogin = await response.text();
    return {
        status: response.ok, login: userLogin
    };
};

const register = async function (login, password) { 
    let user = {
        login,
        password: btoa(password)
    };
    let response = await fetch("/authentication/register", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(user)
    });
    let userLogin = await response.json();
    return {
        status: response.ok, login: userLogin.login
    };
};

const logoutUser = async function () {
    let response = await fetch("/authentication/logout");
    return response.ok;
};

export {createGame, joinToGame, getWords, startGame, getLeaderBoard, loginUser, register, logoutUser}