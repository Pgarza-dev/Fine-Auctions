import { Tabs } from "flowbite";

/**
 * Initializes the Flowbite tabs functionality.
 */
function initializeTabs() {
  const tabsElement = document.getElementById("tabs-example");

  const tabElements = [
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

  const instanceOptions = {
    id: "tabs-example",
    override: true,
  };

  const tabs = new Tabs(tabsElement, tabElements, options, instanceOptions);
}

document.addEventListener("DOMContentLoaded", initializeTabs);
