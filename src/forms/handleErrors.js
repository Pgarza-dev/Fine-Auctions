/**
 * Displays errors on the form by updating the corresponding error elements.
 * @param {Object} errors - The errors object containing the error messages for each form field.
 */
export function displayErrors(errors) {
  for (const [key, value] of Object.entries(errors)) {
    const errorElement = document.querySelector(`#${key}-error`);
    if (errorElement) {
      errorElement.textContent = value;
    }
  }
}

/**
 * Clears the error messages displayed on the form.
 */
export function clearErrors() {
  const errorElements = document.querySelectorAll("[id$='-error']");
  errorElements.forEach((element) => {
    element.textContent = "";
  });
}

/**
 * Handles API errors and displays them in the DOM.
 * @param {Array} errors - An array of error objects.
 */
export function handleFormApiError(errors) {
  const apiErrorElement = document.querySelector("#api-error");

  apiErrorElement.innerHTML = "";

  errors.forEach((error) => {
    const errorElement = document.createElement("p");
    errorElement.textContent = error.message;
    apiErrorElement.appendChild(errorElement);
  });
}
