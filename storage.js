
const Storage = {

    getAccounts() {
        return JSON.parse(
            localStorage.getItem("ztAccounts") || "{}"
        );
    },

    saveAccounts(accounts) {
        localStorage.setItem(
            "ztAccounts",
            JSON.stringify(accounts)
        );
    },

    getPlayer(username) {
        const players = JSON.parse(
            localStorage.getItem("ztPlayers") || "{}"
        );

        return players[username] || null;
    },

    savePlayer(player) {
        const players = JSON.parse(
            localStorage.getItem("ztPlayers") || "{}"
        );

        players[player.username] = player;

        localStorage.setItem(
            "ztPlayers",
            JSON.stringify(players)
        );
    },

    setSession(username) {
        sessionStorage.setItem(
            "ztCurrentUser",
            username
        );
    },

    getSession() {
        return sessionStorage.getItem("ztCurrentUser");
    },

    logout() {
        sessionStorage.removeItem("ztCurrentUser");
    }

};

// Password hashing for the demo.
// Requires localhost or another secure context.
async function hashPassword(password, salt) {

    const encoder = new TextEncoder();

    const key = await crypto.subtle.importKey(
        "raw",
        encoder.encode(password),
        "PBKDF2",
        false,
        ["deriveBits"]
    );

    const hash = await crypto.subtle.deriveBits(
        {
            name: "PBKDF2",
            salt: encoder.encode(salt),
            iterations: 100000,
            hash: "SHA-256"
        },
        key,
        256
    );

    return Array.from(new Uint8Array(hash))
        .map(byte => byte.toString(16).padStart(2, "0"))
        .join("");
}
