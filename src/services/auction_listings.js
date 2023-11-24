import { API_BASE_URL } from "../utils/constants.js";
import { fetcher } from "./fetcher";
import { AUCTION_LISTING_ENDPOINT } from "../utils/constants";
import { formatTimeRemaining } from "../utils/formatBidTimeRemaining.js";
import { makeApiCall } from "./makeApiCall";

export async function getListings() {
  const url = `${API_BASE_URL}${AUCTION_LISTING_ENDPOINT}`;

  try {
    const data = await fetcher({
      url,
      method: "GET",
      needsAuth: false,
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

export async function displayListings(listings) {
  const auctionListings = document.querySelector("#auctions_listings");

  // Check if the element with ID 'auctions_listings' exists in the DOM
  if (!auctionListings) {
    console.error("Element with ID 'auctions_listings' not found in the DOM.");
    return;
  }

  // Clear existing content in the container
  auctionListings.innerHTML = "";

  // Check if there are listings to display
  if (listings && listings.length > 0) {
    // Iterate through the listings and create HTML elements to display them
    listings.forEach((listing) => {
      const listingContainer = document.createElement("div");
      listingContainer.classList.add("your-listing-container-class"); // Add your own styling class

      const link = document.createElement("a");
      link.href = "auction_item/index.html"; // Replace with your actual link
      listingContainer.appendChild(link);

      const img = document.createElement("img");
      img.classList.add("auction-card", "object-cover");
      img.src = listing.media[0];
      img.alt = listing.title;
      link.appendChild(img);

      const textContainer = document.createElement("div");
      textContainer.classList.add("pt-4", "text-center");
      link.appendChild(textContainer);

      const title = document.createElement("h2");
      title.classList.add("text-lg", "font-semibold", "text-zinc-700");
      title.textContent = listing.title;
      textContainer.appendChild(title);

      const price = document.createElement("p");
      price.classList.add("text-xs");
      price.textContent = formatPrice(listing._count.bids);
      textContainer.appendChild(price);

      const endsAt = new Date(listing.endsAt).getTime();
      const currentTime = new Date().getTime();
      const timeRemaining = endsAt - currentTime;

      const timeRemainingElement = document.createElement("p");
      timeRemainingElement.classList.add("text-sm");
      timeRemainingElement.textContent = `Time Left: ${formatTimeRemaining(
        timeRemaining,
      )}`;
      textContainer.appendChild(timeRemainingElement);

      const description = document.createElement("p");
      description.textContent = listing.description;
      textContainer.appendChild(description);

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

// Helper function to format the price (you can customize this based on your actual price structure)
export function formatPrice(bidsCount) {
  // Add your logic to format the price based on the number of bids or any other criteria
  return `$ ${bidsCount}`;
}

// Example usage:
// Assume 'getListings' returns an array of listings
export async function fetchDataAndDisplayListings() {
  const listings = await getListings();
  displayListings(listings);
}

// Call the function to fetch and display listings
fetchDataAndDisplayListings();
