// Application Constants
export const APP_NAME = 'TradeManager';
export const APP_TAGLINE = 'Professional Trading Journal';

// UI Constants
export const SIDEBAR_MOBILE_OFFSET = 'ml-12'; // 48px offset for hamburger button

// Auth Messages
export const AUTH_MESSAGES = {
    LOGIN_WELCOME: 'Welcome back',
    LOGIN_SUBTITLE: 'Enter your credentials to access your account',
    REGISTER_WELCOME: 'Create an account',
    REGISTER_SUBTITLE: 'Start tracking your trades professionally',
    LOGIN_SUCCESS: (name: string) => `Welcome back, ${name}!`,
    REGISTER_SUCCESS: 'Account created successfully!',
    LOGOUT_SUCCESS: 'Logged out successfully',
    LOGIN_FAILED: 'Login failed. Please check your credentials.',
    REGISTER_FAILED: 'Registration failed. Please try again.',
} as const;

// Form Labels
export const FORM_LABELS = {
    EMAIL: 'Email',
    PASSWORD: 'Password',
    FIRST_NAME: 'First Name',
    LAST_NAME: 'Last Name',
    LOGIN_BUTTON: 'Login',
    REGISTER_BUTTON: 'Create Account',
    LOGGING_IN: 'Logging in...',
    REGISTERING: 'Creating account...',
} as const;

// Links
export const AUTH_LINKS = {
    NO_ACCOUNT: "Don't have an account?",
    HAVE_ACCOUNT: 'Already have an account?',
    CREATE_ACCOUNT: 'Create account',
    LOGIN: 'Login',
} as const;

// Validation Messages
export const VALIDATION_MESSAGES = {
    EMAIL_REQUIRED: 'Email is required',
    EMAIL_INVALID: 'Please enter a valid email address',
    PASSWORD_REQUIRED: 'Password is required',
    PASSWORD_MIN_LENGTH: 'Password must be at least 6 characters',
    FIRST_NAME_REQUIRED: 'First name is required',
    LAST_NAME_REQUIRED: 'Last name is required',
} as const;

// Theme
export const THEME_LABELS = {
    SWITCH_TO_LIGHT: 'Switch to light mode',
    SWITCH_TO_DARK: 'Switch to dark mode',
    DARK_MODE: 'Dark Mode',
    LIGHT_MODE: 'Light Mode',
} as const;
