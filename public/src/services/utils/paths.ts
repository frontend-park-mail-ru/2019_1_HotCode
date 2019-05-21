export const userPaths = {
    loginPath: '/sessions',
    logoutPath: '/sessions',
    mePath: '/sessions',

    signupPath: '/users',
    editPath: '/users',

    takenPath: '/users/used',
};

export const avatarPaths = {
    sendAvatarPath: '/photos',
    getAvatarPath: '/photos',
};

export const gamePaths = {
    getGamePath: '/games',
    getGamesPath: '/games',
    getScorePath: '/games',
    getCountUsersPath: '/games',
};

export const chatPaths = {
    sendMessagePath: '/chat/connect',
};

export const botsPaths = {
    getBotsPath: '/bots',
    sendBotsPath: '/bots',
    getMatchesPath: '/matches',
    getMoreMatchesPath: '/matches',
    getMatchPath: '/matches',
};

export const botsWSPaths = {
    updateBotsPath: '/bots/verification',
};

export const viewPaths = {
    startViewPath: '/hello',
    mainViewPath: '/',
    loginViewPath: '/login',
    signupViewPath: '/signup',
    settingsViewPath: '/settings',
    descriptionViewPath: '/SLUG',
    liderboardViewPath: '/SLUG/liderboard',
    matchesViewPath: '/SLUG/matches',
    matchViewPath: '/SLUG/matches/ID',
    gameViewPath: '/SLUG/game',
};

export const viewRegs = {
    startViewPath: /^\/hello$/i,
    mainViewPath: /^\/$/i,
    loginViewPath: /^\/login$/i,
    signupViewPath: /^\/signup$/i,
    settingsViewPath: /^\/settings$/i,
    descriptionViewPath: /^\/([\d\w-_]+)$/i,
    liderboardViewPath: /^\/([\d\w-_]+)\/liderboard$/i,
    matchesViewPath: /^\/([\d\w-_]+)\/matches$/i,
    matchViewPath: /^\/([\d\w-_]+)\/matches\/([\d]+)$/i,
    gameViewPath: /^\/([\d\w-_]+)\/game$/i,
};
