// ===== SELECT ELEMENTS =====
const boxes = document.querySelectorAll('.grid-item');
const completed = new Array(16).fill(false);
const tasks = new Array(16).fill("");
const taskCounterText = document.querySelector("#task-counter h3");
const bingoCounterText = document.querySelector("#bingo-counter h3");
const reset = document.getElementById("reset_button");
let completedCount = 0;

const modal = document.getElementById("modal");
const textInp = document.getElementById("textInput");
const save = document.getElementById("saveTask");
const deleteBtn = document.getElementById("deleteTask");
const closeBtn = document.querySelector(".close");
let currentIndex = null;

// ===== LOCAL STORAGE HELPERS =====
function saveToLocalStorage() {
    localStorage.setItem("bingoTasks", JSON.stringify(tasks));
    localStorage.setItem("bingoCompleted", JSON.stringify(completed));
}

function loadFromLocalStorage() {
    const savedTasks = JSON.parse(localStorage.getItem("bingoTasks"));
    const savedCompleted = JSON.parse(localStorage.getItem("bingoCompleted"));

    if (savedTasks && savedCompleted) {
        for (let i = 0; i < 16; i++) {
            tasks[i] = savedTasks[i] || "";
            completed[i] = savedCompleted[i] || false;

            boxes[i].textContent = tasks[i];
            if (completed[i]) {
                boxes[i].classList.add("completed");
                completedCount++;
            }
        }
        taskCounterText.textContent = `${completedCount}/16`;
        checkBingoLines();
    }
}

// ===== MAIN FUNCTION =====
function taskDone(index, event) {
    if (tasks[index] === "") {
        // Add new task
        currentIndex = index;
        textInp.value = "";
        modal.style.display = "flex";
        textInp.focus();
    } else {
        // Edit existing task on double click
        if (event.detail >= 2) {
            currentIndex = index;
            textInp.value = tasks[index];
            modal.style.display = "flex";
            textInp.focus();
            return;
        }

        // Toggle completion
        if (!completed[index]) {
            completed[index] = true;
            boxes[index].classList.add("completed");
            completedCount++;
        } else {
            completed[index] = false;
            boxes[index].classList.remove("completed");
            completedCount--;
        }
        taskCounterText.textContent = `${completedCount}/16`;
        checkBingoLines();
        saveToLocalStorage();
    }
}

// ===== SAVE TASK =====
function saveTask() {
    tasks[currentIndex] = textInp.value.trim();
    boxes[currentIndex].textContent = tasks[currentIndex];
    if (tasks[currentIndex] === "") {
        if (completed[currentIndex]) {
            completed[currentIndex] = false;
            boxes[currentIndex].classList.remove("completed");
            completedCount--;
            taskCounterText.textContent = `${completedCount}/16`;
        }
    }
    checkBingoLines();
    saveToLocalStorage();
    modal.style.display = "none";
}

// ===== DELETE TASK =====
deleteBtn.addEventListener("click", () => {
    tasks[currentIndex] = "";
    boxes[currentIndex].textContent = "";
    if (completed[currentIndex]) {
        completed[currentIndex] = false;
        boxes[currentIndex].classList.remove("completed");
        completedCount--;
        taskCounterText.textContent = `${completedCount}/16`;
    }
    checkBingoLines();
    saveToLocalStorage();
    modal.style.display = "none";
});

// ===== CLOSE MODAL =====
closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
});

// ===== SAVE ON ENTER =====
textInp.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        saveTask();
    }
});

save.addEventListener("click", saveTask);

// ===== WINNING LINES =====
const winningLines = [
    [0,1,2,3], [4,5,6,7], [8,9,10,11], [12,13,14,15],
    [0,4,8,12], [1,5,9,13], [2,6,10,14], [3,7,11,15],
    [0,5,10,15], [3,6,9,12]
];

let bingo_counter = 0;
function checkBingoLines() {
    bingo_counter = 0;
    for (let i = 0; i < winningLines.length; i++) {
        let line = winningLines[i];
        let bingo = line.every(index => completed[index]);
        if (bingo) bingo_counter++;
    }
    bingoCounterText.textContent = bingo_counter;
}

// ===== SET EVENT LISTENERS FOR BOXES =====
boxes.forEach((box, i) => {
    box.addEventListener("click", (event) => taskDone(i, event));
});

function resetAll(){
    for (let i = 0; i < 16; i++) {
        tasks[i] = "";
        completed[i] = false;
        boxes[i].textContent = "";
        boxes[i].classList.remove("completed");
    }
}

reset.addEventListener("click", () => {
    resetAll();
    completedCount = 0;
    bingo_counter = 0;
    taskCounterText.textContent = `${completedCount}/16`;
    bingoCounterText.textContent = bingo_counter;
    saveToLocalStorage();
});

// ===== INITIAL LOAD =====
loadFromLocalStorage();
