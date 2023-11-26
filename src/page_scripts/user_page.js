function userPage() {
  console.log("user_page.js");
}
userPage();

import { API_BASE_URL, USER_PROFILE_ENDPOINT } from "../utils/constants.js";
import { fetcher } from "../services/fetcher.js";
import {
  getActiveUser,
  setActiveUser,
} from "../utils/handleLocalStorageUser.js";
// import { getUsernameQueryParam } from "../utils/getUsernameQueryParam.js";
import { getSingleProfile } from "../services/profiles.js";

// function getUsernameQueryParam() {
//   const urlParams = new URLSearchParams(window.location.search);
//   const username = urlParams.get("username");
//   return username;
// }

async function getUserProfile() {
  const username = getActiveUser();
  const url = `${API_BASE_URL}${USER_PROFILE_ENDPOINT}/${username}`;
  try {
    const data = await fetcher({
      url,
      method: "GET",
      needsAuth: true,
    });
    console.log("User Profile:", data);
    return data;
  } catch (error) {
    console.error("Error fetching user profile:", error.message);
    return null;
  }
}

getUserProfile();

function displayUserProfile(profile) {
  const profileInformationContainer = document.querySelector(
    "#profile_information_container",
  );

  if (!profileInformationContainer) {
    console.error("Profile not found.");
    return;
  }

  profileInformationContainer.innerHTML = "";

  if (profile) {
    const infoContainer = document.createElement("div");
    infoContainer.classList.add(
      "border-spacing-4",
      "border",
      "pb-1",
      "pe-4",
      "ps-4",
      "pt-1",
      "text-white",
    );
    const profileName = document.createElement("span");
    profileName.textContent = profile.name + " :";
    profileName.classList.add("pe-4");
    profileInformationContainer.appendChild(profileName);
    const creditText = document.createElement("span");
    creditText.textContent = "Credits: ";
    creditText.classList.add("italic");
    profileInformationContainer.appendChild(creditText);
    // const profileAvatar = document.createElement("img");
    // profileAvatar.src = profile.avatar;
    // profileInformationContainer.appendChild(profileAvatar);
    const totalCredits = document.createElement("span");
    totalCredits.textContent = profile.credits;
    profileInformationContainer.appendChild(totalCredits);
  }
}

displayUserProfile();

async function fetchDataAndDisplayUserProfile() {
  const profile = await getUserProfile();
  displayUserProfile(profile);
}

fetchDataAndDisplayUserProfile();
