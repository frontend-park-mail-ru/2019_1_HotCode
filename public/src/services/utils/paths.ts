export const userPaths = {
    loginPath: '/sessions',
    logoutPath: '/sessions',
    mePath: '/sessions',

    signupPath: '/users',
    editPath: '/users',
    getUserPath: '/users',

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
    getMoreBotsPath: '/bots',
    sendBotsPath: '/bots',
    getMatchesPath: '/matches',
    getMoreMatchesPath: '/matches',
    getMatchPath: '/matches',
};

export const botsWSPaths = {
    updateBotsPath: '/matches/connect',
};

export const notifyWSPaths = {
    getNotifyPath: '/connect',
};

export const viewPaths = {
    startViewPath: '/hello',
    mainViewPath: '/',
    loginViewPath: '/login',
    signupViewPath: '/signup',
    profileViewPath: '/profile/ID/settings',
    userMatchesViewPath: '/profile/ID/matches',
    userBotsViewPath: '/profile/ID/bots',
    descriptionViewPath: '/SLUG',
    liderboardViewPath: '/SLUG/leaderboard',
    matchesViewPath: '/SLUG/matches',
    matchViewPath: '/SLUG/matches/ID',
    gameViewPath: '/SLUG/game',
};

export const viewRegs = {
    startViewPath: /^\/hello$/i,
    mainViewPath: /^\/$/i,
    loginViewPath: /^\/login$/i,
    signupViewPath: /^\/signup$/i,
    profileViewPath: /^\/profile\/([\d\w-_]+)\/settings$/i,
    userMatchesViewPath: /^\/profile\/([\d\w-_]+)\/matches$/i,
    userBotsViewPath: /^\/profile\/([\d\w-_]+)\/bots$/i,
    descriptionViewPath: /^\/([\d\w-_]+)$/i,
    liderboardViewPath: /^\/([\d\w-_]+)\/leaderboard$/i,
    matchesViewPath: /^\/([\d\w-_]+)\/matches$/i,
    matchViewPath: /^\/([\d\w-_]+)\/matches\/([\d]+)$/i,
    gameViewPath: /^\/([\d\w-_]+)\/game$/i,
};
