console.log("main.js");

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
