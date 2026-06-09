const DAY_MS = 86_400_000;
const PLAN_START = "2026-06-10";
const PLAN_END = "2026-10-30";

const scenarioDetails = {
  pending: {
    title: "Awaiting Census offer",
    description: "Both paths are ready. Keep the plan flexible until the Census offer is confirmed.",
    decision: "Wait for Census job offer confirmation",
    milestone: "DCS last day · 3 July",
    milestoneNote: "Once the Census offer is confirmed",
    calendarNote: "Pending view shows Plan A from 6 July as the working plan. Switch scenarios above to compare.",
  },
  "plan-a": {
    title: "Plan A · Census offer comes",
    description: "Finish DCS, keep Avance on Mondays and Wednesdays, and work Census through 1 October.",
    decision: "Confirm Census start requirements for Thursday, 9 July",
    milestone: "Census ends · 1 October",
    milestoneNote: "Then transition into Avance 0.8",
    calendarNote: "Plan A keeps Avance on Monday and Wednesday, with Census Thursday to Saturday and optional Sunday afternoons.",
  },
  "plan-b": {
    title: "Plan B · No Census offer",
    description: "Stay at DCS through 17 July, then move directly into the Avance 0.8 weekly rhythm.",
    decision: "Confirm DCS last day and Avance 0.8 start",
    milestone: "Avance 0.8 · 20 July",
    milestoneNote: "After DCS finishes on Friday, 17 July",
    calendarNote: "Plan B keeps DCS through 17 July, then begins Avance 0.8 from Monday, 20 July.",
  },
};

const decisions = [
  {
    title: "Receive Census answer",
    description: "Keep both paths open until the job offer is confirmed.",
  },
  {
    title: "Confirm DCS last day",
    description: "Plan A: 3 July. Plan B: 17 July.",
  },
  {
    title: "Let Andy know",
    description: "Give Andy clear dates so flights and Avance time can be arranged.",
  },
  {
    title: "Lock the new rhythm",
    description: "Protect Tuesdays and keep Sunday mornings anchored.",
  },
];

const phases = [
  {
    label: "Phase 1",
    dates: "10 Jun – 5 Jul",
    title: "Finish DCS well",
    description: "Avance on Monday and Wednesday, DCS on Thursday and Friday, with weekends protected.",
    focus: "Focus: clarity before commitments",
    color: "#345878",
  },
  {
    label: "Phase 2",
    dates: "6 – 12 Jul",
    title: "Starting week",
    description: "Andy is in town and Census may begin. Thursday, 9 July needs deliberate handling.",
    focus: "Focus: avoid double-booking",
    color: "#b96c4c",
  },
  {
    label: "Phase 3",
    dates: "13 Jul – 1 Oct",
    title: "Census rhythm",
    description: "Plan A balances Avance and Census. Plan B moves from DCS into Avance 0.8.",
    focus: "Focus: protect recovery time",
    color: "#d4a552",
  },
  {
    label: "Phase 4",
    dates: "From 2 Oct",
    title: "Settle into Avance 0.8",
    description: "Monday, Wednesday, Thursday and Friday at Avance, with Tuesday still protected.",
    focus: "Focus: a sustainable long-term week",
    color: "#287c72",
  },
];

const milestones = {
  pending: [
    { date: "2026-07-03", title: "DCS last day" },
    { date: "2026-07-09", title: "Census proposed start" },
    { date: "2026-10-01", title: "Final Census day" },
  ],
  "plan-a": [
    { date: "2026-07-03", title: "DCS last day" },
    { date: "2026-07-09", title: "Census starts" },
    { date: "2026-10-01", title: "Final Census day" },
  ],
  "plan-b": [
    { date: "2026-07-17", title: "DCS last day" },
    { date: "2026-07-20", title: "Avance 0.8 begins" },
  ],
};

const dateFromISO = (iso) => new Date(`${iso}T12:00:00`);
const toISO = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};
const addDays = (date, count) => new Date(date.getTime() + count * DAY_MS);
const isBetween = (iso, start, end) => iso >= start && iso <= end;
const formatLongDate = (iso) =>
  dateFromISO(iso).toLocaleDateString("en-AU", { weekday: "long", day: "numeric", month: "long" });
