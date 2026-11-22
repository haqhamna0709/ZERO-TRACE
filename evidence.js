
/* =====================================
   ZERO TRACE - EVIDENCE ENGINE
===================================== */

const archiveUser = Storage.getSession();

let archivePlayer = archiveUser
    ? Storage.getPlayer(archiveUser)
    : null;

let selectedEvidence = [];


// AUTHENTICATION

if (!archivePlayer) {

    Storage.logout();

    window.location.replace("index.html");

} else {

    initializeArchive();

}


// INITIALIZE ARCHIVE

function initializeArchive() {

    normalizePlayerData();

    document.getElementById("archiveUsername").textContent =
        archivePlayer.username.toUpperCase();

    loadStatistics();

    renderEvidence();

    loadSavedNotes();

    setupArchiveEvents();

}


// ENSURE REQUIRED DATA EXISTS

function normalizePlayerData() {

    archivePlayer.collectedEvidence =
        archivePlayer.collectedEvidence || [];

    archivePlayer.completedCases =
        archivePlayer.completedCases || [];

    archivePlayer.unlockedCases =
        archivePlayer.unlockedCases || ["case001"];

    archivePlayer.caseProgress =
        archivePlayer.caseProgress || {};

    archivePlayer.investigationNotes =
        archivePlayer.investigationNotes || {};

    Storage.savePlayer(archivePlayer);

}


// GET ALL EVIDENCE

function getAllEvidence() {

    return CASES.flatMap(caseItem => {

        return caseItem.evidence.map(evidence => ({

            ...evidence,

            caseID: caseItem.id,

            caseTitle: caseItem.title,

            caseNumber: caseItem.number

        }));

    });

}


// CHECK COLLECTION

function isCollected(evidenceID) {

    return archivePlayer.collectedEvidence.includes(
        evidenceID
    );

}


// STATISTICS

function loadStatistics() {

    const allEvidence = getAllEvidence();

    const collected = allEvidence.filter(item =>
        isCollected(item.id)
    ).length;

    document.getElementById("totalEvidence").textContent =
        allEvidence.length;

    document.getElementById("collectedEvidence").textContent =
        collected;

    document.getElementById("remainingEvidence").textContent =
        allEvidence.length - collected;

}


// RENDER EVIDENCE

function renderEvidence() {

    const container = document.getElementById("evidenceGrid");

    const search = document.getElementById("evidenceSearch")
        .value.trim().toLowerCase();

    const filter = document.getElementById("caseFilter").value;

    const allEvidence = getAllEvidence();

    const visible = allEvidence.filter(item => {

        const searchMatch =
            item.title.toLowerCase().includes(search) ||
            item.id.toLowerCase().includes(search) ||
            item.caseTitle.toLowerCase().includes(search);

        const filterMatch =
            filter === "all" || item.caseID === filter;

        return searchMatch && filterMatch;

    });

    container.replaceChildren();

    document.getElementById("recordCount").textContent =
        `${visible.length} RECORDS`;

    if (!visible.length) {

        const empty = document.createElement("div");

        empty.className = "empty-archive";

        empty.textContent =
            "No evidence records match your search.";

        container.appendChild(empty);

        return;

    }

    visible.forEach(item => {

        const collected = isCollected(item.id);

        const card = document.createElement("article");

        card.className = collected
            ? "record-card"
            : "record-card locked-record";

        if (selectedEvidence.includes(item.id)) {

            card.classList.add("selected");

        }

        const number = document.createElement("span");

        number.className = "record-number";

        number.textContent =
            `RECORD ${item.id.toUpperCase()}`;

        const title = document.createElement("h3");

        title.textContent = item.title;

        const description = document.createElement("p");

        description.textContent = collected
            ? item.content
            : "This record has not been recovered yet.";

        const status = document.createElement("span");

        status.className = "record-status";

        status.textContent = collected
            ? "● RECOVERED"
            : "● NOT RECOVERED";

        status.style.color = collected
            ? "#37E6A2"
            : "#94A3B8";

        const actions = document.createElement("div");

        actions.className = "record-actions";

        const inspectButton = document.createElement("button");

        inspectButton.textContent = "INSPECT";

        inspectButton.disabled = !collected;

        inspectButton.addEventListener("click", () => {

            inspectEvidence(item);

        });

        const compareButton = document.createElement("button");

        compareButton.textContent = selectedEvidence.includes(item.id)
            ? "REMOVE FROM COMPARISON"
            : "SELECT TO COMPARE";

        compareButton.disabled = !collected;

        compareButton.addEventListener("click", () => {

            toggleComparison(item.id);

        });

        actions.append(inspectButton, compareButton);

        card.append(
            number,
            title,
            description,
            status,
            actions
        );

        container.appendChild(card);

    });

}


