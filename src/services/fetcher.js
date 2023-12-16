/**
 * Makes an HTTP request to the specified URL with the given options.
 * @param {Object} options - The options for the request.
 * @param {string} options.url - The URL to make the request to.
 * @param {string} [options.method="GET"] - The HTTP method to use for the request.
 * @param {Object|null} [options.body=null] - The request body.
 * @param {boolean} [options.needsAuth=true] - Indicates if the request requires authentication.
 * @param {Object} [options.headers={}] - Additional headers to include in the request.
 * @param {Object} [options.query={}] - Query parameters to include in the request URL.
 * @returns {Promise<Object>} - A promise that resolves to the JSON response from the server.
 * @throws {Error} - If the request fails or if an access token is required but not found.
 */
export async function fetcher({
  url,
  method = "GET",
  body = null,
  needsAuth = true,
  headers = {},
  query = {},
}) {
  try {
    const defaultHeaders = {
      "Content-Type": "application/json",
    };

    if (needsAuth) {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        throw new Error("No access token found, please log in again.");
      }
      defaultHeaders["Authorization"] = `Bearer ${token}`;
    }

    const queryString = new URLSearchParams(
      Object.entries(query).map(([key, value]) => [
        key,
        value === true ? "true" : value,
      ]),
    ).toString();

    const completeUrl = queryString ? `${url}?${queryString}` : url;

    const fetchOptions = {
      method,
      headers: { ...defaultHeaders, ...headers },
      body: body ? JSON.stringify(body) : null,
    };

    const response = await fetch(completeUrl, fetchOptions);

    if (response.status === 401) {
      const errorJson = await response.json();
      throw new Error(errorJson.errors[0].message);
    }

    if (!response.ok) {
      throw new Error(`Failed to fetch ${url}, status ${response.status}`);
    }

    const json = await response.json();
    return json;
  } catch (error) {
    return { error: true, message: error.message };
  }
}
