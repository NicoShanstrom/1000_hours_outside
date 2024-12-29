// app/javascript/controllers/flash_controller.js
import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  connect() {
    console.log("Flash message connected");

    // Add fade-in animation
    this.element.classList.add("animate__animated", "animate__fadeInDown");

    // Start fade-out animation after 5 seconds
    setTimeout(() => {
      this.element.classList.replace("animate__fadeInDown", "animate__fadeOutUp");
    }, 5000);

    // Remove the flash message from DOM after fade-out
    this.element.addEventListener("animationend", () => {
      this.element.remove();
    });
  }
}
