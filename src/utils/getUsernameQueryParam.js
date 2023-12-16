/**
 * Retrieves the username query parameter from the current URL.
 * @returns {string|null} The username query parameter value, or null if it is not present.
 */
export function getUsernameQueryParam() {
  const urlParams = new URLSearchParams(window.location.search);
  const username = urlParams.get("username");
  return username;
}
