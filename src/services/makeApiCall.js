import { API_BASE_URL } from "../utils/constants";
import { fetcher } from "./fetcher";

/**
 * Handles errors that occur during API calls.
 * @param {Error} error - The error object.
 * @param {string} [message="Something went wrong! Please try again."] - The error message to display.
 */
function handleErrors(
  error,
  message = "Something went wrong! Please try again.",
) {
  console.error(error);
}

function handleSuccess(message) {
  if (message) {
  } 
}

/**
 * Makes an API call to the specified endpoint.
 * @param {Object} options - The options for the API call.
 * @param {string} options.endpoint - The endpoint URL.
 * @param {string} [options.method="GET"] - The HTTP method for the API call.
 * @param {Object} [options.body=null] - The request body for the API call.
 * @param {Object} [options.query={}] - The query parameters for the API call.
 * @param {boolean} [options.needsAuth=true] - Indicates if the API call requires authentication.
 * @param {string} [options.errorMessage] - The error message to display on failure.
 * @param {string} [options.successMessage] - The success message to display on success.
 * @param {Array} [options.defaultReturn=[]] - The default return value on failure.
 * @param {boolean} [options.disableError=false] - Indicates if error handling should be disabled.
 * @returns {Promise<Object>} - The result of the API call.
 * @throws {Error} - If the API call returns an error.
 */
export async function makeApiCall({
  endpoint,
  method = "GET",
  body = null,
  query = {},
  needsAuth = true,
  errorMessage,
  successMessage,
  defaultReturn = [],
  disableError = false,
}) {
  try {
    if (method === "GET") {
      body = null;
    } else {
      body = {
        ...body,
      };
    }
    const result = await fetcher({
      url: API_BASE_URL + endpoint,
      method,
      body,
      needsAuth,
      query: {
        ...query,
      },
    });

    if (result.error) {
      throw new Error(result.message);
    } 

    handleSuccess(successMessage);
    return result;
  } catch (error) {
    if (!disableError) {
      handleErrors(error, errorMessage);
    }
    return { error } || defaultReturn;
  }
}
