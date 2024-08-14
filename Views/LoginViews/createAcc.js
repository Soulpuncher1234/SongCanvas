import PasswordToggle from './PasswordToggle.js';
import PasswordStrengthChecker from './PasswordStrengthChecker.js';
import FormValidator from './FormValidator.js';

document.addEventListener("DOMContentLoaded", function () {
    const eyeButton = document.getElementById("password-toggle");
    const passwordInput = document.getElementById("password-input");
    const eyeButton2 = document.getElementById("confirm-password-toggle");
    const passwordInput2 = document.getElementById("confirm-password-input");
    const submit_button = document.getElementById("submit-button");
    const passwordStrength = document.getElementById("password-strength");
    const form = document.getElementById("signup-form");
    const emailInput = document.getElementById("email-input");
    const lastNameInput = document.getElementById("last-name-input");
    const firstNameInput = document.getElementById("first-name-input");

    const passwordToggle = new PasswordToggle(eyeButton, passwordInput);
    const confirmPasswordToggle = new PasswordToggle(eyeButton2, passwordInput2);
    const passwordStrengthChecker = new PasswordStrengthChecker(passwordInput, passwordStrength);
    const formValidator = new FormValidator(firstNameInput, lastNameInput, passwordInput, passwordInput2, emailInput, submit_button, form, eyeButton2);
});