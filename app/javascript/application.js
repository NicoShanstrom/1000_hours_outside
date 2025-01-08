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
        })
        .catch((error) => {
          console.error("Fetch API error:", error);
          document.getElementById("timezone-selection").style.display = "block";
        });
    } else {
      throw new Error("Time zone not detected");
    }
  } catch (error) {
    console.error("Error in time zone detection:", error);
    document.getElementById("timezone-selection").style.display = "block";
  }
});

// Add listeners for "click", "touchstart", and "touchend" events
["click", "touchstart", "touchend"].forEach((eventType) => {
  document.addEventListener(eventType, (event) => {
    console.log(`Event detected: ${eventType}`, event);
  });
});