const getNotes = () => JSON.parse(localStorage.getItem("work-planner-notes") || "{}");
const escapeHTML = (value) =>
  value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");

function event(type, title, detail = "") {
  return { type, title, detail };
}

function baseEventForDate(iso) {
  const date = dateFromISO(iso);
  const day = date.getDay();

  if (day === 2) return event("off", "Protected day off", "Appointments · admin · recovery");
  if (day === 6) return event("off", "Off / family", "Protected family time");
  if (day === 0) return event("church", "Church morning / rest", "Sunday morning anchor");
  return null;
}

function getCommonEvent(iso) {
  if (isBetween(iso, "2026-06-10", "2026-07-05")) {
    const day = dateFromISO(iso).getDay();
    if (day === 1 || day === 3) return event("avance", "Avance", "Regular Avance day");
    if (day === 4 || day === 5) return event("dcs", "DCS", "Regular DCS day");
    return baseEventForDate(iso);
  }

  return null;
}

function getPlanAEvent(iso) {
  if (iso === "2026-07-06" || iso === "2026-07-08") return event("avance", "Avance · Andy in town", "Coordinate time with Andy");
  if (iso === "2026-07-09") return event("transition", "Census starts / possible Avance", "Keep clear until onboarding requirements are confirmed");
  if (iso === "2026-10-01") return event("census", "Final Census day", "Census period concludes");
  if (iso === "2026-10-02") return event("transition", "Avance transition day", "Admin or begin 0.8 if needed");

  if (isBetween(iso, "2026-07-10", "2026-10-01")) {
    const day = dateFromISO(iso).getDay();
    if (day === 1 || day === 3) return event("avance", "Avance", "Regular Avance day");
    if (day === 4 || day === 5 || day === 6) return event("census", "Census", "Regular Census day");
    if (day === 0) return event("church", "Church AM / Census PM", "Census afternoon only if needed");
    return baseEventForDate(iso);
  }

  if (isBetween(iso, "2026-10-02", PLAN_END)) return getAvance08Event(iso);
  return baseEventForDate(iso);
}

function getPlanBEvent(iso) {
  if (iso === "2026-07-17") return event("dcs", "DCS last day", "Plan B milestone");

  if (isBetween(iso, "2026-07-06", "2026-07-19")) {
    const day = dateFromISO(iso).getDay();
    if (day === 1 || day === 3) return event("avance", "Avance", "Regular Avance day");
    if (day === 4 || day === 5) return event("dcs", "DCS", "Regular DCS day");
    return baseEventForDate(iso);
  }

  if (isBetween(iso, "2026-07-20", PLAN_END)) return getAvance08Event(iso);
  return baseEventForDate(iso);
}

function getAvance08Event(iso) {
  const day = dateFromISO(iso).getDay();
  if ([1, 3, 4, 5].includes(day)) return event("avance", "Avance", "Avance 0.8 rhythm");
  return baseEventForDate(iso);
}

function getEventForDate(iso, scenario) {
  if (iso === "2026-07-03" && scenario !== "plan-b") {
    return event("dcs", "DCS last day", "Plan A milestone, once the Census offer is confirmed");
  }
  const common = getCommonEvent(iso);
  if (common) return common;
  return scenario === "plan-b" ? getPlanBEvent(iso) : getPlanAEvent(iso);
}

function buildSchedule(scenario) {
  const schedule = [];
  let cursor = dateFromISO(PLAN_START);
  const end = dateFromISO(PLAN_END);

  while (cursor <= end) {
    const iso = toISO(cursor);
    const scheduleEvent = getEventForDate(iso, scenario);
    if (scheduleEvent) schedule.push({ date: iso, ...scheduleEvent });
    cursor = addDays(cursor, 1);
  }

  return schedule;
}

let scenario = localStorage.getItem("work-planner-scenario") || "pending";
let activeFilter = "all";
const currentDate = new Date();
const currentIso = toISO(currentDate);
let visibleMonth =
  currentIso < PLAN_START
    ? new Date(2026, 5, 1, 12)
    : currentIso > PLAN_END
      ? new Date(2026, 9, 1, 12)
      : new Date(currentDate.getFullYear(), currentDate.getMonth(), 1, 12);

