export function formatTimeRemaining(timeRemaining) {
  const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);
  const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
  const hours = Math.floor(
    (timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
  );
  const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
  if (timeRemaining < 0) {
    return "Auction ended";
  }
  if (days === 0 && hours === 0 && minutes === 0) {
    return `${seconds}s`;
  }
  if (days === 0 && hours === 0) {
    return `${minutes}m `;
  }
  if (days === 0) {
    return `${hours}h  `;
  }
  if (days > 0) {
    return `${days}d `;
  }

  return `${days}d ${hours}h ${minutes}m `;
}
