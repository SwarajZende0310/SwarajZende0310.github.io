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
const petToast = document.getElementById("pet-toast");
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

const petMessages = {
  "route-12": [
    "Route 12 remains closed for scheduled napping.",
    "Snorlax used Rest. It was extremely effective.",
    "Road-blocking certification: renewed.",
  ],
  "berry-nap": [
    "Oran Berry consumed. Nap protocol resumed.",
    "Daily snack target: approximately 880 lb.",
    "No crumbs detected. No consciousness detected either.",
  ],
  "flute-nap": [
    "A Poké Flute may be required here.",
    "Snorlax heard you. Snorlax chose sleep.",
    "Current move: Rest. Remaining turns: unknown.",
  ],
};

let toastTimer;
function showPetToast(message) {
  if (!petToast) return;
  petToast.textContent = message;
  petToast.classList.add("is-visible");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(
    () => petToast.classList.remove("is-visible"),
    2600,
  );
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
  pet.addEventListener("click", () => {
    relocatePet(pet);
    pet.classList.add("is-booped");
    window.setTimeout(() => pet.classList.remove("is-booped"), 520);
    const messages = petMessages[pet.dataset.pet] || ["Zzz…"];
    showPetToast(messages[Math.floor(Math.random() * messages.length)]);
  });
});

const pandaWorkstation = document.querySelector(".panda-workstation");
const pandaAction = document.getElementById("panda-action");
const pandaLog = document.getElementById("panda-log");
const pandaStateText = document.getElementById("panda-state-text");

const pandaStates = [
  {
    id: "coding",
    label: "CODING",
    action: "Check energy",
    aria: "Patch the coding panda is focused and still writing code.",
    log:
      "&gt; compiling one_last_fix.cpp<br />&gt; energy: 64%<br />&gt; bedtime: postponed_",
  },
  {
    id: "drained",
    label: "DRAINED",
    action: "Send to bed",
    aria: "Patch the coding panda is exhausted and should go to sleep.",
    log:
      "&gt; tests: 47/48<br />&gt; energy: 08%<br />&gt; cognitive load: critical_",
  },
  {
    id: "sleeping",
    label: "SLEEPING",
    action: "Wake with coffee",
    aria: "Patch the coding panda is asleep beside the laptop.",
    log:
      "&gt; build: paused<br />&gt; energy: recharging<br />&gt; developer: zZz_",
  },
];

let pandaStateIndex = 0;
let pandaAutoTimer;

function setPandaState(index, announce = true) {
  if (!pandaWorkstation || !pandaAction || !pandaLog || !pandaStateText) return;
  pandaStateIndex = index % pandaStates.length;
  const state = pandaStates[pandaStateIndex];

  pandaWorkstation.dataset.pandaState = state.id;
  pandaWorkstation.setAttribute(
    "aria-label",
    `${state.aria} Activate to change his state.`,
  );
  pandaStateText.textContent = state.label;
  pandaAction.firstChild.textContent = `${state.action} `;
  pandaLog.innerHTML = state.log;

  if (announce) {
    showPetToast(`PATCH_STATUS: ${state.label.toLowerCase()}`);
  }

  window.clearTimeout(pandaAutoTimer);
  if (state.id !== "sleeping") {
    pandaAutoTimer = window.setTimeout(
      () => setPandaState(pandaStateIndex + 1, true),
      7000,
    );
  }
}

function advancePanda() {
  setPandaState(pandaStateIndex + 1, true);
}

pandaAction?.addEventListener("click", advancePanda);
pandaWorkstation?.addEventListener("click", advancePanda);
pandaWorkstation?.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    advancePanda();
  }
});

if (pandaWorkstation) {
  pandaAutoTimer = window.setTimeout(() => setPandaState(1, true), 7000);
}

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
