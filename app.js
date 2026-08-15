const COURSE =
  "https://www.udemy.com/course/spring-boot-and-spring-framework-tutorial-for-beginners/";

const CONFIG = window.POA_CONFIG || {};
const ALLOWED_EMAIL = (CONFIG.allowedEmail || "sachinbaghele2018@gmail.com")
  .trim()
  .toLowerCase();
const CLIENT_ID = (CONFIG.googleClientId || "").trim();
const CLIENT_ID_READY =
  CLIENT_ID && !CLIENT_ID.startsWith("PASTE_GOOGLE_CLIENT_ID");
const SESSION_KEY = "spring-poa-session";
const STORAGE_KEY = "spring-poa-v1";
const LEARN_HOURS = "4h video + 3h code";

const DAYS = [
  {
    id: "d1",
    day: "Day 1",
    pct: "10%",
    theme: "Spring Framework basics",
    sections:
      "Getting Started; Maven project; Gaming app; Loose coupling; IoC, DI, first beans",
    outcome: "Explain why Spring exists; create and wire beans",
    hours: LEARN_HOURS,
    kind: "learn",
  },
  {
    id: "d2",
    day: "Day 2",
    pct: "20%",
    theme: "Spring core deep dive + Maven",
    sections:
      "Bean scopes, lazy/eager, lifecycle, stereotypes; Maven pom, lifecycle, parent POM",
    outcome: "Use Spring annotations correctly; build with Maven",
    hours: LEARN_HOURS,
    kind: "learn",
  },
  {
    id: "d3",
    day: "Day 3",
    pct: "30%",
    theme: "Spring Boot",
    sections:
      "Initializr, starters, auto-config, DevTools, profiles, Actuator, embedded server",
    outcome: "Bootstrap a Spring Boot app and explain the magic",
    hours: LEARN_HOURS,
    kind: "learn",
  },
  {
    id: "d4",
    day: "Day 4",
    pct: "40%",
    theme: "JPA / Hibernate + start web app",
    sections:
      "JDBC, JPA, Spring Data JPA, H2; first Spring MVC controllers and JSP views",
    outcome: "Persist data; show first MVC screens",
    hours: LEARN_HOURS,
    kind: "learn",
  },
  {
    id: "d5",
    day: "Day 5",
    pct: "50%",
    theme: "Todo web application",
    sections:
      "CRUD todos, validation, Bootstrap, session; Spring Security login; H2/JPA",
    outcome: "Working Todo web app with login and database",
    hours: LEARN_HOURS,
    kind: "learn",
  },
  {
    id: "d6",
    day: "Day 6",
    pct: "60%",
    theme: "REST API",
    sections:
      "CRUD REST, exceptions, validation, Swagger, versioning, HATEOAS, JPA relations",
    outcome: "Production-style REST API with error handling",
    hours: LEARN_HOURS,
    kind: "learn",
  },
  {
    id: "d7",
    day: "Day 7",
    pct: "70%",
    theme: "AOP, Gradle, Docker, JUnit",
    sections:
      "AOP aspects and pointcuts; Gradle vs Maven; Dockerize Spring Boot; JUnit basics",
    outcome: "Cross-cutting concerns, container, and unit tests",
    hours: LEARN_HOURS,
    kind: "learn",
  },
  {
    id: "d8",
    day: "Day 8",
    pct: "80%",
    theme: "React frontend",
    sections:
      "React setup, components, state, Todo UI, routing, auth context, protected routes",
    outcome: "React Todo frontend with login flow",
    hours: LEARN_HOURS,
    kind: "learn",
  },
  {
    id: "d9",
    day: "Day 9",
    pct: "90%",
    theme: "Full stack + Mockito",
    sections:
      "CORS, Axios, CRUD via API, JWT; connect JPA/MySQL; Mockito mocks",
    outcome: "Full stack Todo app talking to Spring Boot",
    hours: LEARN_HOURS,
    kind: "learn",
  },
  {
    id: "d10",
    day: "Day 10",
    pct: "100%",
    theme: "Spring Security + AWS",
    sections:
      "Form/Basic/JWT/OAuth, CSRF/CORS, bcrypt; EC2, Beanstalk, RDS, S3 deploy",
    outcome: "Secure the app and deploy to AWS",
    hours: LEARN_HOURS,
    kind: "learn",
  },
  {
    id: "d11",
    day: "Day 11",
    pct: "Buffer",
    theme: "Catch-up",
    sections: "Finish leftover lectures; rewatch weak topics; polish projects",
    outcome: "Course complete or gaps closed",
    hours: "As needed",
    kind: "buffer",
  },
  {
    id: "d12",
    day: "Day 12",
    pct: "Buffer",
    theme: "Demo + recap",
    sections:
      "Run Todo web, REST API, and full stack demos; write notes; manager recap",
    outcome: "Ready to demo and report completion",
    hours: "As needed",
    kind: "buffer",
  },
];

