import { Application } from "@hotwired/stimulus";
import { setNonce } from "@hotwired/turbo";

const application = Application.start();

// Configure Stimulus development experience
application.debug = false;
window.Stimulus = application;

export { application };

// Retrieve the nonce from the meta tag
const nonceMetaTag = document.querySelector('meta[name="csp-nonce"]');
if (nonceMetaTag) {
  setNonce(nonceMetaTag.content);
}
