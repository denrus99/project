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
    return game;
};


const joinToGame = async function (gameId, userLogin) {
    let gameForRequest = {
        gameId,
        userLogin
    };
    let response = await fetch("/game/join", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(gameForRequest)
    });
    return await response.json();
};

const getWords = async function () {
    let response = await fetch("/game/words");
    return await response.json();
};

const startGame = async function (gameId) {
    let game = {
        gameId
    }
    let response = await fetch("/game/start", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(game)
    });
    return response.ok;
};

const getLeaderBoard = async function (gameId) {
    let game = {
        gameId
    }
    let response = await fetch("/game/leaderBoard", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(game)
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
    let userLogin = await response.json();
    return {
        status: response.ok, login: userLogin
    };
};

const loginUserGoogle = async function (login, password, photo) {
    debugger
    let user = {
        login,
        password: btoa(password),
        photo
    };
    let response = await fetch("/authentication/authenticateGoogle", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(user)
    });
    let userLogin = await response.json();
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

const getUser = async function (login) {
    let response = await fetch(login);
    let user = await response.json();
    return user;
};

const getLobbys = async function (pageNumber) {
    let response = await fetch(`game/lobby?page=${pageNumber || 0}`);
    let lobbys = response.ok ? await response.json() : [];
    return lobbys;
};

const addScoresAlmostGuessed = async function(gameId, login){
    let game = {
        gameId,
        login
    }
    let response = await fetch("/game/updateSingleUser", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(game)
    });
    return response.ok;
}
const andRound = async function(gameId, loginMaster, loginGuessed){
    let game = {
        gameId,
        loginMaster,
        loginGuessed
    }
    let response = await fetch("/game/update", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(game)
    });
    return await response.text();
}

const updateUsers = async function(gameId){
    let game = {
        gameId
    }
    debugger
    let response = await fetch("/game/end", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(game)
    });
    return response.ok;
}

export {createGame, joinToGame, getWords, startGame, getLeaderBoard, loginUser, register, logoutUser, getUser, getLobbys,addScoresAlmostGuessed, andRound, loginUserGoogle, updateUsers}
