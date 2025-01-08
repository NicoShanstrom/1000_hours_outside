import "@hotwired/turbo-rails";
import "controllers";

document.addEventListener("turbo:load", () => {
  console.log("Turbo loaded, Stimulus controllers initialized.");
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
          console.log("Time zone updated successfully");

          // Hide the manual selection element on success
          const timezoneSelection = document.getElementById("timezone-selection");
          if (timezoneSelection) {
            timezoneSelection.style.display = "none";
          }
        })
        .catch((error) => {
          console.error("Fetch API error:", error);

          // Show manual selection fallback
          const timezoneSelection = document.getElementById("timezone-selection");
          if (timezoneSelection) {
            timezoneSelection.style.display = "block";
          }
        });
    } else {
      throw new Error("Time zone not detected");
    }
  } catch (error) {
    console.error("Error in time zone detection:", error);

    // Show manual selection fallback
    const timezoneSelection = document.getElementById("timezone-selection");
    if (timezoneSelection) {
      timezoneSelection.style.display = "block";
    }
  }
});
