import { API_BASE_URL, USER_PROFILE_ENDPOINT } from "../utils/constants.js";
import { fetcher } from "../services/fetcher.js";
import {
  getActiveUser,
  clearActiveUser,
  clearAccessToken,
} from "../utils/handleLocalStorageUser.js";
import { formatHistoryTimeRemaining } from "../utils/formatBidTimeRemaining.js";
import { createNewAuctionListing } from "../page_scripts/create_auction_listing.js";
import { createFormDataObject } from "../forms/utils.js";
import { makeApiCall } from "../services/makeApiCall.js";
import { clearErrors } from "../forms/handleErrors.js";

const avatarUrlInput = document.querySelector("#avatar_url_input");
const avatarForm = document.querySelector("#edit_avatar_form");
const sellForm = document.querySelector("#sell_form");
const username = getActiveUser();

/**
 * Handles the logout functionality.
 */
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

/**
 * Retrieves the user profile from the server.
 * @returns {Promise<Object|null>} The user profile data or null if an error occurred.
 */
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

/**
 * Edits the user's avatar by sending a PUT request to the server.
 * @param {string} avatarUrl - The URL of the new avatar image.
 * @returns {Promise<Object|null>} - A promise that resolves to the updated user profile data if successful, or null if there was an error.
 */
async function editUserAvatar(avatarUrl) {
  const username = getActiveUser();
  const url = `${API_BASE_URL}${USER_PROFILE_ENDPOINT}/${username}/media`;

  try {
    const data = await fetcher({
      url,
      method: "PUT",
      needsAuth: true,
      body: {
        avatar: avatarUrl,
      },
      errorMessage: "Could not update profile picture! Please try again.",
    });

    console.log("User Profile:", data);

    await handleEditedAvatar();

    return data;
  } catch (error) {
    console.error("Error updating user avatar:", error.message);
    return null;
  }
}

avatarForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const avatarUrl = avatarUrlInput.value.trim();

  if (avatarUrl) {
    const response = await editUserAvatar(avatarUrl);

    if (response.error) {
      console.error("Error updating avatar:", response.error);
    } else {
      window.location.href = "/user_page/index.html?username=" + response.name;
    }
  } else {
    console.error("Avatar URL is required.");
  }
});

/**
 * Handles the display of the edited avatar on the user page.
 * @returns {Promise<void>} A promise that resolves when the avatar is displayed.
 */
async function handleEditedAvatar() {
  const userAvatarContainer = document.querySelector("#avatar_container");

  if (!userAvatarContainer) {
    console.error("Avatar container not found.");
    return;
  }

  userAvatarContainer.innerHTML = "";

  const updatedProfile = await getUserProfile();

  if (updatedProfile && updatedProfile.avatar) {
    const container = document.createElement("div");
    container.classList.add(
      "m-auto",
      "max-w-4xl",
      "p-8",
      "flex",
      "flex-col",
      "items-center",
      "dark:bg-gray-800",
    );

    const avatar = document.createElement("img");
    avatar.src = updatedProfile.avatar;
    avatar.alt = "user profile avatar";
    avatar.classList.add(
      "h-56",
      "w-56",
      "rounded-full",
      "object-fit",
      "contain",
      "p-1",
      "drop-shadow-xl",
      "shadow-xl",
      "max-w-4xl",
    );
    container.appendChild(avatar);

    const avatarName = document.createElement("p");
    avatarName.textContent = updatedProfile.name;
    avatarName.classList.add("text-2xl", "font-medium");
    container.appendChild(avatarName);

    userAvatarContainer.appendChild(container);
  } else {
    const errorMessageElement = document.createElement("p");
    errorMessageElement.textContent = "Updated Avatar not found.";
    userAvatarContainer.appendChild(errorMessageElement);
  }
}

/**
 * Displays the user profile information on the page.
 * @returns {Promise<void>} A promise that resolves when the user profile is displayed.
 */
