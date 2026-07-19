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

const pixelPets = [...document.querySelectorAll(".pixel-pet")];
const petAnchors = [
  { side: "left", progress: 0.12 },
  { side: "right", progress: 0.22 },
  { side: "left", progress: 0.35 },
  { side: "right", progress: 0.48 },
  { side: "left", progress: 0.62 },
  { side: "right", progress: 0.75 },
  { side: "left", progress: 0.86 },
  { side: "right", progress: 0.93 },
];

function shuffledAnchors() {
  return petAnchors
    .map((anchor, index) => ({ ...anchor, index, order: Math.random() }))
    .sort((a, b) => a.order - b.order);
}

function movePetTo(pet, anchor, animate = false) {
  const pageHeight = document.documentElement.scrollHeight;
  const petWidth = pet.offsetWidth || 150;
  const petHeight = pet.offsetHeight || 100;
  const gutter = Math.max(5, Math.min(window.innerWidth * 0.018, 26));
  const maxTop = Math.max(220, pageHeight - petHeight - 150);
  const left =
    anchor.side === "left"
      ? gutter
      : window.innerWidth - petWidth - gutter;

  pet.dataset.slot = String(anchor.index);
  pet.style.left = `${Math.max(gutter, left)}px`;
  pet.style.top = `${Math.min(maxTop, Math.max(170, pageHeight * anchor.progress))}px`;

  if (animate) {
    pet.classList.add("is-moving");
    window.setTimeout(() => pet.classList.remove("is-moving"), 800);
  }
}

function placePixelPets() {
  if (!pixelPets.length) return;
  const anchors = shuffledAnchors();
  pixelPets.forEach((pet, index) => movePetTo(pet, anchors[index], false));
}

function relocatePet(pet) {
  const occupied = new Set(
    pixelPets
      .filter((otherPet) => otherPet !== pet)
      .map((otherPet) => Number(otherPet.dataset.slot)),
  );
  const available = shuffledAnchors().filter(
    (anchor) =>
      !occupied.has(anchor.index) &&
      anchor.index !== Number(pet.dataset.slot),
  );
  movePetTo(pet, available[0] || shuffledAnchors()[0], true);
}

window.addEventListener("load", () => {
  window.requestAnimationFrame(placePixelPets);
});

let resizeTimer;
window.addEventListener("resize", () => {
  window.clearTimeout(resizeTimer);
  resizeTimer = window.setTimeout(placePixelPets, 120);
});

pixelPets.forEach((pet) => {
  pet.addEventListener("click", () => relocatePet(pet));
});

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
