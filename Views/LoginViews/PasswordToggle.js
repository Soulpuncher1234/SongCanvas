class PasswordToggle {
    constructor(eyeButton, passwordInput) {
        this.eyeButton = eyeButton;
        this.passwordInput = passwordInput;
        this.isPasswordVisible = false;

        this.eyeButton.classList.add("eye-button");
        this.eyeButton.style.backgroundImage = "url(/EyeHide.png)";
        this.eyeButton.addEventListener("click", () => this.togglePasswordVisibility());
    }

    togglePasswordVisibility() {
        this.isPasswordVisible = !this.isPasswordVisible;
        this.passwordInput.type = this.isPasswordVisible ? "text" : "password";
        this.eyeButton.style.backgroundImage = `url(/Eye${this.isPasswordVisible ? 'Show' : 'Hide'}.png)`;
    }
}

export default PasswordToggle;