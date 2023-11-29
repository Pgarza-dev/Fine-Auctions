import { API_BASE_URL } from "../utils/constants.js";
import { fetcher } from "./fetcher";
import { AUCTION_LISTING_ENDPOINT } from "../utils/constants";
import { formatTimeRemaining } from "../utils/formatBidTimeRemaining.js";
import { getActiveUser } from "../utils/handleLocalStorageUser.js";
import { makeApiCall } from "./makeApiCall";
import { doc } from "prettier";

const checkIfUserIsLoggedIn = document.querySelector("#loginBtn");

if (checkIfUserIsLoggedIn) {
}

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

// export async function displayListings(listings) {
//   const auctionListings = document.querySelector("#auctions_listings");

//   // Check if the element with ID 'auctions_listings' exists in the DOM
//   if (!auctionListings) {
//     console.error("Element with ID 'auctions_listings' not found in the DOM.");
//     return;
//   }

//   // Clear existing content in the container
//   auctionListings.innerHTML = "";

//   // Check if there are listings to display
//   if (listings && listings.length > 0) {
//     // Iterate through the listings and create HTML elements to display them
//     listings.forEach((listing) => {
//       const listingContainer = document.createElement("div");
//       listingContainer.classList.add(
//         "max-w-sm",
//         "bg-white",
//         "border",
//         "border-gray-200",
//         "rounded-lg",
//         "shadow,",
//         "dark:bg-gray-800",
//         "dark:border-gray-700",
//       );

//       const link = document.createElement("a");
//       link.href = "auction_item/index.html?id=" + listing.id;
//       listingContainer.appendChild(link);
//       console.log(listing.id);

//       const img = document.createElement("img");
//       img.classList.add("rounded-t-lg");
//       img.src = listing.media[0];
//       img.alt = listing.title;
//       link.appendChild(img);

//       const textContainer = document.createElement("div");
//       textContainer.classList.add("pt-5");
//       link.appendChild(textContainer);

//       const title = document.createElement("h5");
//       title.classList.add(
//         "mb-3",
//         "font-normal",
//         "text-gray-700",
//         "dark:text-gray-400",
//       );
//       title.textContent = listing.title;
//       textContainer.appendChild(title);

//       const price = document.createElement("p");
//       price.classList.add(
//         "mb-3",
//         "font-normal",
//         "text-gray-700",
//         "dark:text-gray-400",
//       );
//       price.textContent = formatPrice(listing._count.bids);
//       textContainer.appendChild(price);

//       const endsAt = new Date(listing.endsAt).getTime();
//       const currentTime = new Date().getTime();
//       const timeRemaining = endsAt - currentTime;

//       const timeRemainingElement = document.createElement("p");
//       timeRemainingElement.classList.add(
//         "mb-3",
//         "font-normal",
//         "text-gray-700",
//         "dark:text-gray-400",
//       );
//       timeRemainingElement.textContent = `Time Left: ${formatTimeRemaining(
//         timeRemaining,
//       )}`;
//       textContainer.appendChild(timeRemainingElement);

//       const description = document.createElement("p");
//       description.textContent = listing.description;
//       textContainer.appendChild(description);

//       // Append the listing container to the container
//       auctionListings.appendChild(listingContainer);
//     });
//   } else {
//     // Handle the case when there are no listings to display
//     const noListingsMessage = document.createElement("div");
//     noListingsMessage.textContent = "No listings available.";
//     auctionListings.appendChild(noListingsMessage);
//   }
// }

export async function displayListings(listings) {
  const auctionListings = document.querySelector("#auctions_listings");

  // Check if the element with ID 'auctions_listings' exists in the DOM
  if (!auctionListings) {
    console.error("Element with ID 'auctions_listings' not found in the DOM.");
    return;
  }

  auctionListings.innerHTML = "";

  // Filter out listings with no images
  const listingsWithImages = listings.filter(
    (listing) => listing.media && listing.media.length > 0,
  );

  const activeListings = listingsWithImages.filter((listing) => {
    const endsAt = new Date(listing.endsAt).getTime();
    const currentTime = new Date().getTime();
    return endsAt > currentTime;
  });

  // Check if there are listings with images to display
  if (activeListings.length > 0) {
    // Iterate through the listings with images and create HTML elements to display them
    activeListings.forEach((listing) => {
      const listingContainer = document.createElement("div");
      listingContainer.classList.add(
        "max-w-sm",
        "bg-white",
        "border",
        "border-gray-200",
        "rounded-lg",
        "drop-shadow-lg",
        "hover:drop-shadow-md",
        "dark:bg-gray-800",
        "dark:border-gray-700",
        "dark:drop-shadow-none",
      );

      const link = document.createElement("a");
      link.href = "auction_item/index.html?id=" + listing.id;
      listingContainer.appendChild(link);

      const img = document.createElement("img");
      img.classList.add("rounded-t-lg");
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
      price.textContent = formatPrice(listing._count.bids);
      textContainer.appendChild(price);

      const timeRemainingElement = document.createElement("p");
      timeRemainingElement.classList.add(
        "mb-3",
        "font-normal",
        "text-orange-500",
        "dark:text-gray-400",
      );
      textContainer.appendChild(timeRemainingElement);

      // Store the reference to the timeRemainingElement in a variable
      const timeRemainingDisplay = document.createElement("span");
      timeRemainingElement.appendChild(timeRemainingDisplay);

      const endsAt = new Date(listing.endsAt).getTime();
      const currentTime = new Date().getTime();
      let timeRemaining = endsAt - currentTime;

      // Update the time dynamically
      formatTimeRemaining(timeRemaining, timeRemainingDisplay);

      // Set up the interval for dynamic updating
      const intervalId = setInterval(() => {
        timeRemaining -= 1000;
        formatTimeRemaining(timeRemaining, timeRemainingDisplay);

        // Stop the interval when the auction ends
        if (timeRemaining < 0) {
          clearInterval(intervalId);
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

      // Append the listing container to the container
      auctionListings.appendChild(listingContainer);
    });
  } else {
    // Handle the case when there are no active listings with images to display
    const noListingsMessage = document.createElement("div");
    noListingsMessage.textContent = "No active listings with images available.";
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
