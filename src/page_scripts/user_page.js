function userPage() {
  console.log("user_page.js");
}
userPage();

import { API_BASE_URL, USER_PROFILE_ENDPOINT } from "../utils/constants.js";
import { fetcher } from "../services/fetcher.js";
import {
  getActiveUser,
  clearActiveUser,
  clearAccessToken,
} from "../utils/handleLocalStorageUser.js";
import { getUsernameQueryParam } from "../utils/getUsernameQueryParam.js";
import { getSingleProfile } from "../services/profiles.js";

// function getUsernameQueryParam() {
//   const urlParams = new URLSearchParams(window.location.search);
//   const username = urlParams.get("username");
//   return username;
// }

document.addEventListener("DOMContentLoaded", () => {
  const logoutButton = document.querySelector("#signOutBtn");

  if (logoutButton) {
    logoutButton.addEventListener("click", () => {
      clearActiveUser();
      clearAccessToken();
      window.location.href = "/index.html";
    });
  }
});

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

async function displayUserProfile(profile) {
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
  } else {
    const errorMessageElement = document.createElement("p");
    errorMessageElement.textContent = "Profile not found.";
    profileInformationContainer.appendChild(errorMessageElement);
  }
}

displayUserProfile();

async function userPageCredits() {
  const credits = await getUserProfile();
  const profileCredits = document.querySelector("#creditsContainer");
  profileCredits.innerHTML = "";
  if (credits) {
    const totalCredits = document.createElement("span");
    totalCredits.textContent = "Credits: " + credits.credits;
    profileCredits.appendChild(totalCredits);
  } else {
    const errorMessageElement = document.createElement("p");
    errorMessageElement.textContent = "Credits not found.";
    profileCredits.appendChild(errorMessageElement);
  }
}

userPageCredits();

// async function getUserAvatar(profileAvatar) {
//   const userAvatarContainer = document.querySelector("#avatar_container");
//   userAvatarContainer.innerHTML = "";
//   if (profileAvatar) {
//     const profileAvatar = document.createElement("img");
//     profileAvatar.src = profileAvatar.avatar;
//     userAvatarContainer.appendChild(profileAvatar);
//   }
// }
// getUserAvatar();

async function getUserAvatar(profileAvatar) {
  const userAvatarContainer = document.querySelector("#avatar_container");

  if (!userAvatarContainer) {
    console.error("Avatar container not found.");
    return;
  }

  userAvatarContainer.innerHTML = "";

  if (profileAvatar && profileAvatar.avatar) {
    const container = document.createElement("div");
    container.classList.add("m-auto", "max-w-4xl", "p-8");

    const avatar = document.createElement("img");
    avatar.src = profileAvatar.avatar;
    avatar.alt = "user profile avatar";
    avatar.classList.add("user_profile_avatar");
    container.appendChild(avatar);

    // Append the container to the avatar container in the HTML
    userAvatarContainer.appendChild(container);
  } else {
    // Handle the case where the profile avatar is not provided
    const errorMessageElement = document.createElement("p");
    errorMessageElement.textContent = "Avatar not found.";
    userAvatarContainer.appendChild(errorMessageElement);
  }
}

getUserAvatar();

async function fetchDataAndDisplayUserProfile() {
  const profile = await getUserProfile();
  const credits = await getUserProfile();
  displayUserProfile(profile);
  userPageCredits(credits);
}

fetchDataAndDisplayUserProfile();
