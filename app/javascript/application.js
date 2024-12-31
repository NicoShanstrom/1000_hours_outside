// app/javascript/application.js
import "@hotwired/turbo-rails";
import { Application } from "@hotwired/stimulus";
import FlashController from "controllers/flash_controller";

const application = Application.start();
application.register("flash", FlashController);

document.addEventListener("turbo:load", () => {
  console.log("Turbo loaded, Stimulus controllers are initialized");
});

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
          if (!response.ok) {
            throw new Error(`Fetch failed with status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          console.log("Time zone updated successfully:", data);
        })
        .catch((error) => {
          console.error("Fetch API error:", error);
        });
    }
  } catch (error) {
    console.error("Error in time zone detection:", error);
  }
});
