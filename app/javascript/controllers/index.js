// app/javascript/controllers/index.js
// import { application } from "./application";
// import FlashController from "./flash_controller";

// application.register("flash", FlashController);

import { Application } from "@hotwired/stimulus";
import FlashController from "./flash_controller";

const application = Application.start();
application.register("flash", FlashController);

