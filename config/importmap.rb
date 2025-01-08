# Pin npm packages
pin "application", preload: true
pin "@hotwired/turbo-rails", to: "turbo.min.js"
pin "@hotwired/stimulus", to: "stimulus.min.js", preload: true
pin "@hotwired/stimulus-loading", to: "stimulus-loading.js", preload: true
pin "controllers/flash_controller", preload: true
pin_all_from "app/javascript/controllers", under: "controllers"