async function displayUserProfile() {
  const profileInformationContainer = document.querySelector(
    "#profile_information_container",
  );
  profileInformationContainer.classList.add("hidden", "md:inline-block");

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
    creditText.classList.add("animate-pulse");
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

/**
 * Fetches the user's credits and displays them on the user page.
 * @returns {Promise<void>} A promise that resolves when the credits are fetched and displayed.
 */
async function userPageCredits() {
  const creditsContainer = document.querySelector("#creditsContainer");
  creditsContainer.innerHTML = "";

  const credits = await getUserProfile();

  if (credits) {
    const totalCredits = document.createElement("span");
    totalCredits.textContent = `Credits: ${credits.credits}`;
    totalCredits.classList.add(
      "text-primary-background",
      "font-bold",
      "text-2xl",
      "sm:text-normal",
    );
    creditsContainer.appendChild(totalCredits);
  } else {
    const errorMessageElement = document.createElement("p");
    errorMessageElement.textContent = "Credits not found.";
    creditsContainer.appendChild(errorMessageElement);
  }
}

/**
 * Retrieves the user's avatar and displays it on the page.
 * If the avatar is not found, an error message is displayed.
 * @returns {Promise<void>} A promise that resolves when the avatar is retrieved and displayed.
 */
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

      "dark:bg-gray-800",
    );

    const avatar = document.createElement("img");
    avatar.src = profile.avatar;
    avatar.alt = "user profile avatar";
    avatar.classList.add(
      "h-56",
      "w-56",
      "rounded-full",
      "object-fit",
      "contain",
      "p-1",
      "drop-shadow-xl",
      "shadow-xl",
      "max-w-4xl",
    );
    container.appendChild(avatar);

    const avatarName = document.createElement("p");
    avatarName.textContent = profile.name;
    avatarName.classList.add("text-2xl", "font-medium");
    container.appendChild(avatarName);

    userAvatarContainer.appendChild(container);
  } else {
    const errorMessageElement = document.createElement("p");
    errorMessageElement.textContent = "Avatar not found.";
    userAvatarContainer.appendChild(errorMessageElement);
  }
}

/**
 * Retrieves the bid history for the active user.
 * @returns {Promise<any>} The bid history data.
 */
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

/**
 * Displays the bid history on the user page.
 * @returns {Promise<void>} A promise that resolves when the bid history is displayed.
 */
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

        const timeRemainingDisplay = document.createElement("span");

        const intervalId = setInterval(() => {
          timeRemaining -= 1000;
          formatHistoryTimeRemaining(timeRemaining, (formattedTime) => {
            timeRemainingDisplay.textContent = formattedTime;
          });

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

        <section>
        <div class="flex flex-col items-center bg-white bg-opacity-50 border border-gray-200 rounded-lg shadow md:flex-row hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
          <div
            class="relative w-full overflow-hidden rounded-lg"
          >
            <img
              class="my-bids-images object-cover object-center"
              src="${bid.listing.media[0]}" alt="">
            
          </div>
          <div class="flex flex-col flex-wrap justify-between p-4 leading-normal sm:w-40 md:w-full whitespace-normal">
    <h5 class="mb-2  sm:text-lg md:text-2xl font-bold tracking-tight text-gray-900 dark:text-white">${
      bid.listing.title
    }</h5>
    <p class="mb-2 text-lg sm:text-sm md:text-lg font-normal text-gray-700 dark:text-gray-400">${
      bid.listing.description
    }</p>
    <p class="mb-3 text-lg sm:text-sm md:text-lg font-normal text-gray-700 dark:text-gray-400">$${
      bid.amount
    }</p>
    <p class="mb-3 text-lg sm:text-sm md:text-lg font-normal text-primary-text dark:text-gray-400">${formatHistoryTimeRemaining(
      timeRemaining,
    )}</p>
  </div>
        </div>
      </section> `;
      })

      .join("");
  } else {
    const errorMessageElement = document.createElement("p");
    errorMessageElement.textContent = "Bid History not found.";
    bidHistoryContainer.appendChild(errorMessageElement);
  }
}

/**
 * Fetches user data and displays the user profile.
 * @returns {Promise<void>} A promise that resolves when the user profile is displayed.
 */
async function fetchDataAndDisplayUserProfile() {
  await displayUserProfile();
  await userPageCredits();
  await getUserAvatar();
  await getBidHistory();
  await displayBidHistory();
}

fetchDataAndDisplayUserProfile();
