import "@hotwired/turbo-rails";
import "controllers";
import "bootstrap";
import "dexie";

const Dexie = window.Dexie; // Assign Dexie from the global window object

// Initialize IndexedDB database at the top level
const db = new Dexie("OfflineDB");
db.version(1).stores({
  sessions: "++id, start_time, end_time, duration, description, synced"
});

// Export the database so it can be used elsewhere
export default db;

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

  // Register service worker
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("/serviceworker.js")
      .then((registration) => {
        console.log("Service Worker registered with scope:", registration.scope);
      })
      .catch((error) => {
        console.error("Service Worker registration failed:", error);
      });
  }

  // Offline session handling
  const isOnline = () => navigator.onLine;

  const startTimerForm = document.getElementById("start-timer-form");
  const stopTimerForm = document.getElementById("stop-timer-form");

  if (startTimerForm) {
    startTimerForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const startTime = new Date().toISOString();
      if (isOnline()) {
        event.target.submit(); // Submit form normally if online
      } else {
        await db.sessions.add({ start_time: startTime, synced: false });
        alert("Timer started offline and will sync when back online.");
      }
    });
  }

  if (stopTimerForm) {
    stopTimerForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const endTime = new Date().toISOString();
      if (isOnline()) {
        event.target.submit();
      } else {
        const session = await db.sessions.orderBy("id").last();
        if (session) {
          session.end_time = endTime;
          session.duration = (new Date(endTime) - new Date(session.start_time)) / 3600000;
          session.synced = false;
          await db.sessions.put(session);
          alert("Timer stopped offline and will sync when back online.");
        }
      }
    });
  }

  // Sync offline data when back online
  const syncData = async () => {
    if (!navigator.onLine) return;

    const unsyncedSessions = await db.sessions.where("synced").equals(false).toArray();

    for (const session of unsyncedSessions) {
      const response = await fetch("/outdoor_sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": document.querySelector('meta[name="csrf-token"]').content
        },
        body: JSON.stringify({
          outdoor_session: {
            start_time: session.start_time,
            end_time: session.end_time,
            duration: session.duration,
            description: session.description
          }
        })
      });

      if (response.ok) {
        await db.sessions.update(session.id, { synced: true });
      }
    }
  };

  window.addEventListener("online", syncData);
});
