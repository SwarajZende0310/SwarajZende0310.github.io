const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".site-nav");

function closeMenu() {
  if (!menuButton || !navigation) return;
  menuButton.setAttribute("aria-expanded", "false");
  navigation.classList.remove("is-open");
  document.body.style.overflow = "";
}

menuButton?.addEventListener("click", () => {
  const isOpen = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!isOpen));
  navigation.classList.toggle("is-open", !isOpen);
  document.body.style.overflow = isOpen ? "" : "hidden";
});

navigation?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeMenu);
});

document.getElementById("year").textContent = new Date().getFullYear();

const reveals = document.querySelectorAll(".reveal");
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 },
);

reveals.forEach((element, index) => {
  element.style.transitionDelay = `${Math.min(index % 3, 2) * 80}ms`;
  observer.observe(element);
});

const sleepyFriend = document.getElementById("sleepy-friend");
let lastSpot = -1;

function placeSleepyFriend(animate = false) {
  if (!sleepyFriend) return;

  const pageHeight = document.documentElement.scrollHeight;
  const mascotWidth = sleepyFriend.offsetWidth || 180;
  const mascotHeight = sleepyFriend.offsetHeight || 125;
  const gutter = Math.max(8, Math.min(window.innerWidth * 0.025, 36));
  const maxTop = Math.max(220, pageHeight - mascotHeight - 180);

  const spots = [
    { left: gutter, top: pageHeight * 0.17 },
    { left: window.innerWidth - mascotWidth - gutter, top: pageHeight * 0.29 },
    { left: gutter, top: pageHeight * 0.44 },
    { left: window.innerWidth - mascotWidth - gutter, top: pageHeight * 0.58 },
    { left: gutter, top: pageHeight * 0.72 },
    { left: window.innerWidth - mascotWidth - gutter, top: pageHeight * 0.84 },
  ];

  let nextSpot;
  do {
    nextSpot = Math.floor(Math.random() * spots.length);
  } while (spots.length > 1 && nextSpot === lastSpot);

  lastSpot = nextSpot;
  const spot = spots[nextSpot];
  sleepyFriend.style.left = `${Math.max(gutter, spot.left)}px`;
  sleepyFriend.style.top = `${Math.min(maxTop, Math.max(160, spot.top))}px`;

  if (animate) {
    sleepyFriend.classList.add("is-moving");
    window.setTimeout(() => sleepyFriend.classList.remove("is-moving"), 800);
  }
}

function schedulePlacement() {
  window.requestAnimationFrame(() => placeSleepyFriend(false));
}

window.addEventListener("load", schedulePlacement);
window.addEventListener("resize", schedulePlacement);
sleepyFriend?.addEventListener("click", () => placeSleepyFriend(true));

let ticking = false;
window.addEventListener(
  "scroll",
  () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(() => {
      const heroConsole = document.querySelector(".hero-console");
      if (heroConsole && window.innerWidth > 980) {
        heroConsole.style.transform = `translateY(${Math.min(window.scrollY * 0.035, 22)}px)`;
      }
      ticking = false;
    });
  },
  { passive: true },
);
