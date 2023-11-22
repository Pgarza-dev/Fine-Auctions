import { API_BASE_URL } from "../utils/constants";
import { fetcher } from "./fetcher";

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
