// app/javascript/application.js
import "@hotwired/turbo-rails";
import "controllers";

// Ensure flash messages disappear after Turbo updates
document.addEventListener("turbo:load", () => {
  const flashMessages = document.querySelectorAll(".flash-message");

  flashMessages.forEach((message) => {
    // Add fade-out after 5 seconds
    setTimeout(() => {
      message.classList.add("fade-out");
    }, 5000);

    // Remove the message from DOM after fading out
    setTimeout(() => {
      message.remove();
    }, 6000);
  });
});
