import PasswordStrengthChecker from "./PasswordStrengthChecker.js";

class FormValidator {
    constructor(firstNameInput, lastNameInput, passwordInput, confirmPasswordInput, emailInput, submitButton, form, eyeButton2) {
        this.firstNameInput = firstNameInput;
        this.lastNameInput = lastNameInput;
        this.passwordInput = passwordInput;
        this.confirmPasswordInput = confirmPasswordInput;
        this.emailInput = emailInput;
        this.submitButton = submitButton;
        this.form = form;
        this.eyeButton2 = eyeButton2;

        const passwordStrengthElement = document.getElementById("password-strength")
        const passwordStrengthChecker = new PasswordStrengthChecker(passwordInput, passwordStrengthElement);

        this.successMessageContainer = document.getElementById("success-messages");
        this.errorMessagesContainer = document.getElementById("error-messages");

        this.eyeButton2.classList.add("eye-button");
        this.eyeButton2.style.backgroundImage = "url(/images/EyeHide.png)";

        this.confirmPasswordInput.classList.add("input-field");

        this.form.addEventListener("submit", (event) => this.validateForm(event));
    }

    validateForm(event) {
        this.errorMessagesContainer.innerHTML = "";

        const passwordValue = this.passwordInput.value;
        const confirmPasswordValue = this.confirmPasswordInput.value;
        const emailValue = this.emailInput.value;
        const firstNameInput = this.firstNameInput.value;
        const lastNameInput = this.lastNameInput.value;

        const validationRules = [
            { condition: passwordValue !== confirmPasswordValue, message: "Password and Confirm Password do not match. Please ensure both passwords match." },
            { condition: !firstNameInput, message: "Please enter your first name." },
            { condition: !lastNameInput, message: "Please enter your last name." },
            { condition: !emailValue, message: "Please enter your email." },
            { condition: !passwordValue && !confirmPasswordValue, message: "Please fill out a password and confirm it." },
            { condition: passwordValue.length < 8 || !/\W/.test(passwordValue), message: "Your password does not fit the criteria. Please enter again." },
            { condition: !this.isValidEmail(emailValue), message: "Invalid email address." },
            { condition: !this.isCopyAndPaste(passwordValue), message: "Copying and pasting passwords is not allowed." },
            { condition: !this.form.checkValidity(), message: "Please fill out all required fields." },
        ];

        for (const rule of validationRules) {
            if (rule.condition) {
                this.displayErrorMessage(rule.message);
                event.preventDefault();
                return;
            }
        }
    }

    isValidEmail(email) {
        const email_thangs = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return email_thangs.test(email);
    }

    isCopyAndPaste(password) {
        return password !== this.passwordInput.defaultValue;
    }

    displayErrorMessage(message) {
        this.errorMessagesContainer.style.display = "block";
        const errorMessage = document.createElement("div");
        errorMessage.className = "error-message";
        errorMessage.textContent = message;
        this.errorMessagesContainer.appendChild(errorMessage);
    }
}

export default FormValidator;