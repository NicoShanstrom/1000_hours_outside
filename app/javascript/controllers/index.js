// app/javascript/controllers/index.js

import { application } from "controllers/application";

// Import all Stimulus controllers
import { eagerLoadControllersFrom } from "@hotwired/stimulus-loading";
eagerLoadControllersFrom("controllers", application);
