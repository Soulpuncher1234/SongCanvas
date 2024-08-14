import { PasswordInputToggle } from "./PasswordInputToggle.js";


document.addEventListener("DOMContentLoaded", () => {
  initializePasswordInputToggle();
});

function initializePasswordInputToggle() {
  const eyeButton = document.getElementById("password-toggle");
  const passwordInput = document.getElementById("password-input");

  if (eyeButton && passwordInput) {
    new PasswordInputToggle(eyeButton, passwordInput);
  }
}