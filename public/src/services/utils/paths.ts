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

export const viewPaths = {
    startViewPath: '/hello',
    mainViewPath: '/',
    loginViewPath: '/login',
    signupViewPath: '/signup',
    settingsViewPath: '/settings',
    descriptionViewPath: '/SLUG',
    liderboardViewPath: '/SLUG/liderboard',
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
    gameViewPath: /^\/([\d\w-_]+)\/game$/i,
};
