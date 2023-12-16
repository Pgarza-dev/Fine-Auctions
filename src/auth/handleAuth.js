import { AUTH_FREE_PATHS } from "../utils/constants";
import { getAccessToken, getActiveUser } from "../utils/handleLocalStorageUser";

/**
 * Checks if a given path is an authentication-free path.
 * @param {string} path - The path to check.
 * @returns {boolean} - True if the path is an authentication-free path, false otherwise.
 */
function checkIfAuthFreePath(path) {
  return AUTH_FREE_PATHS.includes(path);
}

/**
 * Handles authentication for the application.
 * Checks if the current path is an authentication-free path.
 * If not, it checks if there is an active user and access token.
 * If no active user or access token is found, it logs a warning and redirects to the index page.
 */
export function handleAuth() {
  const authFreePath = checkIfAuthFreePath(window.location.pathname);

  if (authFreePath) {
    return;
  }

  const activeUser = getActiveUser();
  const accessToken = getAccessToken();

  if (!activeUser || !accessToken) {
    console.warn("No active user or access token found, redirecting.");
    // window.location.href = "/index.html";
  }
}
