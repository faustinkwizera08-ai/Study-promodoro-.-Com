// ----------------------
// TASK PLANNER SECTION
// ----------------------
const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const clearTasksBtn = document.getElementById("clearTasksBtn");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks() {
  taskList.innerHTML = "";

  tasks.forEach((task, index) => {
    const li = document.createElement("li");

    if (task.done) li.classList.add("done");

    li.innerHTML = `
      <span>${task.text}</span>
      <div>
        <button onclick="toggleDone(${index})">✔</button>
        <button class="danger" onclick="deleteTask(${index})">✖</button>
      </div>
    `;

    taskList.appendChild(li);
  });
}

function addTask() {
  const text = taskInput.value.trim();
  if (text === "") return;

  tasks.push({ text, done: false });
  taskInput.value = "";
  saveTasks();
  renderTasks();
}

function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
}

function toggleDone(index) {
  tasks[index].done = !tasks[index].done;
  saveTasks();
  renderTasks();
}

addTaskBtn.addEventListener("click", addTask);

taskInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") addTask();
});

clearTasksBtn.addEventListener("click", () => {
  tasks = [];
  saveTasks();
  renderTasks();
});

renderTasks();

// ----------------------
// POMODORO TIMER SECTION
// ----------------------
const timerDisplay = document.getElementById("timerDisplay");
const modeText = document.getElementById("modeText");

const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const resetBtn = document.getElementById("resetBtn");

const focusModeBtn = document.getElementById("focusModeBtn");
const breakModeBtn = document.getElementById("breakModeBtn");

let focusTime = 25 * 60;
let breakTime = 5 * 60;

let timeLeft = focusTime;
let timerInterval = null;
let isRunning = false;
let currentMode = "focus";

function updateDisplay() {
  let minutes = Math.floor(timeLeft / 60);
  let seconds = timeLeft % 60;

  timerDisplay.textContent =
    `${minutes}`.padStart(2, "0") + ":" + `${seconds}`.padStart(2, "0");
}

function startTimer() {
  if (isRunning) return;

  isRunning = true;
  timerInterval = setInterval(() => {
    timeLeft--;

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      isRunning = false;

      alert("Time is up! 🎉");

      // Auto switch mode
      if (currentMode === "focus") {
        setBreakMode();
      } else {
        setFocusMode();
      }
    }

    updateDisplay();
  }, 1000);
}

function pauseTimer() {
  clearInterval(timerInterval);
  isRunning = false;
}

function resetTimer() {
  pauseTimer();
  timeLeft = currentMode === "focus" ? focusTime : breakTime;
  updateDisplay();
}

function setFocusMode() {
  currentMode = "focus";
  modeText.textContent = "Mode: Focus";
  timeLeft = focusTime;
  updateDisplay();

  focusModeBtn.classList.add("active");
  breakModeBtn.classList.remove("active");
}

function setBreakMode() {
  currentMode = "break";
  modeText.textContent = "Mode: Break";
  timeLeft = breakTime;
  updateDisplay();

  breakModeBtn.classList.add("active");
  focusModeBtn.classList.remove("active");
}

startBtn.addEventListener("click", startTimer);
pauseBtn.addEventListener("click", pauseTimer);
resetBtn.addEventListener("click", resetTimer);

focusModeBtn.addEventListener("click", () => {
  pauseTimer();
  setFocusMode();
});

breakModeBtn.addEventListener("click", () => {
  pauseTimer();
  setBreakMode();
});

updateDisplay();
