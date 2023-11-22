import { AUTH_FREE_PATHS } from "../utils/constants";
import { getAccessToken, getActiveUser } from "../utils/handleLocalStorageUser";

function checkIfAuthFreePath(path) {
  return AUTH_FREE_PATHS.includes(path);
}

export function handleAuth() {
  const authFreePath = checkIfAuthFreePath(window.location.pathname);

  if (authFreePath) {
    return;
  }

  const activeUser = getActiveUser();
  const accessToken = getAccessToken();

  if (!activeUser || !accessToken) {
    console.warn("No active user or access token found, redirecting.");
    // goToUnauthorized();
  }
}
