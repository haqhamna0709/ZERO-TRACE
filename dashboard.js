
/* =================================
   ZERO TRACE - DASHBOARD ENGINE
================================= */


// CHECK LOGIN SESSION

const currentUser = Storage.getSession();

if (!currentUser || !Storage.getPlayer(currentUser)) {

    Storage.logout();

    window.location.replace("index.html");

} else {

    initializeDashboard();

}


// MAIN DASHBOARD FUNCTION

function initializeDashboard() {

    const player = Storage.getPlayer(currentUser);

    if (!player) return;

    // Calculate total XP
    const totalXP = Number(player.totalXP ?? player.xp ?? 0);

    // Calculate level
    const level = Math.floor(totalXP / 500) + 1;

    // Calculate XP within current level
    const currentLevelXP = totalXP % 500;

    const remainingXP = 500 - currentLevelXP;

    const progress = (currentLevelXP / 500) * 100;


    // UPDATE PLAYER INFORMATION

    document.getElementById("welcomeName").textContent =
        player.username;

    document.getElementById("topUsername").textContent =
        player.username;

    document.getElementById("topAvatar").textContent =
        player.username.charAt(0).toUpperCase();

    document.getElementById("levelAvatar").textContent =
        player.username.charAt(0).toUpperCase();


    // UPDATE LEVEL

    document.getElementById("playerLevel").textContent =
        String(level).padStart(2, "0");

    document.getElementById("rankName").textContent =
        getRank(level);


    // UPDATE XP

    document.getElementById("totalXP").textContent =
        totalXP.toLocaleString();

    document.getElementById("xpText").textContent =
        `${currentLevelXP} / 500 XP`;

    document.getElementById("xpRemaining").textContent =
        `${remainingXP} XP remaining until next level`;

    document.getElementById("xpFill").style.width =
        `${progress}%`;


    // UPDATE STATISTICS

    const completed = player.completedCases || [];

    const evidence = player.collectedEvidence || [];

    const achievements = player.achievements || [];

    document.getElementById("completedCases").textContent =
        completed.length;

    document.getElementById("evidenceCount").textContent =
        evidence.length;

    document.getElementById("achievementCount").textContent =
        achievements.length;

    document.getElementById("evidencePreviewCount").textContent =
        evidence.length;


    // LOAD ACTIVITIES

    loadActivities(player.activities || []);


    // LOAD ACHIEVEMENTS

    loadAchievements(achievements);

}


// RANK SYSTEM

function getRank(level) {

    if (level >= 10) return "ELITE INVESTIGATOR";

    if (level >= 7) return "MASTER ANALYST";

    if (level >= 5) return "SENIOR INVESTIGATOR";

    if (level >= 3) return "DIGITAL ANALYST";

    if (level >= 2) return "JUNIOR INVESTIGATOR";

    return "ROOKIE INVESTIGATOR";

}


// ACTIVITY SYSTEM

function loadActivities(activities) {

    const container = document.getElementById("activityList");

    container.replaceChildren();

    if (activities.length === 0) {

        const empty = document.createElement("p");

        empty.className = "empty-state";

        empty.textContent =
            "No investigation activities yet. Start your first mission!";

        container.appendChild(empty);

        return;

    }

    const recent = [...activities].reverse().slice(0, 5);

    recent.forEach(activity => {

        const item = document.createElement("div");

        item.className = "activity-item";

        const icon = document.createElement("div");

        icon.className = "activity-icon";

        icon.textContent = "◈";

        const details = document.createElement("div");

        const title = document.createElement("h4");

        title.textContent = activity.title;

        const description = document.createElement("p");

        description.textContent = activity.description;

        const time = document.createElement("time");

        time.textContent = activity.date
            ? new Date(activity.date).toLocaleString()
            : "Recently";

        details.append(title, description, time);

        item.append(icon, details);

        container.appendChild(item);

    });

}


// ACHIEVEMENT SYSTEM

function loadAchievements(achievements) {

    const container = document.getElementById("achievementList");

    container.replaceChildren();

    if (achievements.length === 0) {

        const empty = document.createElement("p");

        empty.className = "empty-state";

        empty.textContent =
            "No achievements unlocked yet. Complete missions to earn rewards!";

        container.appendChild(empty);

        return;

    }

    achievements.forEach(achievement => {

        const item = document.createElement("div");

        item.className = "achievement-item";

        const icon = document.createElement("div");

        icon.className = "achievement-icon";

        icon.textContent = "✧";

        const details = document.createElement("div");

        const title = document.createElement("h4");

        title.textContent =
            typeof achievement === "string"
                ? achievement
                : achievement.title;

        const description = document.createElement("p");

        description.textContent =
            typeof achievement === "string"
                ? "Achievement unlocked"
                : achievement.description;

        details.append(title, description);

        item.append(icon, details);

        container.appendChild(item);

    });

}


// LOGOUT

document.getElementById("logoutBtn").addEventListener("click", () => {

    const confirmLogout = confirm(
        "Are you sure you want to logout?"
    );

    if (confirmLogout) {

        Storage.logout();

        window.location.replace("index.html");

    }

});


// MISSION BUTTON

document.querySelectorAll(".mission-button[data-case]").forEach(button => {

    button.addEventListener("click", () => {

        const caseID = button.dataset.case;

        if (caseID === "case001") {

            alert(
                "CASE 001: The Missing Identity\n\n" +
                "Your investigation module will be developed in Phase 04."
            );

        }

    });

});

