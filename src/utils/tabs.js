// Import the Tabs class from 'flowbite'
import { Tabs } from "flowbite";

// Function to initialize the tabs
function initializeTabs() {
  const tabsElement = document.getElementById("tabs-example");

  // create an array of objects with the id, trigger element (e.g., button), and the content element
  const tabElements = [
    // {
    //   id: "profile",
    //   triggerEl: document.querySelector("#profile-tab-example"),
    //   targetEl: document.querySelector("#profile-example"),
    // },
    {
      id: "dashboard",
      triggerEl: document.querySelector("#dashboard-tab-example"),
      targetEl: document.querySelector("#dashboard-example"),
    },
    {
      id: "settings",
      triggerEl: document.querySelector("#settings-tab-example"),
      targetEl: document.querySelector("#settings-example"),
    },
  ];

  // options with default values
  const options = {
    defaultTabId: "settings",
    activeClasses:
      "text-black hover:text-blue-600 dark:text-blue-500 dark:hover:text-blue-400 border-b-2 border-blue-600 dark:border-blue-500",
    inactiveClasses:
      "text-gray-500 hover:text-gray-600 dark:text-gray-400 border-b-2 border-transparent hover:border-gray-300 dark:border-gray-700 dark:hover:text-gray-300",
    onShow: () => {
      console.log("tab is shown");
    },
  };

  // instance options with default values
  const instanceOptions = {
    id: "tabs-example",
    override: true,
  };

  // Create a new Tabs object
  const tabs = new Tabs(tabsElement, tabElements, options, instanceOptions);
}

// Call the function to initialize the tabs when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", initializeTabs);
