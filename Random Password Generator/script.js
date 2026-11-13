const passwordOutput = document.getElementById("passwordOutput");
const passwordLength = document.getElementById("passwordLength");
const lengthValue = document.getElementById("lengthValue");

const uppercase = document.getElementById("uppercase");
const lowercase = document.getElementById("lowercase");
const numbers = document.getElementById("numbers");
const symbols = document.getElementById("symbols");
const excludeAmbiguous = document.getElementById("excludeAmbiguous");

const generateBtn = document.getElementById("generateBtn");
const copyBtn = document.getElementById("copyBtn");

const strengthText = document.getElementById("strengthText");
const strengthBars = document.querySelectorAll(".strength-bar");

const toast = document.getElementById("toast");
const toastMessage = document.getElementById("toastMessage");

let toastTimer;

/* === Character Sets === */
const characterSets = {
    uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    lowercase: "abcdefghijklmnopqrstuvwxyz",
    numbers: "0123456789",
    symbols: "!@#$%^&*()_+-=[]{}|;:,.<>?"
};
const ambiguousCharacters = "O0Il1";

/* === Secure Random Number === */

// Uses Web Crypto API with rejection sampling
// to avoid modulo bias.
function secureRandomInt(max) {
    if (!Number.isSafeInteger(max) || max <= 0) {
        throw new Error("Invalid random number range.");
    }
    const range = 0x100000000;
    const limit = range - (range % max);
    const randomValues = new Uint32Array(1);

    do {
        crypto.getRandomValues(randomValues);
    } while (randomValues[0] >= limit);
    return randomValues[0] % max;
}

/* === Get Selected Character Sets === */
function getSelectedCharacterSets() {
    const selectedSets = [];
    if (uppercase.checked) {
        selectedSets.push(characterSets.uppercase);
    }
    if (lowercase.checked) {
        selectedSets.push(characterSets.lowercase);
    }
    if (numbers.checked) {
        selectedSets.push(characterSets.numbers);
    }
    if (symbols.checked) {
        selectedSets.push(characterSets.symbols);
    }

    // Remove ambiguous characters if selected.
    if (excludeAmbiguous.checked) {
        return selectedSets.map(set =>
            [...set]
                .filter(char => !ambiguousCharacters.includes(char))
                .join("")
        );
    }
    return selectedSets;
}

/* === Generate Random Character === */
function getRandomCharacter(characters) {
    const index = secureRandomInt(characters.length);
    return characters[index];
}

/* === Shuffle Password === */
function shufflePassword(password) {
    const characters = [...password];
    for (let i = characters.length - 1; i > 0; i--) {
        const j = secureRandomInt(i + 1);
        [characters[i], characters[j]] =
            [characters[j], characters[i]];
    }
    return characters.join("");
}

/* === Password Generation === */
function generatePassword() {
    try {
        const length = Number(passwordLength.value);

        // Validate password length.
        if (!Number.isInteger(length) || length < 4 || length > 64) {
            showToast("Password length must be 4–64 characters.", true);
            return;
        }
        const selectedSets = getSelectedCharacterSets();

        // Validate character selection.
        if (selectedSets.length === 0) {
            showToast("Select at least one character type.", true);
            return;
        }

        // Ensure each selected category has at least one character.
        if (length < selectedSets.length) {
            showToast(
                "Password length must match selected character types.",
                true
            );
            return;
        }

        // Combine all selected character sets.
        const allCharacters = selectedSets.join("");
        let password = "";

        // Guarantee at least one character from each selected category.
        selectedSets.forEach(set => {
            password += getRandomCharacter(set);
        });

        // Fill the remaining password length.
        while (password.length < length) {
            password += getRandomCharacter(allCharacters);
        }

        // Shuffle characters for better distribution.
        password = shufflePassword(password);

        // Display generated password.
        passwordOutput.value = password;

        // Update password strength.
        checkPasswordStrength(password);

        // Reset copy button appearance.
        copyBtn.innerHTML = '<i class="fa-regular fa-copy"></i>';

    } catch (error) {
        console.error("Password generation failed:", error);
        showToast("Unable to generate password. Try again.", true);
    }
}

/* === Password Strength Checker === */
function checkPasswordStrength(password) {
    const selectedSets = getSelectedCharacterSets();
    const length = password.length;
    let poolSize = 0;

    // Calculate the available character pool.
    selectedSets.forEach(set => {
        poolSize += set.length;
    });

    // Calculate estimated entropy.
    const entropy = length * Math.log2(poolSize);

    // Classify password strength.
    let strength = 0;
    let strengthLabel = "Weak";
    let strengthClass = "weak";

    if (entropy >= 100) {
        strength = 4;
        strengthLabel = "Very Strong";
        strengthClass = "strong";

    } else if (entropy >= 70) {
        strength = 3;
        strengthLabel = "Strong";
        strengthClass = "good";

    } else if (entropy >= 45) {
        strength = 2;
        strengthLabel = "Fair";
        strengthClass = "fair";

    } else {
        strength = 1;
        strengthLabel = "Weak";
         strengthClass = "weak";
    }

    // Update strength text.
    strengthText.textContent = strengthLabel;

    // Update strength indicator bars.
    strengthBars.forEach((bar, index) => {
        bar.className = "strength-bar";
        if (index < strength) {
            bar.classList.add(strengthClass);
        }
    });
}

/* === Copy Password === */
async function copyPassword() {
    const password = passwordOutput.value;
    if (!password) {
        showToast("Generate a password first.", true);
        return;
    }

    try {
        // Use Clipboard API.
        if (!navigator.clipboard || !window.isSecureContext) {
            throw new Error("Clipboard API unavailable.");
        }
        await navigator.clipboard.writeText(password);
        copyBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
        showToast("Password copied successfully!");
    } catch (error) {

        // Fallback for unsupported clipboard environments.
        const tempInput = document.createElement("textarea");
        tempInput.value = password;
        tempInput.style.position = "fixed";
        tempInput.style.opacity = "0";
        document.body.appendChild(tempInput);
        tempInput.select();

        try {
            const copied = document.execCommand("copy");
            if (!copied) {
                throw new Error("Copy operation failed.");
            }
            copyBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
            showToast("Password copied successfully!");
        } catch (fallbackError) {
            console.error("Copy failed:", fallbackError);
            showToast("Unable to copy password.", true);
        } finally {
            tempInput.remove();
        }
    }
}

/* === Toast Notification === */
function showToast(message, isError = false) {
    clearTimeout(toastTimer);
    toastMessage.textContent = message;
    toast.style.background = isError ? "#991b1b" : "#166534";
    toast.classList.add("show");
    toastTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);
}

/* === Password Length Update === */
passwordLength.addEventListener("input", () => {
    lengthValue.textContent = passwordLength.value;
});

/* === Generate Button Event === */
generateBtn.addEventListener("click", generatePassword);

/* === Copy Button Event === */
copyBtn.addEventListener("click", copyPassword);

/* === Character Selection Events === */
const characterOptions = [
    uppercase,
    lowercase,
    numbers,
    symbols,
    excludeAmbiguous
];

characterOptions.forEach(option => {
    option.addEventListener("change", () => {

        // Update strength when settings change.
        if (passwordOutput.value) {
            checkPasswordStrength(passwordOutput.value);
        }
    });
});

/* === Generate Initial Password ===*/
generatePassword();
