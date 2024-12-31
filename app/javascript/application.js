import "@hotwired/turbo-rails";
import "controllers";

document.addEventListener("turbo:load", () => {
  const form = document.querySelector("#timezone-selection form");

  if (form) {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const formData = new FormData(form);

      try {
        const response = await fetch(form.action, {
          method: "POST",
          headers: {
            "X-CSRF-Token": document.querySelector('meta[name="csrf-token"]').content,
          },
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          console.log("Time zone updated successfully:", data);

          // Update the displayed time zone without reloading the page
          const timeZoneDisplay = document.querySelector("#timezone-display");
          if (timeZoneDisplay) {
            timeZoneDisplay.textContent = formData.get("time_zone");
          }

          // Hide the time zone selection form
          const timeZoneSelection = document.querySelector("#timezone-selection");
          if (timeZoneSelection) {
            timeZoneSelection.style.display = "none";
          }
        } else {
          console.error("Failed to update time zone");
        }
      } catch (error) {
        console.error("Error updating time zone:", error);
      }
    });
  }
});

