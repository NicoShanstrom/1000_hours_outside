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
        const timezoneSelection = document.getElementById("timezone-selection");
        if (timezoneSelection) timezoneSelection.style.display = "block";
      });
  } catch (error) {
    console.error("Error in time zone detection:", error);
    const timezoneSelection = document.getElementById("timezone-selection");
    if (timezoneSelection) timezoneSelection.style.display = "block";
  }

  // Initialize Bootstrap Dropdowns
  const dropdownElements = document.querySelectorAll(".dropdown-toggle");
  dropdownElements.forEach((dropdown) => {
    console.log("Initializing dropdown:", dropdown);
    new bootstrap.Dropdown(dropdown);
  });

  console.log("Bootstrap initialized.");

  // Toggle visibility of sessions in challenges/show.html.erb
  const toggleButton = document.querySelector(".btn-secondary");
  const sessionsContainer = document.querySelector("#sessions-container");

  if (toggleButton && sessionsContainer) {
    toggleButton.addEventListener("click", () => {
      const isExpanded = sessionsContainer.classList.contains("show");

      // Toggle button text
      toggleButton.textContent = isExpanded ? "Show Sessions" : "Hide Sessions";

      // Ensure smooth scrolling
      if (!isExpanded) {
        sessionsContainer.scrollTop = 0; // Scroll to top when showing sessions
      }
    });
  }
});
