import "@hotwired/turbo-rails";
import "controllers";
import "bootstrap"; // Import Bootstrap (ensure it's globally available)

document.addEventListener("turbo:load", () => {
  console.log("Turbo loaded, Stimulus controllers initialized.");

  // Time zone detection logic
  try {
    const detectedTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (!detectedTimeZone) throw new Error("Time zone not detected");

    console.log("Detected time zone:", detectedTimeZone);
    fetch("/set_time_zone", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": document.querySelector('meta[name="csrf-token"]').content,
      },
      body: JSON.stringify({ time_zone: detectedTimeZone }),
    })
      .then((response) => {
        if (!response.ok) throw new Error(`Fetch failed with status: ${response.status}`);
        console.log("Time zone updated successfully");
      })
      .catch((error) => {
        console.error("Fetch API error:", error);
        document.getElementById("timezone-selection").style.display = "block";
      });
  } catch (error) {
    console.error("Error in time zone detection:", error);
    document.getElementById("timezone-selection").style.display = "block";
  }

  // Initialize Bootstrap Dropdowns
  const dropdownElements = document.querySelectorAll('.dropdown-toggle');
  dropdownElements.forEach((dropdown) => {
    console.log("Initializing dropdown:", dropdown);

    // Use global Bootstrap instance to initialize
    new bootstrap.Dropdown(dropdown);
  });
});
