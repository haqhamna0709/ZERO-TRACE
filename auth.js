
const loginSection = document.getElementById("loginSection");
const registerSection = document.getElementById("registerSection");

const message = document.getElementById("message");

const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");

const showRegister = document.getElementById("showRegister");
const showLogin = document.getElementById("showLogin");


// SWITCH TO REGISTRATION

showRegister.addEventListener("click", () => {

    loginSection.classList.add("hidden");
    registerSection.classList.remove("hidden");

    message.textContent = "";
    message.className = "";

});


// SWITCH TO LOGIN

showLogin.addEventListener("click", () => {

    registerSection.classList.add("hidden");
    loginSection.classList.remove("hidden");

    message.textContent = "";
    message.className = "";

});


// CREATE ACCOUNT

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

    if (username.length < 3) {
        showMessage("Username must contain at least 3 characters.", true);
        return;
    }

    if (password.length < 6) {
        showMessage("Password must contain at least 6 characters.", true);
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

    try {

        const salt = crypto.randomUUID();

        const passwordHash = await hashPassword(
            password,
            salt
        );

        accounts[accountKey] = {
            username: username,
            salt: salt,
            passwordHash: passwordHash
        };

        Storage.saveAccounts(accounts);

        const player = {
            username: username,
            level: 1,
            xp: 0,
            completedCases: [],
            unlockedCases: ["case001"],
            collectedEvidence: [],
            achievements: [],
            createdAt: new Date().toISOString()
        };

        Storage.savePlayer(player);

        showMessage(
            "ACCOUNT CREATED SUCCESSFULLY! Please login."
        );

        registerForm.reset();

        setTimeout(() => {

            registerSection.classList.add("hidden");
            loginSection.classList.remove("hidden");

            message.textContent = "";

        }, 1200);

    } catch (error) {

        showMessage(
            "Unable to create account. Run using Live Server.",
            true
        );

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

    const accountKey = username.toLowerCase();

    const account = accounts[accountKey];

    if (!account) {
        showMessage("Account not found.", true);
        return;
    }

    try {

        const enteredHash = await hashPassword(
            password,
            account.salt
        );

        if (enteredHash !== account.passwordHash) {
            showMessage("Incorrect password.", true);
            return;
        }

        Storage.setSession(account.username);

        showMessage("ACCESS GRANTED!");

        setTimeout(() => {
            window.location.href = "dashboard.html";
        }, 700);

    } catch (error) {

        showMessage("Login failed. Please try again.", true);

    }

});


// MESSAGE FUNCTION

function showMessage(text, error = false) {

    message.textContent = text;

    message.className = error ? "error" : "";

}
