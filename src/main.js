import { handleAuth } from "./auth/handleAuth";
import "./styles/main.css";

handleAuth();

export function checkIfUserIsLoggedIn() {
  const accessToken = localStorage.getItem("accessToken");
  const logInButton = document.getElementById("loginBtn");
  if (accessToken) {
    logInButton.textContent = "Log Out";
    logInButton.addEventListener("click", () => {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("activeUser");
      logInButton.textContent = "Log In";
    });
  } else {
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

  const textContent = textElement.innerText;

  if (!textContent.includes(" ")) {
    const wordElement = document.createElement("span");
    wordElement.textContent = textContent;
    wordElement.className = "word";
    textElement.innerHTML = "";
    textElement.appendChild(wordElement);
    return;
  }

  const words = textContent.split(" ");
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

    if (!link) {
      console.error(`Element with ID '${linkId}' not found.`);
      return;
    }

    const words = link.innerText.split(" ");

    link.innerHTML = "";

    words.forEach((word, index) => {
      const wordElement = document.createElement("span");
      wordElement.textContent = word;
      wordElement.className = "word";
      wordElement.style.animationDelay = `${index * 0.2 + linkIndex * 0.5}s`;
      link.appendChild(wordElement);

      if (index < words.length - 1) {
        const spaceElement = document.createElement("span");
        spaceElement.className = "space";
        link.appendChild(spaceElement);
      }
    });
  });
}
