export function formatTimeRemaining(timeRemaining, elementToUpdate) {
  // Function to update the displayed time
  function updateDisplay() {
    const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);
    const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
    const hours = Math.floor(
      (timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
    );
    const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));

    if (timeRemaining < 0) {
      // Auction ended
      elementToUpdate.textContent = "Auction ended";
    } else if (days === 0 && hours === 0 && minutes === 0) {
      elementToUpdate.textContent = `${seconds}s`;
    } else if (days === 0 && hours === 0) {
      elementToUpdate.textContent = `${minutes}m `;
    } else if (days === 0) {
      elementToUpdate.textContent = `${hours}h  `;
    } else {
      elementToUpdate.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;
    }
  }

  // Initial display
  updateDisplay();

  // Update the displayed time every second
  const intervalId = setInterval(() => {
    timeRemaining -= 1000;
    updateDisplay();

    // Stop the interval when the auction ends
    if (timeRemaining < 0) {
      clearInterval(intervalId);
    }
  }, 1000);
}
