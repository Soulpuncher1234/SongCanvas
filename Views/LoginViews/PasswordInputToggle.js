export class PasswordInputToggle {
    constructor(eyeButton, passwordInput) {
      this.eyeButton = eyeButton;
      this.passwordInput = passwordInput;
      this.isPasswordVisible = false;
  
      this.initializeStyles();
      this.addEventListeners();
    }
  
    initializeStyles() {
      this.eyeButton.style.position = "absolute";
      this.eyeButton.style.width = "36px";
      this.eyeButton.style.height = "36px";
      this.eyeButton.style.top = "13px";
      this.eyeButton.style.right = "12px";
      this.eyeButton.style.backgroundSize = "cover";
      this.eyeButton.style.border = "none";
      this.eyeButton.style.cursor = "pointer";
      this.eyeButton.style.backgroundColor = "#d9d9d9";
      this.eyeButton.style.backgroundImage = 'url(/EyeHide.png)';
  
      this.passwordInput.style.position = "absolute";
      this.passwordInput.style.top = "15px";
      this.passwordInput.style.width = "80%";
      this.passwordInput.style.fontSize = "16px";
      this.passwordInput.style.right = "90px";
      this.passwordInput.style.fontFamily = "\"Kalam\", cursive";
      this.passwordInput.style.fontWeight = "400";
      this.passwordInput.style.color = "black";
      this.passwordInput.style.fontSize = "24.2px";
      this.passwordInput.style.letterSpacing = "0";
      this.passwordInput.style.lineHeight = "normal";
    }
  
    addEventListeners() {
      // Add an event listener to the eye button to handle click events
      this.eyeButton.addEventListener("click", (event) => {
        event.preventDefault(); // Prevent the default form submission behavior
        this.togglePasswordVisibility(); // Toggle password visibility
      });
    }
  
    togglePasswordVisibility() {
      this.isPasswordVisible = !this.isPasswordVisible;
      this.passwordInput.type = this.isPasswordVisible ? "text" : "password";
      this.eyeButton.style.backgroundImage = `url(/Eye${this.isPasswordVisible ? 'Show' : 'Hide'}.png)`;
    }
}