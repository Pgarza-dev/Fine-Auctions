import { API_BASE_URL, AUCTION_LISTING_ENDPOINT } from "../utils/constants";
import { USER_PROFILE_ENDPOINT } from "../utils/constants";
import { fetcher } from "./fetcher";
import { makeApiCall } from "./makeApiCall";

/**
 * Retrieves a single user profile from the API.
 * @param {string} username - The username of the profile to retrieve.
 * @returns {Promise<Object>} - A promise that resolves to the profile object.
 * @throws {Error} - If the profile cannot be retrieved.
 */
export async function getSingleProfile(username) {
  return makeApiCall({
    endpoint: USER_PROFILE_ENDPOINT + "/" + username,
    method: "GET",
    needsAuth: true,
    errorMessage: "Could not get profile.",
  });
}

/**
 * Updates the profile picture of a user.
 * 
 * @param {string} username - The username of the user.
 * @param {string} avatarUrl - The URL of the new profile picture.
 * @returns {Promise} - A promise that resolves when the profile picture is updated.
 */
export async function updateProfilePicture(username, avatarUrl) {
  return makeApiCall({
    endpoint: USER_PROFILE_ENDPOINT + "/" + username + "/media",
    method: "PUT",
    body: {
      avatar: avatarUrl,
    },
    needsAuth: true,
    errorMessage: "Could not update profile picture! Please try again.",
  });
}

/**
 * Makes an API call to create an auction listing.
 * @param {Object} body - The body of the request containing the auction listing details.
 * @param {number} body.id - The ID of the auction listing.
 * @param {string} body.title - The title of the auction listing.
 * @param {string} body.description - The description of the auction listing.
 * @param {string[]} body.media - The media files associated with the auction listing.
 * @param {string[]} body.tags - The tags associated with the auction listing.
 * @param {string} body.created - The creation date of the auction listing.
 * @param {string} body.updated - The last updated date of the auction listing.
 * @param {string} body.endsAt - The end date of the auction listing.
 * @param {number} body.bids - The number of bids on the auction listing.
 * @returns {Promise} - A promise that resolves with the API response.
 */
export async function auctionListing(body) {
  return makeApiCall({
    endpoint: AUCTION_LISTING_ENDPOINT + "/",
    method: "GET",
    body: {
      id: body.id,
      title: body.title,
      description: body.description,
      media: body.media,
      tags: body.tags,
      created: body.created,
      updated: body.updated,
      endsAt: body.endsAt,
      count: {
        bids: body.bids,
      },
    },
    needsAuth: true,
    errorMessage: "Could not create auction listing! Please try again.",
  });
}
