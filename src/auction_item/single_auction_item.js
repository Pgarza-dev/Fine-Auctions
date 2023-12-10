// Function to log
function log() {
  console.log("single_auction_item.js");
}
log();

import { API_BASE_URL } from "../utils/constants.js";
import { fetcher } from "../services/fetcher.js";
import { AUCTION_LISTING_ENDPOINT } from "../utils/constants";
import { formatTimeRemaining } from "../utils/formatBidTimeRemaining.js";
import { profileButton } from "../services/auction_listings.js";

export function getHighestBidAmount(bids) {
  if (bids.length > 0) {
    const highestBid = bids.slice().sort((a, b) => b.amount - a.amount)[0];
    return highestBid.amount;
  } else {
    return 0;
  }
}

function getItemQueryParams() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("id");
}

const auctionItemId = getItemQueryParams();

async function getSingleAuctionItem(auctionItemId) {
  const url = `${API_BASE_URL}${AUCTION_LISTING_ENDPOINT}/${auctionItemId}?_seller=true&_bids=true&_active=true`;

  try {
    const data = await fetcher({
      url,
      method: "GET",
      needsAuth: false,
    });

    console.log("Auction Item:", data);
    return data;
  } catch (error) {
    console.error("Error fetching auction item:", error.message);
    return null;
  }
}

async function postBidEntry(auctionItemId, bidAmount) {
  const url = `${API_BASE_URL}${AUCTION_LISTING_ENDPOINT}/${auctionItemId}/bids`;

  try {
    const response = await fetcher({
      url,
      method: "POST",
      needsAuth: true,
      body: {
        amount: Number(bidAmount),
      },
      error: (error) => {
        console.error("Error fetching auction item:", error.message);
        return null;
      },
    });

    console.log("Bid Entry:", response);
    return response;
  } catch (error) {
    console.error("Error bid was not made on item:", error.message);
    return null;
  }
}

const bidForm = document.getElementById("bid_form");

bidForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const bidNumberInput = document.getElementById("bidNumber");
  const currentBidAmount = document.getElementById("currentBidAmount");
  const bidButton = document.getElementById("sendBidBtn");

  try {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      throw new Error("You must be logged in to bid");
    }

    const bidAmount = parseInt(bidNumberInput.value, 10);
    if (isNaN(bidAmount) || bidAmount <= 0) {
      throw new Error(
        "Invalid bid amount. Please enter a valid number greater than 0.",
      );
    }

    const auctionItem = await getSingleAuctionItem(auctionItemId);
    const highestBidAmount = getHighestBidAmount(auctionItem.bids);

    if (bidAmount <= highestBidAmount) {
      throw new Error(
        "Bid amount must be greater than the current highest bid amount.",
      );
    }

    const bid = await postBidEntry(auctionItemId, bidAmount);

    currentBidAmount.textContent = formatPrice(bidAmount);
    bidButton.textContent = "Bid Placed!";
    bidButton.classList.add("bg-primary-button");

    // Provide user feedback
    console.log("Bid placed successfully:", bid);

    bidNumberInput.value = "";
  } catch (error) {
    console.error("Error placing bid:", error.message);
    alert(`Error placing bid: ${error.message}`);
  }
});

profileButton();

function displaySingleAuctionItem(auctionItem) {
  const auctionItemImage = document.getElementById("auctionItemImage");
  const auctionItemTitle = document.getElementById("auctionItemTitle");
  const auctionItemDescription = document.getElementById(
    "auctionItemDescription",
  );
  const currentBidAmount = document.getElementById("currentBidAmount");
  const timeLeft = document.getElementById("timeLeft");

  if (auctionItem) {
    auctionItemImage.src = auctionItem.media[0];
    auctionItemImage.alt = auctionItem.title;
    auctionItemTitle.textContent = auctionItem.title;
    auctionItemTitle.classList.add("text-4xl", "font-bold");
    auctionItemDescription.textContent = auctionItem.description;
    auctionItemDescription.classList.add("text-lg", "font-medium");
    currentBidAmount.textContent = formatPrice(
      getHighestBidAmount(auctionItem.bids),
    );
    currentBidAmount.classList.add("text-lg", "font-bold","pt-8", "pb-8");

    // Calculate time remaining
    const endsAt = new Date(auctionItem.endsAt).getTime();
    const currentTime = new Date().getTime();
    let timeRemaining = endsAt - currentTime;

    const timeRemainingDisplay = document.createElement("span");
    timeLeft.innerHTML = ""; // Clear existing content
    timeRemainingDisplay.classList.add("text-orange-500", "font-bold", "text-xl");

    timeLeft.appendChild(timeRemainingDisplay);

    formatTimeRemaining(timeRemaining, timeRemainingDisplay);

    const intervalId = setInterval(() => {
      timeRemaining -= 1000;
      formatTimeRemaining(timeRemaining, timeRemainingDisplay);

      if (timeRemaining < 0) {
        clearInterval(intervalId);
        timeLeft.textContent = "Auction ended";
      }
    }, 1000);
  } else {
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

function formatPrice(bidsCount) {
  // Add your logic to format the price based on the number of bids or any other criteria
  return `$ ${bidsCount}`;
}

async function fetchDataAndDisplaySingleAuctionItem() {
  const auctionItem = await getSingleAuctionItem(auctionItemId);
  displaySingleAuctionItem(auctionItem);
}

fetchDataAndDisplaySingleAuctionItem();

window.addEventListener("load", () => {
  fetchDataAndDisplaySingleAuctionItem();
});
