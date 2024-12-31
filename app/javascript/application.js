// app/javascript/application.js
import "@hotwired/turbo-rails";
import "controllers";

document.addEventListener("turbo:load", () => {
  try {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    if (timeZone) {
      console.log("Detected time zone:", timeZone);

      fetch('/set_time_zone', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content,
        },
        body: JSON.stringify({ time_zone: timeZone }),
      })
        .then((response) => {
          if (response.ok) {
            console.log("Time zone updated successfully");
          } else {
            console.error("Failed to update time zone");
          }
        })
        .catch((error) => console.error('Error updating time zone:', error));
    } else {
      console.error("Time zone detection failed");
    }
  } catch (error) {
    console.error("Error in application.js:", error);
  }
});
console.log("Application.js loaded"); // Debugging