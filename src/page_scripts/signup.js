import { checkSignupForm } from "../forms/validation.js";
import { clearErrors, displayErrors } from "../forms/handleErrors.js";
import { registerUser } from "../services/auth.js";
import { createFormDataObject } from "../forms/utils.js";
import { handleFormApiError } from "../forms/handleErrors.js";
import { removeActiveUser } from "../utils/handleLocalStorageUser.js";
import { API_BASE_URL, REGISTER_ENDPOINT } from "../utils/constants.js";
// import { getActiveUser } from "../utils/handleLocalStorageUser.js";

removeActiveUser();

// async function handleSignUp(formDataObject) {
//   const userData = {
//     name: formDataObject.username,
//     email: formDataObject.email,
//     password: formDataObject.password,
//   };
//   const response = await registerUser(userData);

//   if (response.errors) {
//     handleFormApiError(response.errors);
//   } else {
//     window.location.href = `/login/index.html?registered=true`;
//   }
// }

// const signupForm = document.querySelector("#register-form");

// signupForm.addEventListener("submit", (event) => {
//   event.preventDefault();

//   clearErrors();

//   const form = createFormDataObject(signupForm);
//   console.log(form);

//   const validationResult = checkSignupForm(form);
//   console.log(validationResult);

//   if (validationResult.isValid) {
//     handleSignUp(form);
//   } else {
//     displayErrors(validationResult.errors);
//   }
// });

// TEMPORARY CODE FOR TESTING
async function handleRegister(formDataObject) {
  try {
    const response = await fetch(API_BASE_URL + REGISTER_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: formDataObject.username,
        email: formDataObject.registerEmail,
        password: formDataObject.registerPassword,
      }),
    });

    const responseData = await response.json();

    console.log("Register response", responseData);

    if (!response.ok) {
      handleFormApiError(responseData, "api-error");
    } else {
      if (responseData.accessToken) {
        localStorage.setItem("accessToken", responseData.accessToken);
      }
      if (responseData.name) {
        localStorage.setItem("activeUser", responseData.name);
      }
      if (responseData.avatar) {
        localStorage.setItem("activeUserAvatar", responseData.avatar);
      }
      window.location.href = `/login/index.html?registered=true`;
    }
  } catch (error) {
    console.error("Error during registration:", error);
    // Handle error as needed, e.g., display a general error message
    handleFormApiError(
      { message: "Failed to register. Please try again later." },
      "api-error",
    );
  }
}

const registerForm = document.querySelector("#register-form");

registerForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const form = createFormDataObject(registerForm);

  const registerValidationResult = checkSignupForm(form);

  displayErrors(registerValidationResult.errors);
  checkSignupForm(form);
  clearErrors();

  if (registerValidationResult.isValid) {
    await handleRegister(form);
  } else {
    displayErrors(registerValidationResult.errors);
  }
});
