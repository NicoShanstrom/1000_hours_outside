// app/javascript/application.js
import "@hotwired/turbo-rails";
import "controllers";

document.addEventListener("DOMContentLoaded", () => {
  // Get the user's time zone using the Intl API
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  // Only send the time zone to the server if it has changed or isn't set
  if (timeZone) {
    fetch('/set_time_zone', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content,
      },
      body: JSON.stringify({ time_zone: timeZone }),
    }).catch((error) => console.error('Error updating time zone:', error));
  }
});

