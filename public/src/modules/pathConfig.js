const urls = {
    server: {
        backend: 'https://warscript.herokuapp.com/v1',
        avatarBackend: 'https://warscript-images.herokuapp.com'
    },
    paths: {
        signinPath: '/sessions',
        signoutPath: '/sessions',
        mePath: '/sessions',
        signupPath: '/users',
        editPath: '/users',
        takenPath: '/users/used',

        avatar: '/photos'
    }
};

export default urls;