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
  const words = textElement.innerText.split(" ");
  textElement.innerHTML = ""; // Clear the original text

  words.forEach((word, index) => {
    const wordElement = document.createElement("span");
    wordElement.textContent = word;
    wordElement.className = "word";
    wordElement.style.animationDelay = `${index * 0.2}s`;
    textElement.appendChild(wordElement);

    // Add space after each word except the last one
    if (index < words.length - 1) {
      const spaceElement = document.createElement("span");
      spaceElement.className = "space";
      textElement.appendChild(spaceElement);
    }
  });
}


