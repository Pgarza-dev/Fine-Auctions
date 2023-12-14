import { getActiveUser } from "../utils/handleLocalStorageUser.js";
import { fetcher } from "../services/fetcher.js";
import { API_BASE_URL, AUCTION_LISTING_ENDPOINT } from "../utils/constants.js";
import { clearErrors, displayErrors } from "../forms/handleErrors.js";
import { createFormDataObject } from "../forms/utils.js";

const imageInput = document.getElementById("auctionItemImageUrl");
const imagePreview = document.getElementById("auctionItemImagePreview");
const sellItemButton = document.getElementById("sell_auction_item_btn");

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

    if (data.error) {
      console.error("Error fetching listings:", data.error);
    } else {
      console.log("Listings:", data);
      console.log(new Error().stack);

      document.getElementById("auctionItemTitle").value = "";
      document.getElementById("auctionItemDescription").value = "";
      document.getElementById("auctionItemTags").value = "";
      document.getElementById("auctionItemImageUrl").value = "";
      document.getElementById("end_date").value = "";
      document.getElementById("auctionItemImagePreview").src = "";

      sellItemButton.textContent = "Auction Posted!";
    }
  } catch (error) {
    console.error("Error fetching listings:", error.message);
    return {
      error: null,
      ...data,
    };
  }
}
console.log("createNewAuctionListing", createNewAuctionListing);
console.log(new Error().stack);



async function checkSellForm(formDataObject) {
  const { title, description, tags, media, endsAt } = formDataObject;

  const validationResult = {
    isValid: true,
    errors: {},
  };

  if (!title) {
    validationResult.isValid = false;
    validationResult.errors.title = "Please enter a title.";
  }

  if (!description) {
    validationResult.isValid = false;
    validationResult.errors.description = "Please enter a description.";
  }

  if (!tags) {
    validationResult.isValid = false;
    validationResult.errors.tags = "Please enter at least one tag.";
  }

  if (!media) {
    validationResult.isValid = false;
    validationResult.errors.media = "Please enter a media url.";
  }

  if (!endsAt) {
    validationResult.isValid = false;
    validationResult.errors.endsAt = "Please enter an end date.";
  }

  return validationResult;
}

async function handleSellItem(formDataObject) {
  const response = await createNewAuctionListing(formDataObject);

  if (response && response.error) {
    handleFormApiError([response.error]);
  }
}


const sellForm = document.querySelector("#sell-form");

let isFormSubmitting = false;

sellForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (isFormSubmitting) {
    return;
  }

  isFormSubmitting = true;

  clearErrors();

  const form = createFormDataObject(sellForm);

  const sellValidationResult = await checkSellForm(form);

  if (!sellValidationResult.isValid) {
    await handleSellItem(form);
  } else {
    displayErrors(sellValidationResult.errors);
  }

  const auctionUrl = document.querySelector("#auctionItemImageUrl");
  const auctionImagePreview = document.querySelector(
    "#auctionItemImagePreview",
  );

  if (auctionUrl.value) {
    auctionImagePreview.src = auctionUrl.value;
  } else {
    auctionImagePreview.src = "";
  }

  isFormSubmitting = false;
  sellItemButton.disabled = false;
});
