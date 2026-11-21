
/* =================================
   ZERO TRACE - APP CONTROLS
================================= */

const menuToggle = document.getElementById("menuToggle");

const sidebar = document.getElementById("sidebar");


// MOBILE MENU

if (menuToggle && sidebar) {

    menuToggle.addEventListener("click", () => {

        sidebar.classList.toggle("open");

    });

}


// SIDEBAR NAVIGATION

const navLinks = document.querySelectorAll(".nav-link");

navLinks.forEach(link => {

    link.addEventListener("click", () => {

        navLinks.forEach(item => {

            item.classList.remove("active");

        });

        link.classList.add("active");

        if (sidebar) {

            sidebar.classList.remove("open");

        }

    });

});
