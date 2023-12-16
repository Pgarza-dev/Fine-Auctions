import { Tooltip } from "flowbite";

/*
 * $targetEl: required
 * $triggerEl: required
 * options: optional
 */

// const tooltip = new Tooltip($targetEl, $triggerEl, options, instanceOptions);

const $targetEl = document.getElementById("tooltipContent");

const $triggerEl = document.getElementById("tooltipButton");

/**
 * Options for the tooltip.
 * @typedef {Object} TooltipOptions
 * @property {string} placement - The placement of the tooltip (e.g., "top", "bottom", "left", "right").
 * @property {string} triggerType - The trigger type for showing the tooltip (e.g., "hover", "click").
 * @property {Function} onHide - The callback function called when the tooltip is hidden.
 * @property {Function} onShow - The callback function called when the tooltip is shown.
 * @property {Function} onToggle - The callback function called when the tooltip is toggled.
 */
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

const instanceOptions = {
  id: "tooltipContent",
  override: true,
};
