class PasswordStrengthChecker {
    constructor(passwordInput, passwordStrength) {
        this.passwordInput = passwordInput;
        this.passwordStrength = passwordStrength;

        this.passwordInput.classList.add("input-field");
        this.passwordInput.addEventListener("input", () => this.updatePasswordUI());
    }

    checkPasswordStrength(password) {
        const numbersCount = (password.match(/\d/g) || []).length;
        const specialCharCount = (password.match(/[!@#$%^&*]/g) || []).length;

        if (password.length >= 8 && numbersCount >= 3 && specialCharCount >= 2) {
            return "<span class=\"strong\">Strong</span>";
        } else if (password.length >= 8 && (numbersCount >= 3 || specialCharCount >= 1)) {
            return "<span class=\"average\">Average</span>";
        } else {
            return "<span class=\"weak\">Weak</span>";
        }
    }

    updatePasswordUI() {
        const passwordVal = this.passwordInput.value;
        const strength = this.checkPasswordStrength(passwordVal);
        this.passwordStrength.innerHTML = `<label class=\"ps\">Password Strength:&emsp;</label>${strength}`;
    }
}

export default PasswordStrengthChecker;