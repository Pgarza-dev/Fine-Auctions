import { handleAuth } from "./auth/handleAuth";
import "./styles/main.css";

handleAuth();

export function checkIfUserIsLoggedIn() {
  const accessToken = localStorage.getItem("accessToken");
  const logInButton = document.getElementById("loginBtn");
  if (accessToken) {
    console.log("User is logged in");
    logInButton.textContent = "Log Out";
    logInButton.addEventListener("click", () => {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("activeUser");
      logInButton.textContent = "Log In";
    });
  } else {
    console.log("User is not logged in");
    logInButton.textContent = "Log In";
  }
}

checkIfUserIsLoggedIn();

document.addEventListener("DOMContentLoaded", function () {
  animateText("animatedText");
});

function animateText(elementId) {
  const textElement = document.getElementById(elementId);

  if (!textElement) {
    console.error(`Element with ID '${elementId}' not found.`);
    return;
  }

  const words = textElement.innerText.split(" ");
  textElement.innerHTML = "";

  words.forEach((word, index) => {
    const wordElement = document.createElement("span");
    wordElement.textContent = word;
    wordElement.className = "word";
    wordElement.style.animationDelay = `${index * 0.2}s`;
    textElement.appendChild(wordElement);

    if (index < words.length - 1) {
      const spaceElement = document.createElement("span");
      spaceElement.className = "space";
      textElement.appendChild(spaceElement);
    }
  });
}

document.addEventListener("DOMContentLoaded", function () {
  animateLinks(["auctionLink", "profileLink", "aboutLink"]);
});

function animateLinks(linkIds) {
  linkIds.forEach((linkId, linkIndex) => {
    const link = document.getElementById(linkId);
    const words = link.innerText.split(" ");

    link.innerHTML = "";

    words.forEach((word, index) => {
      const wordElement = document.createElement("span");
      wordElement.textContent = word;
      wordElement.className = "word";
      wordElement.style.animationDelay = `${index * 0.2 + linkIndex * 0.5}s`; // Adjust the delay based on link and word index
      link.appendChild(wordElement);

      if (index < words.length - 1) {
        const spaceElement = document.createElement("span");
        spaceElement.className = "space";
        link.appendChild(spaceElement);
      }
    });
  });
}

const englishLink = document.getElementById("englishLink");
const norwegianLink = document.getElementById("norwegianLink");

englishLink.addEventListener("click", () => switchLanguage("en"));
norwegianLink.addEventListener("click", () => switchLanguage("no"));

function switchLanguage(language) {
  // Save the selected language to localStorage
  localStorage.setItem("language", language);

  // Reload the page to apply the language changes
  location.reload();
}

// Check if there's a saved language preference
const savedLanguage = localStorage.getItem("language");
if (savedLanguage) {
  // Apply the saved language preference
  document.documentElement.lang = savedLanguage;
}
