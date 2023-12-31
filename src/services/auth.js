import { makeApiCall } from "./makeApiCall";
import {
  setAccessToken,
  setActiveUser,
  setActiveUserAvatar,
} from "../utils/handleLocalStorageUser";
import { REGISTER_ENDPOINT, LOGIN_ENDPOINT } from "../utils/constants";

export async function registerUser(userData) {
  return makeApiCall({
    endpoint: REGISTER_ENDPOINT,
    method: "POST",
    body: userData,
    needsAuth: false,
    errorMessage:
      "Failed to register user. Please ensure you provide valid registration data and try again.",
  });
}

/**
 * API call to login a user
 * @param {Object} userData - The user data for login.
 * @return {Promise<Object>} - A promise that resolves to the login data.
 */
export async function loginUser(userData) {
  const data = await makeApiCall({
    endpoint: LOGIN_ENDPOINT,
    method: "POST",
    body: userData,
    needsAuth: false,
    errorMessage: "Could not log in! Please try again.",
  });

  if (data.error) {
    return data;
  }

  if (data) {
    if (data.accessToken) {
      setAccessToken(data.accessToken);
    }
    if (data.name) {
      setActiveUser(data.name);
    }
    if (data.avatar) {
      setActiveUserAvatar(data.avatar);
    }
  }

  return data;
}
