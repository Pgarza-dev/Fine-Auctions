import { removeActiveUser } from "../utils/handleLocalStorageUser.js";
import { handleFormApiError } from "../forms/handleErrors.js";
import { createFormDataObject } from "../forms/utils.js";
import { checkLoginForm } from "../forms/validation.js";
import { loginUser } from "../services/auth.js";
import { clearErrors, displayErrors } from "../forms/handleErrors.js";

removeActiveUser();

async function handleLogin(formDataObject) {
  const userData = {
    email: formDataObject.email,
    password: formDataObject.password,
  };
  const response = await loginUser(userData);

  if (response.error) {
    handleFormApiError([response.error]);
  } else {
    window.location.href = "/";
  }
}

const loginForm = document.querySelector("#login-form");

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();

  clearErrors();

  const form = createFormDataObject(loginForm);

  const loginValidationResult = checkLoginForm(form);

  if (loginValidationResult.isValid) {
    handleLogin(form);
  } else {
    displayErrors(loginValidationResult.errors);
  }
});
