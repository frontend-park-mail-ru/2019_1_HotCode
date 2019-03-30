export const signinFormConfig = {
    logotype: 'Sign In',
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
    otherButtonName: 'Sign up',
    nextFormNumber: 2,
};

export const signupFormConfig = {
    logotype: 'Sign Up',
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
    otherButtonName: 'Login',
    nextFormNumber: 1,
};