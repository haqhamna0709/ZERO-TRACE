
/* =====================================
   ZERO TRACE - INVESTIGATION ENGINE
===================================== */

const username = Storage.getSession();

let player = username ? Storage.getPlayer(username) : null;

const params = new URLSearchParams(window.location.search);

const caseID = params.get("case") || "case001";

const currentCase = CASES.find(item => item.id === caseID);


// AUTHENTICATION CHECK

if (!player) {

    Storage.logout();

    window.location.replace("index.html");

} else if (!currentCase) {

    window.location.replace("dashboard.html");

} else if (!player.unlockedCases.includes(caseID) &&
           !player.completedCases.includes(caseID)) {

    window.location.replace("dashboard.html");

} else {

    initializeGame();

}


// INITIALIZE GAME

function initializeGame() {

    document.getElementById("casePlayerName").textContent =
        player.username.toUpperCase();

    document.getElementById("caseNumber").textContent =
        currentCase.number;

    document.getElementById("caseTitle").textContent =
        currentCase.title;

    document.getElementById("caseDescription").textContent =
        currentCase.description;

    document.getElementById("caseDifficulty").textContent =
        currentCase.difficulty;

    document.getElementById("caseReward").textContent =
        `${currentCase.reward} XP REWARD`;

    document.getElementById("questionText").textContent =
        currentCase.question.text;

    renderBriefing();

    renderEvidence();

    updateEvidenceProgress();

    checkPreviousCompletion();

    setupGameEvents();

}


// BRIEFING

function renderBriefing() {

    const container = document.getElementById("briefingList");

    container.replaceChildren();

    currentCase.briefing.forEach((item, index) => {

        const row = document.createElement("div");

        row.className = "briefing-item";

        const number = document.createElement("span");

        number.textContent = `0${index + 1}`;

        const text = document.createElement("p");

        text.textContent = item;

        row.append(number, text);

        container.appendChild(row);

    });

}


// GET CURRENT PROGRESS

function getCaseProgress() {

    player = Storage.getPlayer(username);

    if (!player.caseProgress) {

        player.caseProgress = {};

    }

    if (!player.caseProgress[caseID]) {

        player.caseProgress[caseID] = {
            collectedEvidence: [],
            hintsUsed: 0
        };

        Storage.savePlayer(player);

    }

    return player.caseProgress[caseID];

}


// EVIDENCE DISPLAY

function renderEvidence() {

    const container = document.getElementById("evidenceList");

    container.replaceChildren();

    const progress = getCaseProgress();

    currentCase.evidence.forEach(evidence => {

        const collected = progress.collectedEvidence.includes(
            evidence.id
        );

        const card = document.createElement("article");

        card.className = collected
            ? "evidence-card collected"
            : "evidence-card";

        const title = document.createElement("h4");

        title.textContent = evidence.title;

        const content = document.createElement("p");

        content.textContent = collected
            ? evidence.content
            : "Evidence not yet recovered. Collect this item to reveal its contents.";

        const button = document.createElement("button");

        button.className = "collect-button";

        button.textContent = collected
            ? "✓ COLLECTED"
            : "COLLECT EVIDENCE";

        button.disabled = collected;

        button.addEventListener("click", () => {

            collectEvidence(evidence.id);

        });

        card.append(title, content, button);

        container.appendChild(card);

    });

}


// COLLECT EVIDENCE

function collectEvidence(evidenceID) {

    player = Storage.getPlayer(username);

    const progress = getCaseProgress();

    if (progress.collectedEvidence.includes(evidenceID)) {
        return;
    }

    progress.collectedEvidence.push(evidenceID);

    player.collectedEvidence =
        player.collectedEvidence || [];

    if (!player.collectedEvidence.includes(evidenceID)) {

        player.collectedEvidence.push(evidenceID);

    }

    addActivity(
        player,
        "Evidence Recovered",
        `Collected evidence from ${currentCase.title}.`
    );

    Storage.savePlayer(player);

    renderEvidence();

    updateEvidenceProgress();

    showGameMessage(
        "Evidence successfully recovered.",
        "success"
    );

}


// EVIDENCE PROGRESS

function updateEvidenceProgress() {

    const progress = getCaseProgress();

    const collected = progress.collectedEvidence.length;

    const total = currentCase.evidence.length;

    document.getElementById("evidenceProgress").textContent =
        `${collected} / ${total}`;

    document.getElementById("evidenceFill").style.width =
        `${(collected / total) * 100}%`;

}


// GAME EVENTS

function setupGameEvents() {

    document.getElementById("answerForm")
        .addEventListener("submit", checkAnswer);

    document.getElementById("hintButton")
        .addEventListener("click", showHint);

    document.getElementById("nextCaseButton")
        .addEventListener("click", goToNextCase);

}


// ANSWER VALIDATION

