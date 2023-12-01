import {
  USERNAME_MIN_LENGTH,
  PASSWORD_MIN_LENGTH,
  EMAIL_DOMAIN_WHITELIST,
} from "../utils/constants.js";

function checkValidString(string) {
  return /^[a-zA-Z0-9_]+$/.test(string);
}

function checkValidUsername(username, usernameMinLength) {
  return checkValidString(username) && username.length >= usernameMinLength;
}

function checkWhitelistedEmail(email, emailDomainWhiteList) {
  return emailDomainWhiteList.some((domain) => email.endsWith(domain));
}

function checkValidPassword(password, minPasswordLength) {
  return password.length >= minPasswordLength;
}

function checkPasswordsMatch(password, repeatPassword) {
  return password === repeatPassword;
}

/**
 * @typedef {Object} SignupFormDataObject
 * @property {string} username - The user's username.
 * @property {string} email - The user's email address.
 * @property {string} password - The user's password.
 * @property {string} repeatPassword - The user's repeated password.
 */

/**
 * @typedef {Object} ValidationResult
 * @property {boolean} isValid - Whether the form data is valid.
 * @property {Object.<string, string>} errors - An object where keys are field names and values are error messages.
 */

/**
 * Validate the signup form data.
 *
 * @param {SignupFormDataObject} form - The form data to validate.
 * @returns {ValidationResult} The result of the validation.
 */
export function checkSignupForm(form) {
  const { username, registerEmail, registerPassword, repeatPassword } = form;

  const validationResult = {
    isValid: true,
    errors: {},
  };

  if (!checkValidUsername(username, USERNAME_MIN_LENGTH)) {
    validationResult.isValid = false;
    validationResult.errors.username = "Invalid username.";
  }

  if (!checkWhitelistedEmail(registerEmail, EMAIL_DOMAIN_WHITELIST)) {
    validationResult.isValid = false;
    validationResult.errors.registerEmail = `Email can only end in ${EMAIL_DOMAIN_WHITELIST[0]} or ${EMAIL_DOMAIN_WHITELIST[1]}.`;
  }

  if (!checkValidPassword(registerPassword, PASSWORD_MIN_LENGTH)) {
    validationResult.isValid = false;
    validationResult.errors.registerPassword = "Invalid password.";
  }

  if (!checkPasswordsMatch(registerPassword, repeatPassword)) {
    validationResult.isValid = false;
    validationResult.errors.repeatPassword = "Passwords do not match.";
  }

  return validationResult;
}

/**
 * Validate the login form data.
 *
 * @param {Object} form - The form data to validate.
 * @returns {Object} The result of the validation.
 */
export function checkLoginForm(form) {
  const { email, password } = form;

  const loginValidationResults = {
    isValid: true,
    errors: {},
  };

  if (!checkWhitelistedEmail(email, EMAIL_DOMAIN_WHITELIST)) {
    loginValidationResults.isValid = false;
    loginValidationResults.errors.email = "Invalid email.";
  }

  if (!checkValidPassword(password, PASSWORD_MIN_LENGTH)) {
    loginValidationResults.isValid = false;
    loginValidationResults.errors.password = "Invalid password.";
  }

  return loginValidationResults;
}
