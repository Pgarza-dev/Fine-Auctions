import { API_BASE_URL } from "../utils/constants.js";
import { fetcher } from "./fetcher";
import { AUCTION_LISTING_ENDPOINT } from "../utils/constants";
import { formatTimeRemaining } from "../utils/formatBidTimeRemaining.js";
import { getActiveUser } from "../utils/handleLocalStorageUser.js";

export async function getListings() {
  const url = `${API_BASE_URL}${AUCTION_LISTING_ENDPOINT}?_seller=true&_bids=true&_active=true`;

  try {
    const data = await fetcher({
      url,
      method: "GET",
      needsAuth: false,
    });

    console.log("Listings:", data);
    displayListings(data);
  } catch (error) {
    console.error("Error fetching listings:", error.message);
    return null;
  }
}

async function setupAllListingsButton() {
  const allListingsButton = document.querySelector("#all_listings_btn");

  allListingsButton.addEventListener("click", async () => {
    await getListings();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  setupAllListingsButton();

  const allListingsButton = document.querySelector("#all_listings_btn");
  allListingsButton.click();
});

/**
 * Sets up the profile button by assigning the correct href attribute and click event.
 * If the active user is available, it redirects to the user's profile page.
 * If the active user is not available, it redirects to the login page.
 *
 * @function
 * @name profileButton
 * @returns {void}
 */
export function profileButton() {
  const username = getActiveUser();
  const profileBtn = document.querySelector("#profileLink");
  profileBtn.href = `/user_page/index.html?username=${username}`;
  if (username) {
    profileBtn.addEventListener("click", () => {
      window.location.href = `/user_page/index.html?username=${username}`;
    });
  } else {
    console.log("profileBtn not found");
    profileBtn.href = "/login/index.html";
  }
}

profileButton();

async function ascendingButton() {
  const sortByAscendingButton = document.querySelector("#newest_btn");
  sortByAscendingButton.addEventListener("click", async () => {
    const sortField = "created";
    const sortOrder = "asc";
    const limit = 100;
    const offset = 0;

    const url = `${API_BASE_URL}${AUCTION_LISTING_ENDPOINT}?sort=${sortField}&sortOrder=${sortOrder}&limit=${limit}&offset=${offset}?_seller=true&_bids=true&_active=true`;

    try {
      const data = await fetcher({
        url,
        method: "GET",
        needsAuth: false,
      });

      console.log("Sorted Listings (Ascending):", data);

      displayListings(data);
    } catch (error) {
      console.error("Error fetching sorted listings:", error.message);
    }
  });
}

ascendingButton();

async function oldestListingsButton() {
  const sortByDescendingButton = document.querySelector("#oldest_btn");
  sortByDescendingButton.addEventListener("click", async () => {
    const sortField = "created";
    const sortOrder = "desc";
    const limit = 100;
    const offset = 0;

    const url = `${API_BASE_URL}${AUCTION_LISTING_ENDPOINT}?sort=${sortField}&sortOrder=${sortOrder}&limit=${limit}&offset=${offset}?_seller=true&_bids=true&_active=true`;

    try {
      const data = await fetcher({
        url,
        method: "GET",
        needsAuth: false,
      });

      console.log("Sorted Listings (Descending):", data);

      displayListings(data);
    } catch (error) {
      console.error("Error fetching sorted listings:", error.message);
    }
  });
}

oldestListingsButton();

export function getHighestBidAmount(bids) {
  if (bids.length > 0) {
    const highestBid = bids.slice().sort((a, b) => b.amount - a.amount)[0];
    return highestBid.amount;
  } else {
    return 0; // or any default value for when there are no bids
  }
}

export async function displayListings(listings) {
  const auctionListings = document.querySelector("#auctions_listings");

  if (!auctionListings) {
    console.error("Element with ID 'auctions_listings' not found in the DOM.");
    return;
  }

  auctionListings.innerHTML = "";

  const currentTime = new Date().getTime();

  // Check if the provided data is sorted
  const isSorted = listings.some((listing, index) => {
    if (index > 0) {
      const previousEndsAt = new Date(listings[index - 1].endsAt).getTime();
      const currentEndsAt = new Date(listing.endsAt).getTime();
      return previousEndsAt > currentEndsAt;
    }
    return false;
  });

  const processedListings = isSorted
    ? listings // Use the sorted data as is
    : listings
        .map((listing) => {
          if (listing.media && listing.media.length > 0) {
            return listing;
          } else {
            return {
              ...listing,
              media: [
                "/images/abstract-eye-portrait-young-women-elegance-generated-by-ai.jpg",
              ],
            };
          }
        })
        .filter((listing) => {
          const endsAt = new Date(listing.endsAt).getTime();
          return endsAt > currentTime;
        });

  if (processedListings.length > 0) {
    processedListings.forEach((listing) => {
      const listingContainer = document.createElement("div");
      listingContainer.classList.add(
        "max-w-sm",
        "bg-white",
        "bg-opacity-50",
        "border",
        "border-gray-200",
        "rounded-lg",
        "drop-shadow-lg",
        "hover:drop-shadow-md",
        "dark:bg-gray-800",
        "dark:border-gray-700",
        "dark:drop-shadow-none",
        "w-full",
        "h-full",
        "hover:scale-105",
      );

      const link = document.createElement("a");
      link.href = "auction_item/index.html?id=" + listing.id;
      listingContainer.appendChild(link);

      const img = document.createElement("img");
      img.classList.add("rounded-t-lg", "w-full", "h-56", "object-cover");
      img.src = listing.media[0];
      img.alt = listing.title;
      link.appendChild(img);

      const textContainer = document.createElement("div");
      textContainer.classList.add("p-5");
      link.appendChild(textContainer);

      const titleLink = document.createElement("a");
      titleLink.href = "auction_item/index.html?id=" + listing.id;
      textContainer.appendChild(titleLink);

      const title = document.createElement("h5");
      title.classList.add(
        "mb-2",
        "text-2xl",
        "font-bold",
        "tracking-tight",
        "text-gray-900",
        "dark:text-white",
        "max-w-sm",
        "truncate",
        "max-w-full",
      );
      title.textContent = listing.title;
      titleLink.appendChild(title);

      const description = document.createElement("p");
      description.classList.add(
        "mb-3",
        "font-normal",
        "text-gray-700",
        "dark:text-gray-400",
      );
      description.textContent = listing.description;
      textContainer.appendChild(description);

      const price = document.createElement("p");
      price.classList.add(
        "mb-2",
        "text-lg",
        "font-normal",
        "tracking-tight",
        "text-gray-700",
        "dark:gray-400",
      );
      price.textContent = formatPrice(getHighestBidAmount(listing.bids));
      textContainer.appendChild(price);

      const timeRemainingElement = document.createElement("p");
      timeRemainingElement.classList.add(
        "mb-3",
        "font-normal",
        "text-orange-500",
        "dark:text-gray-400",
      );
      timeRemainingElement.textContent = "Ends in: ";
      textContainer.appendChild(timeRemainingElement);

      const timeRemainingDisplay = document.createElement("span");
      timeRemainingElement.appendChild(timeRemainingDisplay);

      const endsAt = new Date(listing.endsAt).getTime();
      const currentTime = new Date().getTime();
      let timeRemaining = endsAt - currentTime;

      formatTimeRemaining(timeRemaining, timeRemainingDisplay);

      const intervalId = setInterval(() => {
        timeRemaining -= 1000;
        formatTimeRemaining(timeRemaining, timeRemainingDisplay);

        if (timeRemaining < 0) {
          clearInterval(intervalId);
          timeRemainingElement.textContent = "Auction ended";
        }
      }, 1000);

      const readMoreLink = document.createElement("a");
      readMoreLink.href = "auction_item/index.html?id=" + listing.id;
      readMoreLink.classList.add(
        "inline-flex",
        "items-center",
        "px-3",
        "py-2",
        "text-sm",
        "font-medium",
        "text-center",
        "text-white",
        "bg-primary-button",
        "rounded-lg",
        "hover:bg-red-800",
        "focus:ring-2",
        "focus:outline-none",
        "dark:bg-primary-button",
        "dark:hover:red-700",
        "dark:focus:ring-red-900",
      );
      textContainer.appendChild(readMoreLink);

      const readMoreText = document.createTextNode("Read more");
      readMoreLink.appendChild(readMoreText);

      const arrowSvg = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "svg",
      );
      arrowSvg.classList.add("rtl:rotate-180", "w-3.5", "h-3.5", "ms-2");
      arrowSvg.setAttribute("aria-hidden", "true");
      arrowSvg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
      arrowSvg.setAttribute("fill", "none");
      arrowSvg.setAttribute("viewBox", "0 0 14 10");
      readMoreLink.appendChild(arrowSvg);

      const arrowPath = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path",
      );
      arrowPath.setAttribute("stroke", "currentColor");
      arrowPath.setAttribute("stroke-linecap", "round");
      arrowPath.setAttribute("stroke-linejoin", "round");
      arrowPath.setAttribute("stroke-width", "2");
      arrowPath.setAttribute("d", "M1 5h12m0 0L9 1m4 4L9 9");
      arrowSvg.appendChild(arrowPath);

      auctionListings.appendChild(listingContainer);
    });
  } else {
    const noListingsMessage = document.createElement("div");
    noListingsMessage.textContent = "No active listings with images available.";
    auctionListings.appendChild(noListingsMessage);
  }
}

export function formatPrice(bidsCount) {
  return `Price ${bidsCount}`;
}

export async function fetchDataAndDisplayListings() {
  const listings = await getListings();
  displayListings(listings);
}

fetchDataAndDisplayListings();
