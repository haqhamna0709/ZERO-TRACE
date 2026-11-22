
/* =====================================
   ZERO TRACE - ADVANCED DASHBOARD
===================================== */

const currentUser = Storage.getSession();

let dashboardPlayer = currentUser
    ? Storage.getPlayer(currentUser)
    : null;


// LOGIN PROTECTION

if (!dashboardPlayer) {

    Storage.logout();

    window.location.replace("index.html");

} else {

    initializeDashboard();

}


// INITIALIZE

function initializeDashboard() {

    dashboardPlayer = Storage.getPlayer(currentUser);

    const totalXP = Number(
        dashboardPlayer.totalXP ?? dashboardPlayer.xp ?? 0
    );

    const level = Math.floor(totalXP / 500) + 1;

    const currentLevelXP = totalXP % 500;

    const remainingXP = 500 - currentLevelXP;

    const progress = (currentLevelXP / 500) * 100;

    // PROFILE

    document.getElementById("welcomeName").textContent =
        dashboardPlayer.username;

    document.getElementById("topUsername").textContent =
        dashboardPlayer.username;

    document.getElementById("topAvatar").textContent =
        dashboardPlayer.username.charAt(0).toUpperCase();

    document.getElementById("levelAvatar").textContent =
        dashboardPlayer.username.charAt(0).toUpperCase();

    // LEVEL

    document.getElementById("playerLevel").textContent =
        String(level).padStart(2, "0");

    document.getElementById("rankName").textContent =
        getRank(level);

    // XP

    document.getElementById("totalXP").textContent =
        totalXP.toLocaleString();

    document.getElementById("xpText").textContent =
        `${currentLevelXP} / 500 XP`;

    document.getElementById("xpRemaining").textContent =
        `${remainingXP} XP remaining until next level`;

    document.getElementById("xpFill").style.width =
        `${progress}%`;

    // STATISTICS

    document.getElementById("completedCases").textContent =
        dashboardPlayer.completedCases.length;

    document.getElementById("evidenceCount").textContent =
        dashboardPlayer.collectedEvidence.length;

    document.getElementById("achievementCount").textContent =
        dashboardPlayer.achievements.length;

    document.getElementById("evidencePreviewCount").textContent =
        dashboardPlayer.collectedEvidence.length;

    // GAME CONTENT

    renderMissions();

    loadActivities();

    loadAchievements();

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


// DYNAMIC MISSION CARDS

function renderMissions() {

    const container = document.getElementById("missionGrid");

    container.replaceChildren();

    const unlocked = dashboardPlayer.unlockedCases || [];

    const completed = dashboardPlayer.completedCases || [];

    CASES.forEach(item => {

        const isUnlocked = unlocked.includes(item.id);

        const isCompleted = completed.includes(item.id);

        const card = document.createElement("article");

        card.className = "mission-card";

        const top = document.createElement("div");

        top.className = "mission-top";

        const number = document.createElement("span");

        number.className = "case-number";

        number.textContent = `CASE ${item.number}`;

        const difficulty = document.createElement("span");

        difficulty.className = "difficulty";

        difficulty.textContent = item.difficulty;

        difficulty.classList.add(
            item.difficulty === "BEGINNER"
                ? "easy"
                : "medium"
        );

        top.append(number, difficulty);

        const symbol = document.createElement("div");

        symbol.className = "mission-symbol cyan-symbol";

        symbol.textContent = "◈";

        const title = document.createElement("h3");

        title.textContent = item.title;

        const description = document.createElement("p");

        description.textContent = item.description;

        const footer = document.createElement("div");

        footer.className = "mission-footer";

        const reward = document.createElement("span");

        reward.textContent = `REWARD: ${item.reward} XP`;

        const button = document.createElement("button");

        button.className = "mission-button";

        if (isCompleted) {

            button.textContent = "COMPLETED ✓";

            button.addEventListener("click", () => {

                window.location.href =
                    `case.html?case=${item.id}`;

            });

        } else if (isUnlocked) {

            button.textContent = "START →";

            button.addEventListener("click", () => {

                window.location.href =
                    `case.html?case=${item.id}`;

            });

        } else {

            button.textContent = "LOCKED";

            button.disabled = true;

        }

        footer.append(reward, button);

        card.append(
            top,
            symbol,
            title,
            description,
            footer
        );

        container.appendChild(card);

    });

}


// RECENT ACTIVITIES

function loadActivities() {

    const container = document.getElementById("activityList");

    container.replaceChildren();

    const activities = dashboardPlayer.activities || [];

    if (!activities.length) {

        showEmpty(
            container,
            "No investigation activities yet."
        );

        return;

    }

    [...activities].reverse().slice(0, 5).forEach(activity => {

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


// ACHIEVEMENTS

function loadAchievements() {

    const container = document.getElementById("achievementList");

    container.replaceChildren();

    const achievements = dashboardPlayer.achievements || [];

    if (!achievements.length) {

        showEmpty(
            container,
            "Complete your first investigation to unlock an achievement."
        );

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
                ? "Achievement unlocked."
                : achievement.description;

        details.append(title, description);

        item.append(icon, details);

        container.appendChild(item);

    });

}


// EMPTY STATE

function showEmpty(container, message) {

    const element = document.createElement("p");

    element.className = "empty-state";

    element.textContent = message;

    container.appendChild(element);

}


// LOGOUT

document.getElementById("logoutBtn").addEventListener("click", () => {

    if (confirm("Are you sure you want to logout?")) {

        Storage.logout();

        window.location.replace("index.html");

    }

});

