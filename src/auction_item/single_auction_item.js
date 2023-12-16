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

    console.log("Bid placed successfully:", bid);

    bidNumberInput.value = "";
  } catch (error) {
    console.error("Error placing bid:", error.message);
    alert(`Error placing bid: ${error.message}`);
  }
});

profileButton();

function displaySingleAuctionItem(auctionItem) {
  const additionalImages = document.getElementById(
    "additional_images_container",
  );
  const auctionItemImage = document.getElementById("auctionItemImage");
  const auctionItemTitle = document.getElementById("auctionItemTitle");
  const auctionItemDescription = document.getElementById(
    "auctionItemDescription",
  );
  const currentBidAmount = document.getElementById("currentBidAmount");
  const timeLeft = document.getElementById("timeLeft");

  const bidHistoryList = document.getElementById("bidHistoryList");
  bidHistoryList.innerHTML = "";

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
    currentBidAmount.classList.add("text-lg", "font-bold", "pt-8", "pb-8");

    for (let i = 1; i < auctionItem.media.length; i++) {
      const additionalImage = document.createElement("img");
      additionalImage.classList.add(
        "w-32",
        "h-20",
        "sm:w-1/2",
        "md:w-1/3",
        "lg:w-1/4",
        "h-auto",
        "object-cover",
        "rounded-md",
        "border-2",
        "border-gray-200",
        "dark:border-gray-700",
        "cursor-pointer",
      );
      additionalImage.src = auctionItem.media[i];
      additionalImage.alt = auctionItem.title;
      additionalImages.appendChild(additionalImage);
    }

    additionalImages.addEventListener("click", (event) => {
      if (event.target.tagName === "IMG") {
        auctionItemImage.src = event.target.src;
        auctionItemImage.alt = event.target.alt;
      } else {
        return additionalImages;
      }
    });

    for (let i = 0; i < auctionItem.bids.length; i++) {
      const bidEntry = document.createElement("li");
      bidEntry.classList.add("mb-10", "ms-6");

      const biddingIcon = document.createElement("span");
      biddingIcon.classList.add(
        "absolute",
        "-start-3",
        "flex",
        "h-6",
        "w-6",
        "items-center",
        "justify-center",
        "rounded-full",
        "bg-blue-100",
        "ring-8",
        "ring-white",
        "dark:bg-blue-900",
        "dark:ring-gray-900",
      );

      const biddingIconSvg = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "svg",
      );
      biddingIconSvg.classList.add(
        "h-2.5",
        "w-2.5",
        "text-blue-800",
        "dark:text-blue-300",
      );
      biddingIconSvg.setAttribute("aria-hidden", "true");
      biddingIconSvg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
      biddingIconSvg.setAttribute("fill", "currentColor");
      biddingIconSvg.setAttribute("viewBox", "0 0 20 20");

      const biddingIconPath = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path",
      );
      biddingIconPath.setAttribute(
        "d",
        "M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z",
      );

      biddingIconSvg.appendChild(biddingIconPath);
      biddingIcon.appendChild(biddingIconSvg);

      bidEntry.appendChild(biddingIcon);

      const bidderName = document.createElement("h3");
      bidderName.classList.add(
        "mb-1",
        "flex",
        "items-center",
        "ps-3",
        "text-2xl",
        "font-semibold",
        "text-gray-900",
        "dark:text-white",
      );
      bidderName.textContent = auctionItem.bids[i].bidderName;

      const biddingDate = document.createElement("time");
      biddingDate.classList.add(
        "mb-2",
        "block",
        "ps-3",
        "text-sm",
        "font-normal",
        "leading-none",
        "text-black",
        "dark:text-gray-500",
      );
      biddingDate.textContent = new Date(
        auctionItem.bids[i].created,
      ).toLocaleString();

      const biddingAmount = document.createElement("p");
      biddingAmount.classList.add(
        "mb-4",
        "ps-3",
        "text-lg",
        "font-normal",
        "text-primary-text",
        "dark:text-gray-400",
        "font-extrabold",
      );
      biddingAmount.textContent = `Bid amount: ${formatPrice(
        auctionItem.bids[i].amount,
      )}`;

      bidEntry.appendChild(bidderName);
      bidEntry.appendChild(biddingDate);
      bidEntry.appendChild(biddingAmount);

      bidHistoryList.appendChild(bidEntry);
    }

    // Calculate time remaining
    const endsAt = new Date(auctionItem.endsAt).getTime();
    const currentTime = new Date().getTime();
    let timeRemaining = endsAt - currentTime;

    const timeRemainingDisplay = document.createElement("span");
    timeLeft.innerHTML = "";
    timeRemainingDisplay.classList.add(
      "text-primary-text",
      "font-bold",
      "text-xl",
    );

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
