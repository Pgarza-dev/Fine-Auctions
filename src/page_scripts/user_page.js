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
import { formatHistoryTimeRemaining } from "../utils/formatBidTimeRemaining.js";

function handleLogout() {
  const logoutButton = document.querySelector("#loginBtn");
  if (logoutButton) {
    logoutButton.addEventListener("click", () => {
      clearActiveUser();
      clearAccessToken();
      window.location.href = "/index.html";
    });
  }
}

handleLogout();

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

async function displayUserProfile() {
  const profileInformationContainer = document.querySelector(
    "#profile_information_container",
  );

  if (!profileInformationContainer) {
    console.error("Profile Information container not found.");
    return;
  }

  profileInformationContainer.innerHTML = "";

  const profile = await getUserProfile();

  if (profile) {
    const infoContainer = document.createElement("div");

    const profileName = document.createElement("span");
    profileName.textContent = `${profile.name} :`;
    profileName.classList.add("pe-4");
    infoContainer.appendChild(profileName);

    const creditText = document.createElement("span");
    creditText.textContent = "Credits: ";
    creditText.classList.add("italic");
    infoContainer.appendChild(creditText);

    const totalCredits = document.createElement("span");
    totalCredits.textContent = profile.credits;
    infoContainer.appendChild(totalCredits);

    profileInformationContainer.appendChild(infoContainer);
  } else {
    const errorMessageElement = document.createElement("p");
    errorMessageElement.textContent = "Profile not found.";
    profileInformationContainer.appendChild(errorMessageElement);
  }
}

async function userPageCredits() {
  const creditsContainer = document.querySelector("#creditsContainer");
  creditsContainer.innerHTML = "";

  const credits = await getUserProfile();

  if (credits) {
    const totalCredits = document.createElement("span");
    totalCredits.textContent = `Credits: ${credits.credits}`;
    totalCredits.classList.add("text-orange-500", "font-bold", "text-md");
    creditsContainer.appendChild(totalCredits);
  } else {
    const errorMessageElement = document.createElement("p");
    errorMessageElement.textContent = "Credits not found.";
    creditsContainer.appendChild(errorMessageElement);
  }
}

async function getUserAvatar() {
  const userAvatarContainer = document.querySelector("#avatar_container");

  if (!userAvatarContainer) {
    console.error("Avatar container not found.");
    return;
  }

  userAvatarContainer.innerHTML = "";

  const profile = await getUserProfile();

  if (profile && profile.avatar) {
    const container = document.createElement("div");
    container.classList.add(
      "m-auto",
      "max-w-4xl",
      "p-8",
      "flex",
      "flex-col",
      "items-center",
    );

    const avatar = document.createElement("img");
    avatar.src = profile.avatar;
    avatar.alt = "user profile avatar";
    avatar.classList.add(
      "h-40",
      "w-40",
      "rounded-full",
      "object-fit",
      "contain",
      "border-4",
    );
    container.appendChild(avatar);

    const avatarName = document.createElement("p");
    avatarName.textContent = profile.name;
    avatarName.classList.add("text-2xl", "font-bold");
    container.appendChild(avatarName);

    userAvatarContainer.appendChild(container);
  } else {
    const errorMessageElement = document.createElement("p");
    errorMessageElement.textContent = "Avatar not found.";
    userAvatarContainer.appendChild(errorMessageElement);
  }
}

async function getBidHistory() {
  const username = getActiveUser();
  const url = `${API_BASE_URL}${USER_PROFILE_ENDPOINT}/${username}/bids?_listings=true`;
  try {
    const data = await fetcher({
      url,
      method: "GET",
      needsAuth: true,
    });
    console.log("Bid History:", data);
    return data;
  } catch (error) {
    console.error("Error fetching bid history:", error.message);
    return null;
  }
}

async function displayBidHistory() {
  const bidHistoryContainer = document.querySelector("#bid_history_container");
  bidHistoryContainer.classList.add("flex", "flex-col", "space-y-2");

  if (!bidHistoryContainer) {
    console.error("Bid History container not found.");
    return;
  }

  bidHistoryContainer.innerHTML = "";

  const bidHistory = await getBidHistory();

  if (bidHistory) {
    bidHistoryContainer.innerHTML = bidHistory
      .map((bid) => {
        const endsAt = new Date(bid.listing.endsAt).getTime();
        const currentTime = new Date().getTime();
        let timeRemaining = endsAt - currentTime;

        // Create a span element to dynamically update the time
        const timeRemainingDisplay = document.createElement("span");

        // Set up the interval for dynamic updating
        const intervalId = setInterval(() => {
          timeRemaining -= 1000;
          formatHistoryTimeRemaining(timeRemaining, (formattedTime) => {
            timeRemainingDisplay.textContent = formattedTime;
          });

          // Stop the interval when the auction ends
          if (timeRemaining < 0) {
            clearInterval(intervalId);
          }
        }, 1000);

        const timeLeftContainer = document.createElement("p");
        timeLeftContainer.classList.add(
          "mb-3",
          "font-normal",
          "text-primary-text",
          "dark:text-gray-400",
        );
        // timeLeftContainer = timeRemainingDisplay;
        timeLeftContainer.textContent = "Time Remaining: ";
        timeLeftContainer.appendChild(timeRemainingDisplay);

        return `
        <div class="flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row  hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
            <img class="object-cover w-full rounded-t-lg h-96 md:h-auto md:w-96 md:rounded-none md:rounded-s-lg" src="${
              bid.listing.media[0]
            }" alt="">
            <div class="flex flex-col justify-between p-4 leading-normal">
                <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">${
                  bid.listing.title
                }</h5>
                <p class="mb-2 text-sm font-normal text-gray-700 dark:text-gray-400">${
                  bid.listing.description
                }</p>
                <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">$${
                  bid.amount
                }</p>
                <p class="mb-3 font-normal text-primary-text dark:text-gray-400">
                ${formatHistoryTimeRemaining(timeRemaining)}
              </p>            </div>
        </div>
        `;
      })

      .join("");
  } else {
    const errorMessageElement = document.createElement("p");
    errorMessageElement.textContent = "Bid History not found.";
    bidHistoryContainer.appendChild(errorMessageElement);
  }
}

async function fetchDataAndDisplayUserProfile() {
  await displayUserProfile();
  await userPageCredits();
  await getUserAvatar();
  await getBidHistory();
  await displayBidHistory();
}

fetchDataAndDisplayUserProfile();
