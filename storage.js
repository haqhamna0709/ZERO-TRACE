
/* =================================
   ZERO TRACE - STORAGE SYSTEM
================================= */

const Storage = {

    // Get all registered accounts
    getAccounts() {

        try {
            return JSON.parse(
                localStorage.getItem("ztAccounts") || "{}"
            );
        } catch {
            return {};
        }

    },

    // Save registered accounts
    saveAccounts(accounts) {

        localStorage.setItem(
            "ztAccounts",
            JSON.stringify(accounts)
        );

    },

    // Get player information
    getPlayer(username) {

        const players = this.getAllPlayers();

        return players[username.toLowerCase()] || null;

    },

    // Get all players
    getAllPlayers() {

        try {
            return JSON.parse(
                localStorage.getItem("ztPlayers") || "{}"
            );
        } catch {
            return {};
        }

    },

    // Save player progress
    savePlayer(player) {

        const players = this.getAllPlayers();

        players[player.username.toLowerCase()] = player;

        localStorage.setItem(
            "ztPlayers",
            JSON.stringify(players)
        );

    },

    // Create login session
    setSession(username) {

        sessionStorage.setItem(
            "ztCurrentUser",
            username
        );

    },

    // Get current logged-in user
    getSession() {

        return sessionStorage.getItem("ztCurrentUser");

    },

    // End session
    logout() {

        sessionStorage.removeItem("ztCurrentUser");

    }

};


// PASSWORD HASHING

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


// CREATE DEFAULT PLAYER

function createNewPlayer(username) {

    return {

        username: username,

        level: 1,

        xp: 0,

        totalXP: 0,

        completedCases: [],

        unlockedCases: ["case001"],

        collectedEvidence: [],

        achievements: [],

        activities: [
            {
                title: "Investigator Account Created",
                description: "Welcome to ZERO TRACE.",
                date: new Date().toISOString()
            }
        ],

        createdAt: new Date().toISOString()

    };

}
