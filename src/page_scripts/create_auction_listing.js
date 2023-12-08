import { getActiveUser } from "../utils/handleLocalStorageUser.js";
import { fetcher } from "../services/fetcher.js";
import { API_BASE_URL, AUCTION_LISTING_ENDPOINT } from "../utils/constants.js";




const imageInput = document.getElementById("auctionItemImageUrl");
const imagePreview = document.getElementById("auctionItemImagePreview");

imageInput.addEventListener("input", () => {
  imagePreview.src = imageInput.value;
});

export async function createNewAuctionListing() {
  const media = document.getElementById("auctionItemImageUrl");
  const title = document.getElementById("auctionItemTitle").value.trim();
  const description = document
    .getElementById("auctionItemDescription")
    .value.trim();
  const tags = document.getElementById("auctionItemTags").value.trim();
  const endsAt = document.getElementById("end_date");
  const username = getActiveUser();

  const object = {
    title: title,
    description: description,
    tags: [tags],
    media: [media.value],
    endsAt: endsAt.value,
  };

  console.log("object", object);
  const url = `${API_BASE_URL}${AUCTION_LISTING_ENDPOINT}`;

  try {
    const data = await fetcher({
      url,
      method: "POST",
      needsAuth: true,
      body: object,
    });

    console.log("Listings:", data);
  } catch (error) {
    console.error("Error fetching listings:", error.message);
    return null;
  }
}

const sellForm = document.querySelector("#sell-form");
sellForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const auctionUrl = document.querySelector("#auctionItemImageUrl");
  const auctionImagePreview = document.querySelector(
    "#auctionItemImagePreview",
  );

  if (auctionUrl.value) {
    auctionImagePreview.src = auctionUrl.value;
  } else {
    auctionImagePreview.src = "";
  }

  createNewAuctionListing();
});
