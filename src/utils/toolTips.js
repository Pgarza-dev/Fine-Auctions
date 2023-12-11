import { Tooltip } from "flowbite";

/*
* $targetEl: required
* $triggerEl: required
* options: optional
*/

// const tooltip = new Tooltip($targetEl, $triggerEl, options, instanceOptions);
// set the tooltip content element
const $targetEl = document.getElementById("tooltipContent");

// set the element that trigger the tooltip using hover or click
const $triggerEl = document.getElementById("tooltipButton");

// options with default values
const options = {
  placement: "bottom",
  triggerType: "hover",
  onHide: () => {
    console.log("tooltip is shown");
  },
  onShow: () => {
    console.log("tooltip is hidden");
  },
  onToggle: () => {
    console.log("tooltip is toggled");
  },
};

// instance options with default values
const instanceOptions = {
  id: "tooltipContent",
  override: true,
};
