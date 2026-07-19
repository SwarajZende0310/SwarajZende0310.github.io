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

const labCanvas = document.getElementById("robot-lab-canvas");

if (labCanvas) {
  const context = labCanvas.getContext("2d");
  const columns = 25;
  const rows = 15;
  const cellWidth = labCanvas.width / columns;
  const cellHeight = labCanvas.height / rows;
  const home = { x: 2, y: 11 };
  const robot = { ...home };
  const labStartedAt = Date.now();
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const stepDuration = prefersReducedMotion ? 70 : 180;

  const stateElement = document.getElementById("lab-state");
  const positionElement = document.getElementById("lab-position");
  const pathElement = document.getElementById("lab-path");
  const batteryElement = document.getElementById("lab-battery");
  const batteryFill = document.getElementById("lab-battery-fill");
  const labToast = document.getElementById("lab-toast");
  const labClock = document.getElementById("lab-clock");
  const randomGoalButton = document.getElementById("lab-random-goal");
  const shuffleButton = document.getElementById("lab-shuffle");
  const homeButton = document.getElementById("lab-home");

  let battery = 100;
  let layoutIndex = 0;
  let obstacles = new Set();
  let activePath = [];
  let pathIndex = 0;
  let stepStarted = 0;
  let visualRobot = { ...robot };
  let goal = null;
  let robotState = "IDLE";
  let lastTelemetryUpdate = 0;

  const keyFor = (x, y) => `${x},${y}`;
  const sameCell = (a, b) => a.x === b.x && a.y === b.y;

  function addRack(target, x, y, width, height) {
    for (let row = y; row < y + height; row += 1) {
      for (let column = x; column < x + width; column += 1) {
        target.add(keyFor(column, row));
      }
    }
  }

  function createLayout(index) {
    const next = new Set();

    if (index % 3 === 0) {
      addRack(next, 5, 2, 3, 4);
      addRack(next, 5, 9, 3, 4);
      addRack(next, 11, 1, 3, 4);
      addRack(next, 11, 8, 3, 5);
      addRack(next, 17, 3, 4, 3);
      addRack(next, 17, 9, 4, 3);
    } else if (index % 3 === 1) {
      addRack(next, 4, 3, 6, 2);
      addRack(next, 4, 8, 6, 2);
      addRack(next, 4, 12, 6, 2);
      addRack(next, 14, 2, 2, 5);
      addRack(next, 14, 10, 2, 4);
      addRack(next, 19, 5, 4, 2);
      addRack(next, 19, 10, 4, 2);
    } else {
      addRack(next, 3, 2, 4, 2);
      addRack(next, 9, 2, 4, 2);
      addRack(next, 16, 2, 5, 2);
      addRack(next, 5, 7, 4, 3);
      addRack(next, 12, 6, 3, 5);
      addRack(next, 18, 7, 4, 3);
      addRack(next, 3, 12, 7, 2);
      addRack(next, 17, 12, 5, 2);
    }

    next.delete(keyFor(home.x, home.y));
    next.delete(keyFor(robot.x, robot.y));
    return next;
  }

  function reconstructPath(cameFrom, current) {
    const result = [current];
    let currentKey = keyFor(current.x, current.y);

    while (cameFrom.has(currentKey)) {
      const previous = cameFrom.get(currentKey);
      result.unshift(previous);
      currentKey = keyFor(previous.x, previous.y);
    }

    return result;
  }

  function findPath(start, destination) {
    const open = [{ ...start, score: 0 }];
    const cameFrom = new Map();
    const gScore = new Map([[keyFor(start.x, start.y), 0]]);
    const closed = new Set();

    while (open.length) {
      open.sort((a, b) => a.score - b.score);
      const current = open.shift();
      const currentKey = keyFor(current.x, current.y);

      if (closed.has(currentKey)) continue;
      if (sameCell(current, destination)) {
        return reconstructPath(cameFrom, {
          x: current.x,
          y: current.y,
        });
      }

      closed.add(currentKey);
      const neighbors = [
        { x: current.x + 1, y: current.y },
        { x: current.x - 1, y: current.y },
        { x: current.x, y: current.y + 1 },
        { x: current.x, y: current.y - 1 },
      ];

      neighbors.forEach((neighbor) => {
        if (
          neighbor.x < 0 ||
          neighbor.y < 0 ||
          neighbor.x >= columns ||
          neighbor.y >= rows ||
          obstacles.has(keyFor(neighbor.x, neighbor.y)) ||
          closed.has(keyFor(neighbor.x, neighbor.y))
        ) {
          return;
        }

        const neighborKey = keyFor(neighbor.x, neighbor.y);
        const tentativeScore = (gScore.get(currentKey) ?? Infinity) + 1;
        if (tentativeScore >= (gScore.get(neighborKey) ?? Infinity)) return;

        cameFrom.set(neighborKey, { x: current.x, y: current.y });
        gScore.set(neighborKey, tentativeScore);
        const heuristic =
          Math.abs(neighbor.x - destination.x) +
          Math.abs(neighbor.y - destination.y);
        open.push({ ...neighbor, score: tentativeScore + heuristic });
      });
    }

    return [];
  }

  function setLabMessage(message, alert = false) {
    if (!labToast) return;
    labToast.textContent = message;
    labToast.classList.toggle("is-alert", alert);
  }

  function setRobotState(nextState) {
    robotState = nextState;
    if (stateElement) stateElement.textContent = nextState;
  }

  function updateTelemetry(force = false) {
    const now = performance.now();
    if (!force && now - lastTelemetryUpdate < 100) return;
    lastTelemetryUpdate = now;

    if (positionElement) {
      positionElement.textContent = `${String(robot.x).padStart(2, "0")}, ${String(robot.y).padStart(2, "0")}`;
    }
    if (pathElement) {
      const remaining = Math.max(0, activePath.length - pathIndex - 1);
      pathElement.textContent = activePath.length ? `${remaining} cells` : "—";
    }
    if (batteryElement) batteryElement.textContent = Math.round(battery);
    if (batteryFill) {
      batteryFill.style.width = `${battery}%`;
      batteryFill.style.background =
        battery < 20 ? "#ff5b35" : battery < 45 ? "#83ddd0" : "#e6ff58";
    }
  }

  function planMission(destination, missionName = "Mission accepted") {
    if (obstacles.has(keyFor(destination.x, destination.y))) {
      setLabMessage("Goal rejected: that cell is occupied by a rack.", true);
      return false;
    }

    if (battery < 4 && !sameCell(destination, home)) {
      setLabMessage("Mission rejected: battery critical. Send Zippy home.", true);
      setRobotState("LOW BATTERY");
      return false;
    }

    const path = findPath(robot, destination);
    if (!path.length) {
      setLabMessage("No collision-free route found. Try another cell.", true);
      setRobotState("NO PATH");
      return false;
    }

    goal = { ...destination };
    activePath = path;
    pathIndex = 0;
    stepStarted = performance.now();
    visualRobot = { ...robot };
    setRobotState(path.length === 1 ? "ARRIVED" : "NAVIGATING");
    setLabMessage(
      `${missionName} · ${Math.max(0, path.length - 1)} cells · A* solved`,
    );
    updateTelemetry(true);
    return true;
  }

  function randomFreeCell() {
    const freeCells = [];
    for (let y = 0; y < rows; y += 1) {
      for (let x = 0; x < columns; x += 1) {
        const cell = { x, y };
        if (!obstacles.has(keyFor(x, y)) && !sameCell(cell, robot)) {
          freeCells.push(cell);
        }
      }
    }
    return freeCells[Math.floor(Math.random() * freeCells.length)];
  }

  function drawRoundedRect(x, y, width, height, radius) {
    context.beginPath();
    context.roundRect(x, y, width, height, radius);
  }

  function drawWarehouse(timestamp) {
    context.clearRect(0, 0, labCanvas.width, labCanvas.height);
    context.fillStyle = "#122023";
    context.fillRect(0, 0, labCanvas.width, labCanvas.height);

    context.strokeStyle = "rgba(131, 221, 208, 0.10)";
    context.lineWidth = 1;
    for (let x = 0; x <= columns; x += 1) {
      context.beginPath();
      context.moveTo(x * cellWidth, 0);
      context.lineTo(x * cellWidth, labCanvas.height);
      context.stroke();
    }
    for (let y = 0; y <= rows; y += 1) {
      context.beginPath();
      context.moveTo(0, y * cellHeight);
      context.lineTo(labCanvas.width, y * cellHeight);
      context.stroke();
    }

    const homeX = home.x * cellWidth;
    const homeY = home.y * cellHeight;
    context.fillStyle = "rgba(230, 255, 88, 0.12)";
    context.fillRect(homeX, homeY, cellWidth, cellHeight);
    context.strokeStyle = "#e6ff58";
    context.lineWidth = 2;
    context.strokeRect(
      homeX + 4,
      homeY + 4,
      cellWidth - 8,
      cellHeight - 8,
    );
    context.fillStyle = "#e6ff58";
    context.font = "bold 10px Courier New";
    context.fillText("CHG", homeX + 9, homeY + cellHeight - 10);

    obstacles.forEach((obstacleKey) => {
      const [x, y] = obstacleKey.split(",").map(Number);
      const drawX = x * cellWidth + 3;
      const drawY = y * cellHeight + 3;
      const width = cellWidth - 6;
      const height = cellHeight - 6;
      drawRoundedRect(drawX, drawY, width, height, 4);
      context.fillStyle = "#315c64";
      context.fill();
      context.strokeStyle = "rgba(131, 221, 208, 0.5)";
      context.lineWidth = 1;
      context.stroke();
      context.strokeStyle = "rgba(18, 32, 35, 0.42)";
      context.beginPath();
      context.moveTo(drawX + 7, drawY + 6);
      context.lineTo(drawX + width - 7, drawY + height - 6);
      context.stroke();
    });

    if (activePath.length > 1) {
      context.beginPath();
      activePath.slice(pathIndex).forEach((cell, index) => {
        const x = (cell.x + 0.5) * cellWidth;
        const y = (cell.y + 0.5) * cellHeight;
        if (index === 0) context.moveTo(x, y);
        else context.lineTo(x, y);
      });
      context.strokeStyle = "rgba(230, 255, 88, 0.8)";
      context.lineWidth = 3;
      context.setLineDash([7, 7]);
      context.stroke();
      context.setLineDash([]);
    }

    if (goal) {
      const goalX = (goal.x + 0.5) * cellWidth;
      const goalY = (goal.y + 0.5) * cellHeight;
      const pulseRadius = 10 + Math.sin(timestamp / 220) * 4;
      context.beginPath();
      context.arc(goalX, goalY, pulseRadius, 0, Math.PI * 2);
      context.strokeStyle = "#ff5b35";
      context.lineWidth = 3;
      context.stroke();
      context.beginPath();
      context.arc(goalX, goalY, 3, 0, Math.PI * 2);
      context.fillStyle = "#ff5b35";
      context.fill();
    }

    const centerX = (visualRobot.x + 0.5) * cellWidth;
    const centerY = (visualRobot.y + 0.5) * cellHeight;
    context.save();
    context.translate(centerX, centerY);
    context.beginPath();
    context.arc(0, 0, 22, 0, Math.PI * 2);
    context.fillStyle = "rgba(131, 221, 208, 0.1)";
    context.fill();
    context.strokeStyle = "rgba(131, 221, 208, 0.45)";
    context.lineWidth = 1;
    context.stroke();

    drawRoundedRect(-14, -11, 28, 24, 5);
    context.fillStyle = "#ff5b35";
    context.fill();
    context.strokeStyle = "#f3efe5";
    context.lineWidth = 2;
    context.stroke();
    context.fillStyle = "#182527";
    context.fillRect(-11, -15, 22, 6);
    context.beginPath();
    context.arc(0, -17, 5, 0, Math.PI * 2);
    context.fillStyle = "#e6ff58";
    context.fill();
    context.fillStyle = "#182527";
    context.fillRect(-18, -7, 5, 14);
    context.fillRect(13, -7, 5, 14);
    context.fillStyle = "#f3efe5";
    context.font = "bold 9px Arial";
    context.textAlign = "center";
    context.fillText("SZ", 0, 5);
    context.restore();
  }

  function animateLab(timestamp) {
    if (activePath.length > 1 && pathIndex < activePath.length - 1) {
      const from = activePath[pathIndex];
      const to = activePath[pathIndex + 1];
      const progress = Math.min(1, (timestamp - stepStarted) / stepDuration);
      const eased = 1 - (1 - progress) ** 3;
      visualRobot = {
        x: from.x + (to.x - from.x) * eased,
        y: from.y + (to.y - from.y) * eased,
      };

      if (progress >= 1) {
        robot.x = to.x;
        robot.y = to.y;
        visualRobot = { ...robot };
        pathIndex += 1;
        stepStarted = timestamp;
        battery = Math.max(0, battery - 0.34);

        if (pathIndex >= activePath.length - 1) {
          activePath = [];
          pathIndex = 0;
          if (sameCell(robot, home)) {
            setRobotState("CHARGING");
            setLabMessage("Docked successfully. Charging Zippy.");
          } else {
            setRobotState("ARRIVED");
            setLabMessage("Goal reached within simulation tolerance.");
          }
        }
        updateTelemetry(true);
      }
    } else if (robotState === "CHARGING") {
      battery = Math.min(100, battery + 0.09);
      if (battery >= 100) {
        setRobotState("READY");
        setLabMessage("Charge complete. Zippy is mission-ready.");
      }
      updateTelemetry();
    }

    drawWarehouse(timestamp);
    window.requestAnimationFrame(animateLab);
  }

  function canvasCellFromEvent(event) {
    const bounds = labCanvas.getBoundingClientRect();
    return {
      x: Math.min(
        columns - 1,
        Math.max(
          0,
          Math.floor(
            ((event.clientX - bounds.left) / bounds.width) * columns,
          ),
        ),
      ),
      y: Math.min(
        rows - 1,
        Math.max(
          0,
          Math.floor(((event.clientY - bounds.top) / bounds.height) * rows),
        ),
      ),
    };
  }

  labCanvas.addEventListener("pointerdown", (event) => {
    planMission(canvasCellFromEvent(event), "Custom goal");
  });

  labCanvas.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      planMission(randomFreeCell(), "Keyboard mission");
    }
  });

  randomGoalButton?.addEventListener("click", () => {
    planMission(randomFreeCell(), "Random mission");
  });

  shuffleButton?.addEventListener("click", () => {
    layoutIndex = (layoutIndex + 1) % 3;
    obstacles = createLayout(layoutIndex);
    activePath = [];
    goal = null;
    setRobotState("MAP UPDATED");
    setLabMessage(`Rack layout 0${layoutIndex + 1} loaded. Awaiting mission.`);
    updateTelemetry(true);
  });

  homeButton?.addEventListener("click", () => {
    planMission(home, "Return-to-charge");
  });

  window.setInterval(() => {
    if (!labClock) return;
    const elapsed = Math.floor((Date.now() - labStartedAt) / 1000);
    const minutes = String(Math.floor(elapsed / 60)).padStart(2, "0");
    const seconds = String(elapsed % 60).padStart(2, "0");
    labClock.textContent = `T+ ${minutes}:${seconds}`;
  }, 1000);

  obstacles = createLayout(layoutIndex);
  updateTelemetry(true);
  window.requestAnimationFrame(animateLab);
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
