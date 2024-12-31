// app/javascript/application.js
import "@hotwired/turbo-rails";
import "controllers";

document.addEventListener("turbo:load", () => {
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  console.log("Detected time zone:", timeZone); // Debugging line

  if (timeZone) {
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
  }
});



