import { checkSignupForm } from "../forms/validation.js";
import { clearErrors, displayErrors } from "../forms/handleErrors.js";
import { createFormDataObject } from "../forms/utils.js";
import { handleFormApiError } from "../forms/handleErrors.js";
import { removeActiveUser } from "../utils/handleLocalStorageUser.js";
import { API_BASE_URL, REGISTER_ENDPOINT } from "../utils/constants.js";

removeActiveUser();

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

  clearErrors();

  displayErrors(registerValidationResult.errors);

  if (registerValidationResult.isValid) {
    await handleRegister(form);
  }
});
