document.addEventListener("DOMContentLoaded", () => {
  /* =========================
     🌙 DARK MODE TOGGLE
  ========================= */
  const themeToggle = document.getElementById("theme-toggle");
  const darkIcon = document.getElementById("theme-toggle-dark-icon");
  const lightIcon = document.getElementById("theme-toggle-light-icon");

  const enableDarkMode = () => {
    document.documentElement.classList.add("dark");
    localStorage.setItem("theme", "dark");
    lightIcon.classList.remove("hidden");
    darkIcon.classList.add("hidden");
  };

  const disableDarkMode = () => {
    document.documentElement.classList.remove("dark");
    localStorage.setItem("theme", "light");
    lightIcon.classList.add("hidden");
    darkIcon.classList.remove("hidden");
  };

  // Set theme on load
  if (
    localStorage.getItem("theme") === "dark" ||
    (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches)
  ) {
    enableDarkMode();
  } else {
    disableDarkMode();
  }

  // Toggle theme on click
  themeToggle.addEventListener("click", () => {
    if (document.documentElement.classList.contains("dark")) {
      disableDarkMode();
    } else {
      enableDarkMode();
    }
  });

  /* =========================
     🍔 MOBILE MENU TOGGLE
  ========================= */
  const menuBtn = document.getElementById("menu-btn");
  const mobileMenu = document.getElementById("mobile-menu");
  const hamburger = document.getElementById("hamburger");

  let menuOpen = false;

  menuBtn.addEventListener("click", () => {
    menuOpen = !menuOpen;
    mobileMenu.classList.toggle("hidden");

    // Animate hamburger icon (turn into X)
    const line1 = document.getElementById("line1");
    const line2 = document.getElementById("line2");
    const line3 = document.getElementById("line3");

    if (menuOpen) {
      line1.setAttribute("d", "M5 5L19 19");
      line2.classList.add("opacity-0");
      line3.setAttribute("d", "M5 19L19 5");
    } else {
      line1.setAttribute("d", "M4 7h16");
      line2.classList.remove("opacity-0");
      line3.setAttribute("d", "M4 17h16");
    }
  });

  // Optional: Close mobile menu when a link is clicked
  document.querySelectorAll("#mobile-menu a").forEach(link => {
    link.addEventListener("click", () => {
      mobileMenu.classList.add("hidden");
      menuOpen = false;
      line1.setAttribute("d", "M4 7h16");
      line2.classList.remove("opacity-0");
      line3.setAttribute("d", "M4 17h16");
    });
  });
});


const mainText = "Hi, I'm Tanish Mehta 👋";
const subText = "Front-End Developer & Java DSA Enthusiast";

const mainElement = document.getElementById("main-text");
const subElement = document.getElementById("sub-text");

let i = 0;
let j = 0;

function typeMain() {
  if (i < mainText.length) {
    mainElement.innerHTML = mainText.slice(0, i + 1) + '<span class="cursor"></span>';
    i++;
    setTimeout(typeMain, 100);
  } else {
    mainElement.innerHTML = mainText + '<span class="cursor"></span>';
    setTimeout(typeSub, 600);
  }
}

function typeSub() {
  if (j < subText.length) {
    subElement.textContent += subText[j];
    j++;
    setTimeout(typeSub, 60);
  }
}

window.onload = typeMain;
