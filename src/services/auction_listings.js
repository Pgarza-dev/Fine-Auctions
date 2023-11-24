function auctionListing() {
  console.log("auction Listing");
}
auctionListing();

import { API_BASE_URL } from "../utils/constants.js";
import { fetcher } from "./fetcher";
import { AUCTION_LISTING_ENDPOINT } from "../utils/constants";
import { makeApiCall } from "./makeApiCall";

async function getListings() {
  const url = `${API_BASE_URL}${AUCTION_LISTING_ENDPOINT}`;

  try {
    const data = await fetcher({
      url,
      method: "GET",
      needsAuth: true,
      // You can add more headers or parameters as needed
    });

    console.log("Listings:", data);
    return data;
  } catch (error) {
    console.error("Error fetching listings:", error.message);
    // You can handle the error here, for example, by returning a default value or showing a user-friendly message.
    return null;
  }
}

getListings();

async function displayListings(listings) {
  const auctionListings = document.querySelector("#auctions_listings");

  // Check if the element with ID 'auctions_listings' exists in the DOM
  if (!auctionListings) {
    console.error("Element with ID 'auctions_listings' not found in the DOM.");
    return;
  }

  // Clear existing content in the container
  auctionListings.innerHTML = "";

  if (listings && listings.length > 0) {
    // Iterate through the listings and create HTML elements to display them
    listings.forEach((listing) => {
      const listingContainer = document.createElement("div");
      listingContainer.innerHTML = `
        <a href="auction_item/index.html">
          <img
            class="auction-card object-cover"
            src="${listing.media[0]}"
            alt="${listing.title}"
          />
          <div class="pt-4 text-center">
            <h2 class="text-lg font-semibold text-zinc-700">${listing.title}</h2>
            <p class="text-xs">${listing._count.bids}</p>
            <p>${listing.description}</p>
          </div>
        </a>
      `;

      // Append the listing container to the container
      auctionListings.appendChild(listingContainer);
    });
  } else {
    // Handle the case when there are no listings to display
    const noListingsMessage = document.createElement("div");
    noListingsMessage.textContent = "No listings available.";
    auctionListings.appendChild(noListingsMessage);
  }
}

// Example usage:
// Assume 'getListings' returns an array of listings
async function fetchDataAndDisplayListings() {
  const listings = await getListings();
  displayListings(listings);
}

// Call the function to fetch and display listings
fetchDataAndDisplayListings();
