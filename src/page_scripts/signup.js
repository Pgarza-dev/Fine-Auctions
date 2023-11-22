import { checkSignupForm } from "../forms/validation.js";
import { clearErrors, displayErrors } from "../forms/handleErrors.js";
import { registerUser } from "../services/auth.js";
import { createFormDataObject } from "../forms/utils.js";
import { handleFormApiError } from "../forms/handleErrors.js";
import { removeActiveUser } from "../utils/handleLocalStorageUser.js";

removeActiveUser();

async function handleSignUp(formDataObject) {
  const userData = {
    name: formDataObject.username,
    email: formDataObject.email,
    password: formDataObject.password,
  };
  const response = await registerUser(userData);

  if (response.errors) {
    handleFormApiError(response.errors);
  } else {
    window.location.href = "/login";
  }
}

const signupForm = document.querySelector("#register-form");

signupForm.addEventListener("submit", (event) => {
  event.preventDefault();

  clearErrors();

  const form = createFormDataObject(signupForm);

  const validationResult = checkSignupForm(form);

  if (validationResult.isValid) {
    handleSignUp(form);
  } else {
    displayErrors(validationResult.errors);
  }
});