function loadState() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch {
    return {};
  }
}

function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function parseJwt(token) {
  const part = token.split(".")[1];
  const base64 = part.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
  return JSON.parse(atob(padded));
}

function loadSession() {
  try {
    const session = JSON.parse(sessionStorage.getItem(SESSION_KEY));
    if (!session?.email || !session.exp) return null;
    if (session.exp * 1000 < Date.now()) {
      sessionStorage.removeItem(SESSION_KEY);
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

function saveSession(session) {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

function canEdit() {
  const session = loadSession();
  return Boolean(session && session.email === ALLOWED_EMAIL);
}

function formatDate(date) {
  return date.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function isWeekend(date) {
  const day = date.getDay();
  return day === 0 || day === 6;
}

function nextWeekday(date) {
  const next = new Date(date);
  while (isWeekend(next)) {
    next.setDate(next.getDate() + 1);
  }
  return next;
}

function addWeekdays(start, offset) {
  const date = nextWeekday(new Date(start));
  let added = 0;
  while (added < offset) {
    date.setDate(date.getDate() + 1);
    if (!isWeekend(date)) added += 1;
  }
  return date;
}

function weekendRange(fromDate, toDate) {
  const holidays = [];
  const cursor = new Date(fromDate);
  cursor.setDate(cursor.getDate() + 1);
  while (cursor < toDate) {
    if (isWeekend(cursor)) holidays.push(new Date(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }
  return holidays;
}

function appendHoliday(list, holidays) {
  if (!holidays.length) return;
  const article = document.createElement("article");
  article.className = "holiday";
  const first = holidays[0];
  const last = holidays[holidays.length - 1];
  const label =
    first.getTime() === last.getTime()
      ? formatDate(first)
      : `${formatDate(first)} – ${formatDate(last)}`;
  article.innerHTML = `
    <strong>Holiday</strong>
    <p>${label} · Saturday and Sunday off — no course work</p>
  `;
  list.appendChild(article);
}

function currentDayIndex(done) {
  const firstOpen = DAYS.findIndex((day) => !done[day.id]);
  return firstOpen === -1 ? 11 : firstOpen;
}

function progressSnapshot() {
  const done = loadState().done || {};
  const learnDone = DAYS.filter((d) => d.kind === "learn" && done[d.id]).length;
  const bufferDone = DAYS.filter((d) => d.kind === "buffer" && done[d.id]).length;
  const pct = learnDone * 10;
  const current = DAYS[currentDayIndex(done)];
  return { done, learnDone, bufferDone, pct, current };
}

function notifyProgress(title, body) {
  const toast = document.getElementById("toast");
  toast.hidden = false;
  toast.querySelector(".toast-title").textContent = title;
  toast.querySelector(".toast-body").textContent = body;
  clearTimeout(notifyProgress._timer);
  notifyProgress._timer = setTimeout(() => {
    toast.hidden = true;
  }, 4500);

  if ("Notification" in window && Notification.permission === "granted") {
    new Notification(title, { body });
  }
}

function showCurrentProgress() {
  const { pct, learnDone, bufferDone, current } = progressSnapshot();
  const extra = bufferDone
    ? ` · ${bufferDone} buffer day${bufferDone === 2 ? "s" : ""} used`
    : "";
  notifyProgress(
    `Progress: ${pct}%`,
    `${learnDone} of 10 learning days complete${extra}. Next: ${current.day} — ${current.theme}.`,
  );
}

function setLoginError(message) {
  const el = document.getElementById("login-error");
  el.hidden = !message;
  el.textContent = message || "";
}

function setModalOpen(open) {
  document.getElementById("login-modal").hidden = !open;
  if (open) {
    setLoginError("");
    renderGoogleButton();
  }
}

function whenGoogleReady(callback) {
  if (window.google?.accounts?.id) {
    callback();
    return;
  }
  let tries = 0;
  const timer = setInterval(() => {
    tries += 1;
    if (window.google?.accounts?.id) {
      clearInterval(timer);
      callback();
    } else if (tries > 80) {
      clearInterval(timer);
    }
  }, 50);
}

function handleCredential(response) {
  try {
    const payload = parseJwt(response.credential);
    if (CLIENT_ID_READY && payload.aud !== CLIENT_ID) {
      throw new Error("Google token does not match this site.");
    }
    if (payload.exp * 1000 < Date.now()) {
      throw new Error("Google session expired. Sign in again.");
    }
    const email = String(payload.email || "").toLowerCase();
    const session = {
      email,
      name: payload.name || "",
      picture: payload.picture || "",
      exp: payload.exp,
    };
    saveSession(session);
    setModalOpen(false);
    render();

    if (email !== ALLOWED_EMAIL) {
      notifyProgress(
        "View only",
        `${email} can view the plan. Only ${ALLOWED_EMAIL} can tick days and update progress.`,
      );
      return;
    }

    notifyProgress("Signed in", "You can tick days and update progress.");
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  } catch (error) {
    setLoginError(error.message || "Sign-in failed.");
  }
}

function renderGoogleButton() {
  const holder = document.getElementById("google-btn");
  const setup = document.getElementById("setup-box");
  holder.innerHTML = "";
  if (!CLIENT_ID_READY) {
    setup.hidden = false;
    return;
  }
  setup.hidden = true;
  whenGoogleReady(() => {
    window.google.accounts.id.initialize({
      client_id: CLIENT_ID,
      callback: handleCredential,
      auto_select: false,
      ux_mode: "popup",
    });
    window.google.accounts.id.renderButton(holder, {
      theme: "outline",
      size: "large",
      text: "signin_with",
      shape: "rectangular",
      width: 280,
    });
  });
}

function signOut() {
  sessionStorage.removeItem(SESSION_KEY);
  if (window.google?.accounts?.id) {
    window.google.accounts.id.disableAutoSelect();
  }
  render();
  notifyProgress("Signed out", "Progress is locked until you sign in again.");
}

function renderAuth() {
  const session = loadSession();
  const editor = canEdit();
  const chip = document.getElementById("user-chip");
  const signIn = document.getElementById("sign-in");
  const banner = document.getElementById("view-banner");
  const nameInput = document.getElementById("learner-name");
  const startInput = document.getElementById("start-date");

  nameInput.disabled = !editor;
  startInput.disabled = !editor;

  if (session) {
    chip.hidden = false;
    signIn.hidden = true;
    document.getElementById("user-email").textContent = session.email;
    const photo = document.getElementById("user-photo");
    photo.src = session.picture || "";
    photo.hidden = !session.picture;
  } else {
    chip.hidden = true;
    signIn.hidden = false;
  }

  if (editor) {
    banner.hidden = true;
  } else if (session) {
    banner.hidden = false;
    banner.textContent = `Signed in as ${session.email}. View only — ${ALLOWED_EMAIL} can update progress.`;
  } else {
    banner.hidden = false;
    banner.textContent = `View only. Sign in with Google as ${ALLOWED_EMAIL} to tick days and update progress.`;
  }
}

function render() {
  const state = loadState();
  const done = state.done || {};
  const editor = canEdit();
  const startValue = document.getElementById("start-date").value;
  const start = startValue ? new Date(`${startValue}T00:00:00`) : null;
  const list = document.getElementById("day-list");
  list.innerHTML = "";

  DAYS.forEach((day, index) => {
    const article = document.createElement("article");
    article.className = `day${day.kind === "buffer" ? " buffer" : ""}${
      done[day.id] ? " done" : ""
    }`;
    const workDate = start ? addWeekdays(start, index) : null;
    const dateLabel = workDate ? formatDate(workDate) : "Date pending";
    article.innerHTML = `
      <div class="day-mark">
        <strong>${day.day}</strong>
        <span class="pct">${day.pct}</span>
      </div>
      <div>
        <p class="date-chip">${dateLabel} · ${day.hours}</p>
        <h3>${day.theme}</h3>
        <p>${day.sections}</p>
        <p class="when"><strong>Done when:</strong> ${day.outcome}</p>
      </div>
      <label class="tick${editor ? "" : " locked"}">
        <input type="checkbox" data-id="${day.id}" ${done[day.id] ? "checked" : ""} ${
          editor ? "" : "disabled"
        } />
        Done
      </label>
    `;
    list.appendChild(article);
    if (start && index < DAYS.length - 1) {
      appendHoliday(list, weekendRange(workDate, addWeekdays(start, index + 1)));
    }
  });

  const { learnDone, bufferDone, pct } = progressSnapshot();
  document.getElementById("progress-value").textContent = `${pct}%`;
  document.getElementById("bar-learn").style.width = `${pct}%`;
  document.getElementById("bar-buffer").style.width = `${
    bufferDone === 0 ? 0 : Math.round((bufferDone / 12) * 100)
  }%`;
  document.getElementById("progress-bar").setAttribute("aria-valuenow", String(pct));
  document.getElementById("progress-note").textContent =
    `${learnDone} of 10 learning days complete` +
    (bufferDone ? ` · ${bufferDone} buffer day${bufferDone === 2 ? "s" : ""} used` : "");

  if (start) {
    const first = addWeekdays(start, 0);
    const last = addWeekdays(start, 11);
    const shifted = isWeekend(start)
      ? `Start date is a weekend, so Day 1 moves to ${formatDate(first)}. `
      : "";
    document.getElementById("date-window").textContent =
      `${shifted}${formatDate(first)} → ${formatDate(last)} · weekdays only (Sat–Sun holiday)`;
  } else {
    document.getElementById("date-window").textContent =
      "Set a start date to see calendar dates.";
  }

  const learner = document.getElementById("learner-name").value.trim() || "Sachin Baghele";
  const idx = currentDayIndex(done);
  const today = DAYS[idx];
  const dateLine = start ? formatDate(addWeekdays(start, idx)) : "Date TBC";
  const nextIdx = Math.min(idx + (done[today.id] ? 1 : 0), 11);
  const next = DAYS[nextIdx];
  let nextLine = `Tomorrow: ${next.day} — ${next.theme}`;
  if (start && nextIdx !== idx) {
    const gap = weekendRange(addWeekdays(start, idx), addWeekdays(start, nextIdx));
    if (gap.length) {
      nextLine = `Next working day (${formatDate(addWeekdays(start, nextIdx))}): ${next.day} — ${next.theme}`;
    }
  } else if (start && nextIdx === idx) {
    nextLine = `Today: ${next.day} — ${next.theme}`;
  }

  document.getElementById("update-text").textContent = `${learner} — Spring Boot / Spring Framework
Day ${idx + 1} of 12 (${pct}% complete) · ${dateLine}

Completed: ${today.theme}
Built / practised: ${today.outcome} (4h video + 3h coding)
Blocker: none
${nextLine}

Course: ${COURSE}`;

  renderAuth();
}

function persistField(key, value) {
  if (!canEdit()) return;
  const state = loadState();
  state[key] = value;
  saveState(state);
}

function init() {
  const state = loadState();
  const nameInput = document.getElementById("learner-name");
  const startInput = document.getElementById("start-date");

  if (state.learner) nameInput.value = state.learner;
  if (state.startDate) {
    startInput.value = state.startDate;
  } else {
    startInput.value = "2026-08-17";
    const seed = loadState();
    seed.startDate = startInput.value;
    saveState(seed);
  }

  nameInput.addEventListener("input", () => {
    persistField("learner", nameInput.value);
    render();
  });
  startInput.addEventListener("change", () => {
    persistField("startDate", startInput.value);
    render();
  });

  document.getElementById("day-list").addEventListener("click", (event) => {
    const label = event.target.closest(".tick");
    if (!label || canEdit()) return;
    event.preventDefault();
    setModalOpen(true);
    notifyProgress(
      "Sign in required",
      `Only ${ALLOWED_EMAIL} can tick days and update progress.`,
    );
  });

  document.getElementById("day-list").addEventListener("change", (event) => {
    const input = event.target;
    if (!(input instanceof HTMLInputElement) || !input.dataset.id) return;
    if (!canEdit()) {
      input.checked = Boolean(loadState().done?.[input.dataset.id]);
      setModalOpen(true);
      return;
    }
    const next = loadState();
    next.done = next.done || {};
    next.done[input.dataset.id] = input.checked;
    saveState(next);
    render();
    const day = DAYS.find((item) => item.id === input.dataset.id);
    const { pct, learnDone } = progressSnapshot();
    notifyProgress(
      input.checked ? `${day.day} complete` : `${day.day} unmarked`,
      `Progress is now ${pct}%. ${learnDone} of 10 learning days done.`,
    );
  });

  document.getElementById("show-progress").addEventListener("click", () => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission().finally(showCurrentProgress);
      return;
    }
    showCurrentProgress();
  });

  document.getElementById("copy-update").addEventListener("click", async () => {
    const text = document.getElementById("update-text").textContent;
    await navigator.clipboard.writeText(text);
    const button = document.getElementById("copy-update");
    button.textContent = "Copied";
    notifyProgress("Update copied", "Paste this into your daily message to your manager.");
    setTimeout(() => {
      button.textContent = "Copy update";
    }, 1600);
  });

  document.getElementById("sign-in").addEventListener("click", () => setModalOpen(true));
  document.getElementById("sign-out").addEventListener("click", signOut);
  document.getElementById("view-only").addEventListener("click", () => setModalOpen(false));

  render();
  if (!loadSession()) {
    setModalOpen(true);
  } else {
    renderGoogleButton();
  }
}

init();
