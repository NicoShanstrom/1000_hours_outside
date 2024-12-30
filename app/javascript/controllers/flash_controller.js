// app/javascript/controllers/flash_controller.js
import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  connect() {
    setTimeout(() => {
      this.element.classList.add("fade-out"); // Add fade-out class
      setTimeout(() => this.element.remove(), 1000); // Remove after animation
    }, 5000); // Delay fade-out by 5 seconds
  }
}
