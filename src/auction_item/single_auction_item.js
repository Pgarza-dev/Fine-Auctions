// Function to log
function log() {
  console.log("single_auction_item.js");
}
log();

// Importing necessary constants and functions
import { API_BASE_URL } from "../utils/constants.js";
import { fetcher } from "../services/fetcher.js";
import { AUCTION_LISTING_ENDPOINT } from "../utils/constants";
import { formatTimeRemaining } from "../utils/formatBidTimeRemaining.js";
import { getActiveUser } from "../utils/handleLocalStorageUser.js";
import { profileButton } from "../services/auction_listings.js";
// import { getAccessToken } from "../utils/handleLocalStorageUser.js";

// Function to get the auction item ID from URL parameters
function getItemQueryParams() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("id");
}

// Get the auction item ID
const auctionItemId = getItemQueryParams();

// Function to fetch a single auction item
async function getSingleAuctionItem(auctionItemId) {
  const url = `${API_BASE_URL}${AUCTION_LISTING_ENDPOINT}/${auctionItemId}`;

  try {
    const data = await fetcher({
      url,
      method: "GET",
      needsAuth: false,
      // You can add more headers or parameters as needed
    });

    console.log("Auction Item:", data);
    return data;
  } catch (error) {
    console.error("Error fetching auction item:", error.message);
    // You can handle the error here, for example, by returning a default value or showing a user-friendly message.
    return null;
  }
}


profileButton();

function displaySingleAuctionItem(auctionItem) {
  // Update HTML elements with fetched auction item details
  const auctionItemImage = document.getElementById("auctionItemImage");
  const auctionItemTitle = document.getElementById("auctionItemTitle");
  const auctionItemDescription = document.getElementById(
    "auctionItemDescription",
  );
  const currentBidAmount = document.getElementById("currentBidAmount");
  const timeLeft = document.getElementById("timeLeft");

  if (auctionItem) {
    auctionItemImage.src = auctionItem.media[0];
    auctionItemTitle.textContent = auctionItem.title;
    auctionItemDescription.textContent = auctionItem.description;
    currentBidAmount.textContent = formatPrice(auctionItem._count.bids);

    // Calculate time remaining
    const endsAt = new Date(auctionItem.endsAt).getTime();
    const currentTime = new Date().getTime();
    let timeRemaining = endsAt - currentTime;

    // Create a span element to dynamically update the time
    const timeRemainingDisplay = document.createElement("span");
    timeLeft.innerHTML = ""; // Clear existing content
    timeRemainingDisplay.classList.add("text-orange-500");

    timeLeft.appendChild(timeRemainingDisplay);

    // Update the time dynamically
    formatTimeRemaining(timeRemaining, timeRemainingDisplay);

    // Set up the interval for dynamic updating
    const intervalId = setInterval(() => {
      timeRemaining -= 1000;
      formatTimeRemaining(timeRemaining, timeRemainingDisplay);

      // Stop the interval when the auction ends
      if (timeRemaining < 0) {
        clearInterval(intervalId);
        timeLeft.textContent = "Auction ended";
      }
    }, 1000);

    // ... Update other elements based on your data structure
  } else {
    // Handle the case when the auction item is not available
    const errorMessageElement = document.createElement("p");
    errorMessageElement.textContent = "Auction item not found.";
    auction_item_container.appendChild(errorMessageElement);
  }
}

export function checkIfUserIsLoggedIn() {
  const accessToken = localStorage.getItem("accessToken");
  const toolTip = document.getElementById("tooltip-default");
  if (accessToken) {
    toolTip.classList.add("hidden");
    console.log("User is logged in");
  } else {
    toolTip.classList.remove("hidden");
  }
}

checkIfUserIsLoggedIn();

function changeLogInBtn() {
  const loginBtn = document.getElementById("loginBtn");
  const accessToken = localStorage.getItem("accessToken");
  if (accessToken) {
    loginBtn.textContent = "Log Out";
    loginBtn.addEventListener("click", () => {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("activeUser");
      loginBtn.textContent = "Log In";
    });
  } else {
    loginBtn.textContent = "Log In";
  }
}

changeLogInBtn();

// Helper function to format the price (you can customize this based on your actual price structure)
function formatPrice(bidsCount) {
  // Add your logic to format the price based on the number of bids or any other criteria
  return `$ ${bidsCount}`;
}

// Fetch and display the single auction item
async function fetchDataAndDisplaySingleAuctionItem() {
  const auctionItem = await getSingleAuctionItem(auctionItemId);
  displaySingleAuctionItem(auctionItem);
}

// Call the function to fetch and display the single auction item
fetchDataAndDisplaySingleAuctionItem();

// Wrap your code in a window load event listener
window.addEventListener("load", () => {
  // Fetch and display the single auction item
  fetchDataAndDisplaySingleAuctionItem();
});