function renderScenario() {
  const details = scenarioDetails[scenario];
  document.querySelectorAll("[data-scenario]").forEach((button) => {
    button.classList.toggle("active", button.dataset.scenario === scenario);
  });
  document.querySelector("#scenario-title").textContent = details.title;
  document.querySelector("#scenario-description").textContent = details.description;
  document.querySelector("#next-decision").textContent = details.decision;
  document.querySelector("#milestone-title").textContent = details.milestone;
  document.querySelector("#milestone-note").textContent = details.milestoneNote;
  document.querySelector("#calendar-note").textContent = details.calendarNote;

  renderSnapshot();
  renderAgenda();
  renderCalendar();
  renderComparison();
}

function renderSnapshot() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const schedule = buildSchedule(scenario);
  const next = schedule.find((item) => dateFromISO(item.date) >= today);

  document.querySelector("#today-label").textContent = today.toLocaleDateString("en-AU", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  if (!next) {
    document.querySelector("#next-up-title").textContent = "Plan complete";
    document.querySelector("#next-up-date").textContent = "The transition schedule has concluded";
    return;
  }
  document.querySelector("#next-up-title").textContent = next.title;
  document.querySelector("#next-up-date").textContent = formatLongDate(next.date);
}

function getAgendaStart() {
  const today = toISO(new Date());
  if (today < PLAN_START) return dateFromISO(PLAN_START);
  if (today > PLAN_END) return dateFromISO(PLAN_END);
  return dateFromISO(today);
}

function renderAgenda() {
  const notes = getNotes();
  const start = getAgendaStart();
  const days = Array.from({ length: 14 }, (_, index) => {
    const date = addDays(start, index);
    const iso = toISO(date);
    return { date: iso, scheduleEvent: getEventForDate(iso, scenario), note: notes[iso] };
  });
  const workTypes = ["avance", "census", "dcs", "transition"];
  const workDays = days.filter((day) => workTypes.includes(day.scheduleEvent?.type)).length;
  const protectedDays = days.filter((day) => ["off", "church"].includes(day.scheduleEvent?.type)).length;
  const sundayWork = days.filter((day) => day.scheduleEvent?.title.includes("Census PM")).length;
  const loadPercent = Math.round((workDays / 14) * 100);
  const loadTitle = workDays >= 10 ? "A demanding fortnight" : workDays >= 8 ? "A full but workable fortnight" : "A balanced fortnight";
  const loadDescription =
    workDays >= 10
      ? "There is not much slack here. Keep Tuesday protected and treat Sunday Census work as optional."
      : workDays >= 8
        ? "The rhythm is busy but the protected days still create useful recovery space."
        : "Your protected days are holding and the work pattern has room to breathe.";

  document.querySelector("#agenda-list").innerHTML = days
    .map(({ date, scheduleEvent, note }) => {
      const parsed = dateFromISO(date);
      const dateLabel = parsed.toLocaleDateString("en-AU", { weekday: "short", day: "numeric" });
      const item = scheduleEvent || event("off", "Unscheduled", "No plan set for this day");
      return `
        <button class="agenda-item" type="button" data-date="${date}">
          <span class="agenda-date">${dateLabel}</span>
          <span class="agenda-marker" data-type="${item.type}"></span>
          <span class="agenda-copy">
            <strong>${item.title}</strong>
            <small>${note ? `Note: ${escapeHTML(note)}` : item.detail}</small>
          </span>
          ${note ? '<span class="note-badge">Note</span>' : ""}
        </button>
      `;
    })
    .join("");

  document.querySelector("#work-days-count").textContent = workDays;
  document.querySelector("#protected-days-count").textContent = protectedDays;
  document.querySelector("#sunday-work-count").textContent = sundayWork;
  document.querySelector("#load-meter-fill").style.width = `${loadPercent}%`;
  document.querySelector("#load-title").textContent = loadTitle;
  document.querySelector("#load-description").textContent = loadDescription;

  const today = toISO(new Date());
  const upcomingMilestone = milestones[scenario].find((item) => item.date >= today);
  const nextMilestone = upcomingMilestone || milestones[scenario].at(-1);
  const daysUntil = Math.max(0, Math.ceil((dateFromISO(nextMilestone.date) - dateFromISO(today)) / DAY_MS));
  document.querySelector("#countdown-title").textContent = nextMilestone.title;
  document.querySelector("#countdown-label").textContent =
    !upcomingMilestone
      ? `Completed ${formatLongDate(nextMilestone.date)}`
      : daysUntil === 0
        ? "Today"
        : `${formatLongDate(nextMilestone.date)} · ${daysUntil} day${daysUntil === 1 ? "" : "s"} away`;
}

