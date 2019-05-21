export const signinFormConfig = {
    logotype: 'Login',
    formFields: [
        {
            label: 'Username',
            type: 'text',
            name: 'username',
            placeholder: 'Username',
        },
        {
            label: 'Password',
            type: 'password',
            name: 'password',
            placeholder: 'Password',
        },
    ],
    submitButtonName: 'Login',
    otherButtonName: '> Create account',
    nextFormNumber: 2,
};

export const signupFormConfig = {
    logotype: 'Sign up',
    formFields: [
        {
            label: 'Username',
            type: 'text',
            name: 'username',
            placeholder: 'Username',
        },
        {
            label: 'Password',
            type: 'password',
            name: 'password',
            placeholder: 'Password',
        },
        {
            label: 'Repeat Password',
            type: 'password',
            name: 'repeatPassword',
            placeholder: 'Password',
        },
    ],
    submitButtonName: 'Create',
    otherButtonName: '> You have account? Enter',
    nextFormNumber: 1,
};