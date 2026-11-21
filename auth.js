
/* =================================
   ZERO TRACE - AUTHENTICATION
================================= */

const loginSection = document.getElementById("loginSection");
const registerSection = document.getElementById("registerSection");

const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");

const message = document.getElementById("message");

const showRegister = document.getElementById("showRegister");
const showLogin = document.getElementById("showLogin");


// CHECK EXISTING SESSION

const existingUser = Storage.getSession();

if (existingUser && Storage.getPlayer(existingUser)) {

    window.location.replace("dashboard.html");

}


// SWITCH TO REGISTRATION

showRegister.addEventListener("click", () => {

    loginSection.classList.add("hidden");
    registerSection.classList.remove("hidden");

    clearMessage();

});


// SWITCH TO LOGIN

showLogin.addEventListener("click", () => {

    registerSection.classList.add("hidden");
    loginSection.classList.remove("hidden");

    clearMessage();

});


// MESSAGE SYSTEM

function showMessage(text, error = false) {

    message.textContent = text;

    message.className = error ? "error" : "";

}

function clearMessage() {

    message.textContent = "";
    message.className = "";

}


// REGISTRATION

registerForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const username = document
        .getElementById("registerUsername")
        .value.trim();

    const password = document
        .getElementById("registerPassword")
        .value;

    const confirmPassword = document
        .getElementById("confirmPassword")
        .value;

    const usernamePattern = /^[a-zA-Z0-9_]{3,20}$/;

    if (!usernamePattern.test(username)) {

        showMessage(
            "Username must be 3-20 characters using letters, numbers or underscores.",
            true
        );

        return;

    }

    if (password.length < 8) {

        showMessage(
            "Password must contain at least 8 characters.",
            true
        );

        return;

    }

    if (password !== confirmPassword) {

        showMessage("Passwords do not match.", true);

        return;

    }

    const accounts = Storage.getAccounts();

    const accountKey = username.toLowerCase();

    if (accounts[accountKey]) {

        showMessage("Username already exists.", true);

        return;

    }

    const submitButton = registerForm.querySelector("button");

    submitButton.disabled = true;
    submitButton.textContent = "CREATING ACCOUNT...";

    try {

        const salt = crypto.randomUUID();

        const passwordHash = await hashPassword(
            password,
            salt
        );

        accounts[accountKey] = {

            username: username,

            salt: salt,

            passwordHash: passwordHash,

            createdAt: new Date().toISOString()

        };

        Storage.saveAccounts(accounts);

        const player = createNewPlayer(username);

        Storage.savePlayer(player);

        registerForm.reset();

        showMessage(
            "ACCOUNT CREATED! You can now login."
        );

        setTimeout(() => {

            registerSection.classList.add("hidden");

            loginSection.classList.remove("hidden");

            clearMessage();

        }, 1500);

    } catch (error) {

        showMessage(
            "Registration failed. Please use Live Server.",
            true
        );

    } finally {

        submitButton.disabled = false;
        submitButton.innerHTML = 'CREATE ACCOUNT <span>→</span>';

    }

});


// LOGIN

loginForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const username = document
        .getElementById("loginUsername")
        .value.trim();

    const password = document
        .getElementById("loginPassword")
        .value;

    const accounts = Storage.getAccounts();

    const account = accounts[username.toLowerCase()];

    if (!account) {

        showMessage("Account not found.", true);

        return;

    }

    const submitButton = loginForm.querySelector("button");

    submitButton.disabled = true;
    submitButton.textContent = "VERIFYING...";

    try {

        const enteredHash = await hashPassword(
            password,
            account.salt
        );

        if (enteredHash !== account.passwordHash) {

            showMessage("Incorrect password.", true);

            return;

        }

        const player = Storage.getPlayer(account.username);

        if (!player) {

            showMessage("Player profile not found.", true);

            return;

        }

        Storage.setSession(account.username);

        showMessage("ACCESS GRANTED!");

        setTimeout(() => {

            window.location.replace("dashboard.html");

        }, 700);

    } catch (error) {

        showMessage("Login failed. Please try again.", true);

    } finally {

        submitButton.disabled = false;
        submitButton.innerHTML = 'ACCESS SYSTEM <span>→</span>';

    }

});
