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

/**
 * Creates a new auction listing.
 * @async
 * @returns {Promise<Object>} The result of the auction listing creation.
 */
export async function createNewAuctionListing() {
  const mediaInput = document.getElementById("auctionItemImageUrl");
  const additionalImageInputs = document.querySelectorAll(
    "#imageContainer input[type=url]",
  );
  const title = document.getElementById("auctionItemTitle").value.trim();
  const description = document
    .getElementById("auctionItemDescription")
    .value.trim();
  const tags = document.getElementById("auctionItemTags").value.trim();
  const endsAt = document.getElementById("end_date");

  const media = [
    mediaInput.value,
    ...Array.from(additionalImageInputs).map((input) => input.value),
  ];

  const object = {
    title: title,
    description: description,
    tags: [tags],
    media: media,
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
};

/**
 * Validates the sell form data.
 * @param {Object} formDataObject - The form data object.
 * @param {string} formDataObject.title - The title of the auction listing.
 * @param {string} formDataObject.description - The description of the auction listing.
 * @param {string[]} formDataObject.tags - The tags of the auction listing.
 * @param {string} formDataObject.media - The media URL of the auction listing.
 * @param {string} formDataObject.endsAt - The end date of the auction listing.
 * @returns {Promise<Object>} - The validation result object.
 * @property {boolean} isValid - Indicates if the form data is valid or not.
 * @property {Object} errors - The validation errors, if any.
 */
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

/**
 * Handles the process of selling an item by creating a new auction listing.
 * @param {Object} formDataObject - The form data object containing the item details.
 * @returns {Promise<void>} - A promise that resolves when the auction listing is created.
 */
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

/**
 * Adds another image input field when the "Add Another Image" button is clicked.
 */
function addAnotherImage() {
  const addAnotherImageBtn = document.getElementById("add_another_image_btn");

  const clickHandler = () => {
    const anotherImageContainer = document.createElement("div");
    anotherImageContainer.classList.add("relative", "w-full");

    const anotherInput = document.createElement("input");
    anotherInput.setAttribute("type", "url");
    anotherInput.classList.add(
      "bg-primary-900",
      "peer",
      "h-10",
      "w-full",
      "max-w-lg",
      "border",
      "px-3",
      "py-2",
      "text-black",
      "focus:outline-none",
    );
    anotherInput.setAttribute("placeholder", "https://example.com/image.png");

    anotherImageContainer.appendChild(anotherInput);

    const imageContainer = document.getElementById("imageContainer");
    imageContainer.appendChild(anotherImageContainer);

    sellItemButton.disabled = false;
  };

  addAnotherImageBtn.removeEventListener("click", clickHandler);

  addAnotherImageBtn.addEventListener("click", clickHandler);
}

addAnotherImage();
