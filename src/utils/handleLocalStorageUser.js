const LOCAL_STORAGE_KEY = "username";

/**
 * Retrieves the active user from local storage.
 * @returns {string|null} The username of the active user, or null if no active user is found.
 */
export function getActiveUser() {
  const username = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!username) {
    console.warn("No active user found in local storage.");
    return null;
  }
  return username;
}

/**
 * Sets the active user in local storage.
 * @param {string} username - The username of the active user.
 * @throws {Error} If the username is invalid (empty or not a string).
 */
export function setActiveUser(username) {
  if (typeof username !== "string" || username.trim() === "") {
    throw new Error("Invalid username.");
  }
  localStorage.setItem(LOCAL_STORAGE_KEY, username);
}

export function clearActiveUser() {
  localStorage.removeItem(LOCAL_STORAGE_KEY);
}

/**
 * Retrieves the active user's avatar from local storage.
 * @returns {string|null} The URL of the user's avatar, or null if no avatar is found.
 */
export function getActiveUserAvatar() {
  const avatar = localStorage.getItem("avatar");
  if (!avatar) {
    console.warn("No avatar found in local storage.");
    return null;
  }
  return avatar;
}

/**
 * Sets the active user's avatar in the local storage.
 * @param {string} avatar - The avatar URL of the user.
 * @throws {Error} If the avatar parameter is not a string.
 */
export function setActiveUserAvatar(avatar) {
  if (typeof avatar !== "string") {
    throw new Error("Invalid avatar.");
  }
  localStorage.setItem("avatar", avatar);
}

export function clearActiveUserAvatar() {
  localStorage.removeItem("avatar");
}

/**
 * Retrieves the access token from localStorage.
 * @returns {string|null} The access token if found, otherwise null.
 */
export function getAccessToken() {
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) {
    console.warn("No access token found in localStorage.");
    return null;
  }
  return accessToken;
}

/**
 * Sets the access token in the local storage.
 * @param {string} accessToken - The access token to be set.
 * @throws {Error} If the access token is not a string.
 */
export function setAccessToken(accessToken) {
  if (typeof accessToken !== "string") {
    throw new Error("Invalid access token.");
  }
  localStorage.setItem("accessToken", accessToken);
}

export function clearAccessToken() {
  localStorage.removeItem("accessToken");
}

export function removeActiveUser() {
  clearActiveUser();
  clearActiveUserAvatar();
  clearAccessToken();
}
