import { getActiveUser } from "../utils/handleLocalStorageUser.js";
import { getUsernameQueryParam } from "../utils/getUsernameQueryParam.js";
import { getSingleProfile } from "../services/profiles.js";

const profileName = document.querySelector("#profile_username");
const totalCredits = document.querySelector("#total_credits");
const profileAvatar = document.querySelector("#user_profile_avatar");
