import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  connect() {
    // Add fade-out class after a delay
    setTimeout(() => {
      this.element.classList.add("fade-out");

      // Listen for the 'transitionend' event to remove the element
      this.element.addEventListener("transitionend", () => {
        this.element.remove();
      });

      // Fallback for devices where transitionend might not fire
      setTimeout(() => {
        if (this.element.parentNode) {
          this.element.remove();
        }
      }, 1000); // Fallback removal after 1 second
    }, 5000); // Delay fade-out by 5 seconds
  }
}