function renderDecisions() {
  const complete = JSON.parse(localStorage.getItem("work-planner-decisions") || "[]");
  const container = document.querySelector("#decision-list");
  container.innerHTML = decisions
    .map(
      (item, index) => `
        <button class="decision-item ${complete.includes(index) ? "completed" : ""}" type="button" data-decision="${index}" aria-pressed="${complete.includes(index)}">
          <span class="decision-number"><span>${String(index + 1).padStart(2, "0")}</span></span>
          <h3>${item.title}</h3>
          <p>${item.description}</p>
          <span class="decision-check">${complete.includes(index) ? "Completed" : "Mark complete"}</span>
        </button>
      `,
    )
    .join("");
}

function toggleDecision(index) {
  const complete = JSON.parse(localStorage.getItem("work-planner-decisions") || "[]");
  const numericIndex = Number(index);
  const updated = complete.includes(numericIndex)
    ? complete.filter((item) => item !== numericIndex)
    : [...complete, numericIndex];
  localStorage.setItem("work-planner-decisions", JSON.stringify(updated));
  renderDecisions();
}

function renderPhases() {
  const todayIso = toISO(new Date());
  let currentPhase = 3;
  if (todayIso <= "2026-07-05") currentPhase = 0;
  else if (todayIso <= "2026-07-12") currentPhase = 1;
  else if (todayIso <= "2026-10-01") currentPhase = 2;

  document.querySelector("#phase-track").innerHTML = phases
    .map(
      (phase, index) => `
        <article class="phase-card ${index === currentPhase ? "current" : ""}" style="--phase-color: ${phase.color}">
          <div class="phase-meta"><span>${phase.label}</span><span>${phase.dates}</span></div>
          <h3>${phase.title}</h3>
          <p>${phase.description}</p>
          <strong>${phase.focus}</strong>
        </article>
      `,
    )
    .join("");
}

function getCalendarBounds() {
  const first = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), 1, 12);
  const last = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 0, 12);
  const mondayOffset = (first.getDay() + 6) % 7;
  const start = addDays(first, -mondayOffset);
  const endOffset = (7 - last.getDay()) % 7;
  return { start, end: addDays(last, endOffset) };
}

function renderCalendar() {
  document.querySelector("#month-title").textContent = visibleMonth.toLocaleDateString("en-AU", {
    month: "long",
    year: "numeric",
  });

  const todayIso = toISO(new Date());
  const { start, end } = getCalendarBounds();
  const notes = getNotes();
  const cells = [];
  let cursor = start;

  while (cursor <= end) {
    const iso = toISO(cursor);
    const scheduleEvent = getEventForDate(iso, scenario);
    const muted = cursor.getMonth() !== visibleMonth.getMonth();
    const filtered = scheduleEvent && activeFilter !== "all" && scheduleEvent.type !== activeFilter;

    cells.push(`
      <button class="calendar-cell ${muted ? "muted" : ""} ${iso === todayIso ? "today" : ""}" type="button" data-date="${iso}" aria-label="${formatLongDate(iso)}">
        <span class="calendar-date">${cursor.getDate()}</span>
        ${
          scheduleEvent
            ? `<span class="calendar-event ${filtered ? "filtered" : ""}" data-type="${scheduleEvent.type}" title="${scheduleEvent.detail}">${scheduleEvent.title}</span>`
            : ""
        }
        ${notes[iso] ? '<span class="calendar-note-dot" title="Personal note saved"></span>' : ""}
      </button>
    `);
    cursor = addDays(cursor, 1);
  }

  document.querySelector("#calendar-grid").innerHTML = cells.join("");
}

function getScenarioMetrics(scenarioName) {
  const schedule = buildSchedule(scenarioName).filter((item) => item.date <= "2026-10-01");
  const workTypes = ["avance", "census", "dcs", "transition"];
  return {
    workDays: schedule.filter((item) => workTypes.includes(item.type)).length,
    censusDays: schedule.filter((item) => item.type === "census").length,
    saturdayWork: schedule.filter((item) => item.type === "census" && dateFromISO(item.date).getDay() === 6).length,
    possibleSundays: schedule.filter((item) => item.title.includes("Census PM")).length,
  };
}

