console.log("login.js");

import { removeActiveUser } from "../utils/handleLocalStorageUser.js";
import { handleFormApiError } from "../forms/handleErrors.js";
import { createFormDataObject } from "../forms/utils.js";
import { checkLoginForm, checkSignupForm } from "../forms/validation.js";
import { loginUser } from "../services/auth.js";
import { clearErrors, displayErrors } from "../forms/handleErrors.js";
import { API_BASE_URL, REGISTER_ENDPOINT } from "../utils/constants.js";
import { makeApiCall } from "../services/makeApiCall.js";

removeActiveUser();

async function handleLogin(formDataObject) {
  const userData = {
    name: formDataObject.name,
    email: formDataObject.email,
    password: formDataObject.password,
  };
  const response = await loginUser(userData);

  if (response.error) {
    handleFormApiError([response.error]);
  } else {
    window.location.href = "/user_page/index.html?username=" + response.name;
  }
}

const loginForm = document.querySelector("#login-form");
console.log(loginForm);

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const spinner = document.getElementById("spinner");
  spinner.classList.remove("hidden");

  clearErrors();

  const form = createFormDataObject(loginForm);

  const loginValidationResult = checkLoginForm(form);

  if (loginValidationResult.isValid) {
    handleLogin(form);
  } else {
    displayErrors(loginValidationResult.errors);
  }
});

function checkIfRegistered() {
  const urlParams = new URLSearchParams(window.location.search);
  const registered = urlParams.get("registered");

  if (registered === "true") {
    alert("Registration successful! Please log in to access your profile.");

    const registrationSuccessMessage = document.getElementById(
      "registration-success-message",
    );

    if (registrationSuccessMessage) {
      registrationSuccessMessage.textContent =
        "Registration successful! Please log in to access your profile.";
    }
  }
}

checkIfRegistered();
