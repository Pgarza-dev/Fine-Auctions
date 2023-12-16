import { removeActiveUser } from "../utils/handleLocalStorageUser.js";
import { handleFormApiError } from "../forms/handleErrors.js";
import { createFormDataObject } from "../forms/utils.js";
import { checkLoginForm, checkSignupForm } from "../forms/validation.js";
import { loginUser } from "../services/auth.js";
import { clearErrors, displayErrors } from "../forms/handleErrors.js";

removeActiveUser();

/**
 * Handles the login process.
 * 
 * @param {Object} formDataObject - The form data object containing the user's name, email, and password.
 * @returns {Promise<void>} - A promise that resolves when the login process is complete.
 */
async function handleLogin(formDataObject) {
  const spinner = document.getElementById("spinner");

  const userData = {
    name: formDataObject.name,
    email: formDataObject.email,
    password: formDataObject.password,
  };
  const response = await loginUser(userData);

  if (response.error) {
    handleFormApiError([response.error]);
    Swal.fire({
      icon: "error",
      title: "Login failed",
      text: "Wrong password or email. Please try again",
      background: "#yourBackgroundColor",
      confirmButtonColor: "#D12600",
    });
    spinner.classList.add("hidden");
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
    spinner.classList.add("hidden");
  }
});

/**
 * Checks if the user is registered and performs actions based on the registration status.
 */
function checkIfRegistered() {
  const urlParams = new URLSearchParams(window.location.search);
  const registered = urlParams.get("registered");
  const norskActive = document.querySelector(".norsk-active");

  if (registered === "true") {
    alert("Registration successful! Please log in to access your profile.");

    const registrationSuccessMessage = document.getElementById(
      "registration-success-message",
    );

    if (registrationSuccessMessage) {
      registrationSuccessMessage.textContent =
        "Registration successful! Please log in to access your profile.";
    }
  } else if (registered === "false" && norskActive) {
    Swal.fire({
      icon: "error",
      title: "Registration failed",
      text: "Check your password or email. Please try again",
      background: "#yourBackgroundColor",
      confirmButtonColor: "#D12600",
    });
    spinner.classList.add("hidden");
  }
}

checkIfRegistered();