function renderComparison() {
  const planA = getScenarioMetrics("plan-a");
  const planB = getScenarioMetrics("plan-b");
  document.querySelector("#comparison-stats").innerHTML = `
    <div class="comparison-stat-head"><span>Through 1 Oct</span><strong>Plan A</strong><strong>Plan B</strong></div>
    <div><span>Total work days</span><strong>${planA.workDays}</strong><strong>${planB.workDays}</strong></div>
    <div><span>Census days</span><strong>${planA.censusDays}</strong><strong>${planB.censusDays}</strong></div>
    <div><span>Working Saturdays</span><strong>${planA.saturdayWork}</strong><strong>${planB.saturdayWork}</strong></div>
    <div><span>Possible Sunday PMs</span><strong>${planA.possibleSundays}</strong><strong>${planB.possibleSundays}</strong></div>
  `;
}

let selectedDate = null;
function openDayDialog(iso) {
  selectedDate = iso;
  const scheduleEvent = getEventForDate(iso, scenario) || event("off", "Unscheduled", "No plan set for this day");
  const notes = getNotes();
  const dialog = document.querySelector("#day-dialog");
  document.querySelector("#dialog-eyebrow").textContent = scenarioDetails[scenario].title;
  document.querySelector("#dialog-date").textContent = formatLongDate(iso);
  document.querySelector("#dialog-event").innerHTML = `
    <span class="dialog-event-marker" data-type="${scheduleEvent.type}"></span>
    <div><strong>${scheduleEvent.title}</strong><p>${scheduleEvent.detail}</p></div>
  `;
  document.querySelector("#day-note").value = notes[iso] || "";
  document.querySelector(".delete-note-button").hidden = !notes[iso];
  dialog.showModal();
}

function saveSelectedNote() {
  if (!selectedDate) return;
  const notes = getNotes();
  const note = document.querySelector("#day-note").value.trim();
  if (note) notes[selectedDate] = note;
  else delete notes[selectedDate];
  localStorage.setItem("work-planner-notes", JSON.stringify(notes));
  document.querySelector("#day-dialog").close();
  renderAgenda();
  renderCalendar();
  showToast(note ? "Day note saved." : "Day note cleared.");
}

function escapeICS(value) {
  return value.replaceAll("\\", "\\\\").replaceAll(",", "\\,").replaceAll(";", "\\;").replaceAll("\n", "\\n");
}

