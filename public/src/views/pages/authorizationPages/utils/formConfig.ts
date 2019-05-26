export const signinFormConfig = {
    logotype: 'Login',
    formFields: [
        {
            label: 'Username',
            type: 'text',
            name: 'username',
            placeholder: 'Username',
            autocomplite: 'username',
        },
        {
            label: 'Password',
            type: 'password',
            name: 'password',
            placeholder: 'Password',
            autocomplite: 'current-password',
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
            autocomplite: 'username',
        },
        {
            label: 'Password',
            type: 'password',
            name: 'password',
            placeholder: 'Password',
            autocomplite: 'new-password',
        },
        {
            label: 'Repeat Password',
            type: 'password',
            name: 'repeatPassword',
            placeholder: 'Password',
            autocomplite: 'new-password',
        },
    ],
    submitButtonName: 'Create',
    otherButtonName: '> Have an account? Enter!',
    nextFormNumber: 1,
};