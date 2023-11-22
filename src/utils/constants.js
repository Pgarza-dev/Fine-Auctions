export const API_BASE_URL = "https://api.noroff.dev/api/v1";

export const USERNAME_MIN_LENGTH = 1;
export const PASSWORD_MIN_LENGTH = 8;
export const EMAIL_DOMAIN_WHITELIST = ["@noroff.no", "@stud.noroff.no"];
export const AUTH_FREE_PATHS = [
  "/login/",
  "/login",
  "/signup/",
  "/signup",
  "/unauthorized/",
  "/unauthorized",
];

export const REGISTER_ENDPOINT = "auction/auth/register";
export const LOGIN_ENDPOINT = "auction/auth/login";
export const PROFILES_ENDPOINT = "/social/profiles";
export const AUCTION_LISTING_ENDPOINT = "/auctions/listings";