// INSPECT EVIDENCE

function inspectEvidence(item) {

    const container = document.getElementById("evidenceDetails");

    container.replaceChildren();

    const wrapper = document.createElement("div");

    wrapper.className = "detail-content";

    const label = document.createElement("p");

    label.className = "record-number";

    label.textContent =
        `CASE ${item.caseNumber} / ${item.id.toUpperCase()}`;

    const title = document.createElement("h3");

    title.textContent = item.title;

    const description = document.createElement("p");

    description.textContent = item.content;

    const meta = document.createElement("div");

    meta.className = "detail-meta";

    meta.textContent =
        `Investigation: ${item.caseTitle}`;

    wrapper.append(label, title, description, meta);

    container.appendChild(wrapper);

}


// COMPARISON SELECTION

function toggleComparison(evidenceID) {

    if (selectedEvidence.includes(evidenceID)) {

        selectedEvidence = selectedEvidence.filter(
            id => id !== evidenceID
        );

    } else {

        if (selectedEvidence.length >= 2) {

            showComparisonMessage(
                "You can compare only two records at a time."
            );

            return;

        }

        selectedEvidence.push(evidenceID);

    }

    updateComparison();

    renderEvidence();

}


// UPDATE COMPARISON DISPLAY

function updateComparison() {

    const slots = document.querySelectorAll(".comparison-slot");

    const allEvidence = getAllEvidence();

    slots.forEach((slot, index) => {

        const selectedID = selectedEvidence[index];

        const item = allEvidence.find(
            evidence => evidence.id === selectedID
        );

        if (item) {

            slot.textContent =
                `${item.title} — CASE ${item.caseNumber}`;

            slot.classList.add("filled");

        } else {

            slot.textContent =
                `SELECT RECORD 0${index + 1}`;

            slot.classList.remove("filled");

        }

    });

    document.getElementById("compareButton").disabled =
        selectedEvidence.length !== 2;

}


// COMPARE RECORDS

function compareRecords() {

    if (selectedEvidence.length !== 2) {
        return;
    }

    const allEvidence = getAllEvidence();

    const first = allEvidence.find(
        item => item.id === selectedEvidence[0]
    );

    const second = allEvidence.find(
        item => item.id === selectedEvidence[1]
    );

    if (!first || !second) {
        return;
    }

    const result = document.getElementById("comparisonResult");

    result.replaceChildren();

    const heading = document.createElement("h3");

    heading.textContent = "COMPARISON REPORT";

    const firstText = document.createElement("p");

    firstText.textContent =
        `${first.title}: ${first.content}`;

    const secondText = document.createElement("p");

    secondText.textContent =
        `${second.title}: ${second.content}`;

    const relationship = document.createElement("p");

    relationship.textContent =
        first.content.toLowerCase() === second.content.toLowerCase()
            ? "Analysis: Both records contain identical information."
            : "Analysis: The records contain different information. Review both records and consider their relationship.";

    result.append(
        heading,
        firstText,
        secondText,
        relationship
    );

}


// COMPARISON MESSAGE

function showComparisonMessage(message) {

    const result = document.getElementById("comparisonResult");

    result.textContent = message;

}


// LOAD NOTES

function loadSavedNotes() {

    const notes =
        archivePlayer.investigationNotes["general"] || "";

    document.getElementById("investigationNotes").value =
        notes;

}


// SAVE NOTES

function saveInvestigationNotes() {

    archivePlayer = Storage.getPlayer(archiveUser);

    if (!archivePlayer) {
        return;
    }

    archivePlayer.investigationNotes =
        archivePlayer.investigationNotes || {};

    archivePlayer.investigationNotes["general"] =
        document.getElementById("investigationNotes").value;

    Storage.savePlayer(archivePlayer);

    document.getElementById("notesStatus").textContent =
        "✓ Investigation notes saved successfully.";

}


// EVENT LISTENERS

function setupArchiveEvents() {

    document.getElementById("evidenceSearch")
        .addEventListener("input", renderEvidence);

    document.getElementById("caseFilter")
        .addEventListener("change", renderEvidence);

    document.getElementById("compareButton")
        .addEventListener("click", compareRecords);

    document.getElementById("saveNotes")
        .addEventListener("click", saveInvestigationNotes);

}