function exportCalendar() {
  const schedule = buildSchedule(scenario);
  const scenarioName = scenario === "pending" ? "Working Plan A" : scenarioDetails[scenario].title;
  const entries = schedule.map((item) => {
    const start = item.date.replaceAll("-", "");
    const end = toISO(addDays(dateFromISO(item.date), 1)).replaceAll("-", "");
    return [
      "BEGIN:VEVENT",
      `UID:${item.date}-${item.type}@workplanner`,
      `DTSTART;VALUE=DATE:${start}`,
      `DTEND;VALUE=DATE:${end}`,
      `SUMMARY:${escapeICS(item.title)}`,
      `DESCRIPTION:${escapeICS(`${item.detail} · ${scenarioName}`)}`,
      "END:VEVENT",
    ].join("\r\n");
  });

  const calendar = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Work Planner//DCS Census Avance//EN",
    `X-WR-CALNAME:${escapeICS(`Work Planner · ${scenarioName}`)}`,
    ...entries,
    "END:VCALENDAR",
  ].join("\r\n");

  const blob = new Blob([calendar], { type: "text/calendar;charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `work-planner-${scenario}.ics`;
  link.click();
  URL.revokeObjectURL(link.href);
  showToast("Calendar exported.");
}

function downloadPlannerBackup() {
  const backup = {
    app: "work-planner",
    version: 1,
    exportedAt: new Date().toISOString(),
    scenario,
    decisions: JSON.parse(localStorage.getItem("work-planner-decisions") || "[]"),
    notes: getNotes(),
  };
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `work-planner-backup-${toISO(new Date())}.json`;
  link.click();
  URL.revokeObjectURL(link.href);
  showToast("Planner backup downloaded.");
}

async function restorePlannerBackup(event) {
  const [file] = event.target.files;
  event.target.value = "";
  if (!file) return;

  try {
    const backup = JSON.parse(await file.text());
    const validScenario = Object.hasOwn(scenarioDetails, backup.scenario);
    const validDecisions =
      Array.isArray(backup.decisions) &&
      backup.decisions.every((item) => Number.isInteger(item) && item >= 0 && item < decisions.length);
    const validNotes =
      backup.notes &&
      typeof backup.notes === "object" &&
      !Array.isArray(backup.notes) &&
      Object.values(backup.notes).every((note) => typeof note === "string");

    if (backup.app !== "work-planner" || backup.version !== 1 || !validScenario || !validDecisions || !validNotes) {
      throw new Error("Unsupported planner backup");
    }

    scenario = backup.scenario;
    localStorage.setItem("work-planner-scenario", scenario);
    localStorage.setItem("work-planner-decisions", JSON.stringify([...new Set(backup.decisions)]));
    localStorage.setItem("work-planner-notes", JSON.stringify(backup.notes));
    renderDecisions();
    renderScenario();
    showToast("Planner backup restored.");
  } catch {
    showToast("That file is not a valid planner backup.");
  }
}

let toastTimer;
function showToast(message) {
  const toast = document.querySelector("#toast");
  toast.textContent = message;
  toast.classList.add("visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("visible"), 2400);
}

document.querySelectorAll("[data-scenario]").forEach((button) => {
  button.addEventListener("click", () => {
    scenario = button.dataset.scenario;
    localStorage.setItem("work-planner-scenario", scenario);
    renderScenario();
  });
});

document.querySelector("#decision-list").addEventListener("click", (event) => {
  const button = event.target.closest("[data-decision]");
  if (button) toggleDecision(button.dataset.decision);
});

document.querySelectorAll("[data-filter]").forEach((button) => {
  button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;
    document.querySelectorAll("[data-filter]").forEach((item) => item.classList.toggle("active", item === button));
    renderCalendar();
  });
});

document.querySelector("#previous-month").addEventListener("click", () => {
  visibleMonth = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() - 1, 1, 12);
  renderCalendar();
});

document.querySelector("#next-month").addEventListener("click", () => {
  visibleMonth = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 1, 12);
  renderCalendar();
});

document.querySelector(".today-button").addEventListener("click", () => {
  const today = new Date();
  const target = toISO(today) < PLAN_START ? dateFromISO(PLAN_START) : today;
  visibleMonth = new Date(target.getFullYear(), target.getMonth(), 1, 12);
  renderCalendar();
});

document.querySelector("#calendar-grid").addEventListener("click", (event) => {
  const cell = event.target.closest("[data-date]");
  if (cell) openDayDialog(cell.dataset.date);
});

document.querySelector("#agenda-list").addEventListener("click", (event) => {
  const item = event.target.closest("[data-date]");
  if (item) openDayDialog(item.dataset.date);
});

document.querySelector(".save-note-button").addEventListener("click", saveSelectedNote);
document.querySelector(".delete-note-button").addEventListener("click", () => {
  document.querySelector("#day-note").value = "";
  saveSelectedNote();
});

document.querySelectorAll(".export-button").forEach((button) => button.addEventListener("click", exportCalendar));
document.querySelector(".backup-button").addEventListener("click", downloadPlannerBackup);
document.querySelector(".restore-button").addEventListener("click", () => document.querySelector("#planner-backup-input").click());
document.querySelector("#planner-backup-input").addEventListener("change", restorePlannerBackup);
document.querySelector(".print-button").addEventListener("click", () => window.print());

document.querySelector(".copy-button").addEventListener("click", async (event) => {
  const target = document.querySelector(`#${event.currentTarget.dataset.copyTarget}`);
  await navigator.clipboard.writeText(target.textContent.trim().replace(/\s+/g, " "));
  showToast("Message copied.");
});

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      document.querySelectorAll(".main-nav a").forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
      });
    });
  },
  { rootMargin: "-40% 0px -55%" },
);

["overview", "agenda", "calendar", "reference"].forEach((id) => sectionObserver.observe(document.querySelector(`#${id}`)));

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => navigator.serviceWorker.register("/service-worker.js"));
}

renderDecisions();
renderPhases();
renderScenario();
