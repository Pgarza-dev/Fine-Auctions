import { API_BASE_URL, AUCTION_LISTING_ENDPOINT } from "../utils/constants.js";

const searchForm = document.querySelector("#search_form");
const searchInput = document.querySelector("#search_input");

searchForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const query = searchInput.value;

  const url = `${API_BASE_URL}${AUCTION_LISTING_ENDPOINT}?_seller=true&_bids=true&_active=true&q=${query}`;

  try {
    const data = await fetcher({
      url,
      method: "GET",
      needsAuth: false,
    });

    console.log("Search results:", data);

    displayListings(data);
  } catch (error) {
    console.error("Error fetching search results:", error.message);
  }
});
