import { API_BASE_URL, AUCTION_LISTING_ENDPOINT } from "../utils/constants";
import { USER_PROFILE_ENDPOINT } from "../utils/constants";
import { fetcher } from "./fetcher";
import { makeApiCall } from "./makeApiCall";

export async function getSingleProfile(username) {
  return makeApiCall({
    endpoint: USER_PROFILE_ENDPOINT + "/" + username,
    method: "GET",
    needsAuth: true,
    errorMessage: "Could not get profile.",
  });
}

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
