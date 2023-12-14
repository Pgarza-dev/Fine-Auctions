import { Tooltip } from "flowbite";

/*
 * $targetEl: required
 * $triggerEl: required
 * options: optional
 */

const tooltip = new Tooltip($targetEl, $triggerEl, options, instanceOptions);

const $targetEl = document.getElementById("tooltipContent");

const $triggerEl = document.getElementById("tooltipButton");

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
