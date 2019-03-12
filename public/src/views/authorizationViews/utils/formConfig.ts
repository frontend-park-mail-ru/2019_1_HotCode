export const signinFormConfig = {
    logotype: 'Sign in',
    formFields: [
        {
            label: 'Username',
            type: 'text',
            name: 'username',
            placeholder: 'Human325'
        },
        {
            label: 'Password',
            type: 'password',
            name: 'password'
        }
    ],
    submitButtonName: 'Login',
    otherButtonName: 'Sign up',
    nextFormNumber: 2
};

export const signupFormConfig = {
    logotype: 'Sign Up',
    formFields: [
        {
            label: 'Username',
            type: 'text',
            name: 'username',
            placeholder: 'Human325'
        },
        {
            label: 'Password',
            type: 'password',
            name: 'password'
        },
        {
            label: 'Repeat Password',
            type: 'password',
            name: 'repeatPassword'
        }
    ],
    submitButtonName: 'Create',
    otherButtonName: 'Login',
    nextFormNumber: 1
};