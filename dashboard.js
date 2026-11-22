
const username = Storage.getSession();

if (!username) {

    window.location.replace("index.html");

} else {

    const player = Storage.getPlayer(username);

    if (!player) {

        Storage.logout();
        window.location.replace("index.html");

    } else {

        document.getElementById("playerName").textContent =
            player.username;

        document.getElementById("playerLevel").textContent =
            String(player.level).padStart(2, "0");

        document.getElementById("playerXP").textContent =
            player.xp;

        document.getElementById("completedCases").textContent =
            player.completedCases.length;

    }

}


// LOGOUT

document.getElementById("logoutBtn").addEventListener("click", () => {

    Storage.logout();

    window.location.replace("index.html");

});


// TEMPORARY MISSION BUTTON

document.getElementById("startMission").addEventListener("click", () => {

    alert("Your first investigation will be added in Phase 4!");

});