function checkAnswer(event) {

    event.preventDefault();

    player = Storage.getPlayer(username);

    if (player.completedCases.includes(caseID)) {

        showGameMessage(
            "This investigation has already been completed.",
            "success"
        );

        return;

    }

    const progress = getCaseProgress();

    if (
        progress.collectedEvidence.length !==
        currentCase.evidence.length
    ) {

        showGameMessage(
            "Collect all evidence before submitting your answer.",
            "error"
        );

        return;

    }

    const input = document.getElementById("answerInput");

    const answer = input.value.trim().toLowerCase();

    const correctAnswer = currentCase.question.answer.toLowerCase();

    if (answer === correctAnswer) {

        completeCase();

    } else {

        showGameMessage(
            "Incorrect answer. Review the evidence and try again.",
            "error"
        );

        input.value = "";

    }

}


// HINT SYSTEM

function showHint() {

    const progress = getCaseProgress();

    progress.hintsUsed++;

    Storage.savePlayer(player);

    const hintBox = document.getElementById("hintBox");

    hintBox.textContent =
        "INVESTIGATION HINT: " + currentCase.question.hint;

    hintBox.classList.remove("hidden");

    showGameMessage(
        "A new investigation hint is available.",
        "success"
    );

}


// COMPLETE CASE

function completeCase() {

    player = Storage.getPlayer(username);

    if (player.completedCases.includes(caseID)) {
        return;
    }

    const reward = currentCase.reward;

    // UPDATE COMPLETED CASES

    player.completedCases.push(caseID);


    // UPDATE XP

    player.totalXP = Number(player.totalXP ?? player.xp ?? 0)
        + reward;

    player.xp = player.totalXP;


    // UNLOCK NEXT CASE

    const currentIndex = CASES.findIndex(
        item => item.id === caseID
    );

    const nextCase = CASES[currentIndex + 1];

    if (nextCase) {

        if (!player.unlockedCases.includes(nextCase.id)) {

            player.unlockedCases.push(nextCase.id);

        }

    }


    // CREATE ACHIEVEMENT

    player.achievements = player.achievements || [];

    const achievement = {

        id: `achievement_${caseID}`,

        title: `${currentCase.title} Completed`,

        description: `Successfully solved Case ${currentCase.number}.`

    };

    player.achievements.push(achievement);


    // RECORD ACTIVITY

    addActivity(
        player,
        "Case Completed",
        `${currentCase.title} — Earned ${reward} XP.`
    );


    // SAVE PLAYER

    Storage.savePlayer(player);


    // SHOW COMPLETION

    document.querySelector(".game-layout").classList.add("hidden");

    document.querySelector(".case-hero").classList.add("hidden");

    document.getElementById("completionScreen")
        .classList.remove("hidden");

    document.getElementById("earnedXP").textContent =
        `+${reward} XP`;

    document.getElementById("completionMessage").textContent =
        currentCase.question.explanation;


    // NEXT CASE BUTTON

    const nextButton = document.getElementById("nextCaseButton");

    if (nextCase) {

        nextButton.disabled = false;

        nextButton.textContent = "NEXT INVESTIGATION →";

    } else {

        nextButton.disabled = true;

        nextButton.textContent = "ALL CASES COMPLETED";

    }

}


// ACTIVITY HELPER

function addActivity(player, title, description) {

    player.activities = player.activities || [];

    player.activities.push({

        title: title,

        description: description,

        date: new Date().toISOString()

    });

}


// GAME MESSAGES

function showGameMessage(text, type) {

    const message = document.getElementById("gameMessage");

    message.textContent = text;

    message.className = `game-message ${type}`;

}


// PREVIOUS COMPLETION

function checkPreviousCompletion() {

    player = Storage.getPlayer(username);

    if (!player.completedCases.includes(caseID)) {
        return;
    }

    document.querySelector(".game-layout").classList.add("hidden");

    document.querySelector(".case-hero").classList.add("hidden");

    document.getElementById("completionScreen")
        .classList.remove("hidden");

    document.getElementById("completionMessage").textContent =
        "You have already successfully completed this investigation.";

    document.getElementById("earnedXP").textContent =
        "REWARD ALREADY EARNED";

    const index = CASES.findIndex(item => item.id === caseID);

    const nextCase = CASES[index + 1];

    const nextButton = document.getElementById("nextCaseButton");

    if (nextCase && player.unlockedCases.includes(nextCase.id)) {

        nextButton.disabled = false;

        nextButton.textContent = "NEXT INVESTIGATION →";

    } else {

        nextButton.disabled = true;

        nextButton.textContent = "INVESTIGATION COMPLETED";

    }

}


// NEXT CASE

function goToNextCase() {

    const index = CASES.findIndex(item => item.id === caseID);

    const nextCase = CASES[index + 1];

    player = Storage.getPlayer(username);

    if (
        nextCase &&
        player.unlockedCases.includes(nextCase.id)
    ) {

        window.location.href =
            `case.html?case=${nextCase.id}`;

    }

}
