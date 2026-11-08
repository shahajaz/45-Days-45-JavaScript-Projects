const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const priorityInput = document.getElementById("priorityInput");
const dueDateInput = document.getElementById("dueDateInput");

const taskList = document.getElementById("taskList");
const searchInput = document.getElementById("searchInput");

const totalTasks = document.getElementById("totalTasks");
const pendingTasks = document.getElementById("pendingTasks");
const completedTasks = document.getElementById("completedTasks");

const allNavCount = document.getElementById("allNavCount");
const activeNavCount = document.getElementById("activeNavCount");
const completedNavCount = document.getElementById("completedNavCount");

const taskCounter = document.getElementById("taskCounter");
const clearCompletedBtn = document.getElementById("clearCompletedBtn");

const toast = document.getElementById("toast");
const toastMessage = document.getElementById("toastMessage");

/* APPLICATION STATE */
const STORAGE_KEY = "taskflow_tasks";
let tasks = [];
try{
    const savedTasks = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (Array.isArray(savedTasks)) {
        tasks = savedTasks.filter(task =>
            task &&
            typeof task.id === "string" &&
            typeof task.title === "string" &&
            typeof task.completed === "boolean" &&
            ["low", "medium", "high"].includes(task.priority)
        );
    }
} catch (error){
    console.error("Unable to load saved tasks:", error);
}
let currentFilter = "all";
let searchQuery = "";
let toastTimer;

/* LOCAL STORAGE */
function saveTasks(){
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (error) {
        console.error("Unable to save tasks:", error);
        showToast("Unable to save tasks in this browser.");
    }
}

/* UTILITY FUNCTIONS */
// Generate unique task ID
function generateId(){
    return crypto.randomUUID
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
// Escape HTML to prevent HTML injection
function escapeHTML(value){
    return String(value).replace(/[&<>"']/g, character => {
        const entities = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        };
        return entities[character];
    });
}

// Display notification
function showToast(message){
    clearTimeout(toastTimer);
    toastMessage.textContent = message;
    toast.classList.add("show");
    toastTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);
}

// Get today's date in local YYYY-MM-DD format
function getToday(){
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

// Format due date
function formatDate(date){
    if (!date) return "";
    const [year, month, day] = date.split("-").map(Number);
    return new Date(year, month - 1, day).toLocaleDateString(
        "en-US",
        {
            day: "numeric",
            month: "short",
            year: "numeric"
        }
    );
}

// Check if task is overdue
function isOverdue(task){
    return task.dueDate &&
        !task.completed &&
        task.dueDate < getToday();
}

/* ADD TASK */
taskForm.addEventListener("submit", function(event){
    event.preventDefault();
    const title = taskInput.value.trim();
    const priority = priorityInput.value;
    const dueDate = dueDateInput.value;

    if (!title){
        showToast("Please enter a task.");
        taskInput.focus();
        return;
    }

    if (dueDate && dueDate < getToday()){
        showToast("Please select today or a future date.");
        dueDateInput.focus();
        return;
    }

    const newTask ={
        id: generateId(),
        title: title,
        priority: priority,
        dueDate: dueDate,
        completed: false,
        createdAt: new Date().toISOString()
    };

    tasks.unshift(newTask);
    saveTasks();
    renderTasks();

    taskForm.reset();
    priorityInput.value = "medium";
    taskInput.focus();
    showToast("Task added successfully!");
});

/* RENDER TASKS */
function renderTasks(){

    // Apply filters
    let filteredTasks = tasks.filter(task => {
        const matchesFilter =
            currentFilter === "all" ||
            (currentFilter === "active" && !task.completed) ||
            (currentFilter === "completed" && task.completed);
        const matchesSearch =
            task.title.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    // Update task counter
    taskCounter.textContent =
        `${filteredTasks.length} ${filteredTasks.length === 1 ? "task" : "tasks"}`;

    // Empty state
    if (filteredTasks.length === 0){
        let message = "No tasks found.";
        let description = "Try adding a new task to get started.";

        if (searchQuery){
            message = "No matching tasks.";
            description = "Try searching with a different keyword.";
        } else if (currentFilter === "active"){
            message = "No pending tasks!";
            description = "You have completed all your tasks.";
        } else if (currentFilter === "completed"){
            message = "No completed tasks yet.";
            description = "Complete a task to see it here.";
        }

        taskList.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">
                    <i class="fa-solid fa-clipboard-check"></i>
                </div>
                <h3>${message}</h3>
                <p>${description}</p>
            </div>
        `;
        return;
    }

    // Generate task HTML
    taskList.innerHTML = filteredTasks.map(task =>{
        const priority = escapeHTML(task.priority);
        const title = escapeHTML(task.title);
        const dueDate = escapeHTML(task.dueDate || "");
        const overdue = isOverdue(task);

        return `
            <div class="task-item ${task.completed ? "completed" : ""}"
                 data-id="${escapeHTML(task.id)}">
                <input
                    type="checkbox"
                    class="task-checkbox"
                    data-action="toggle"
                    aria-label="Mark task as completed"
                    ${task.completed ? "checked" : ""}
                >

                <div class="task-details">
                    <h3 class="task-title">${title}</h3>
                    <div class="task-meta">
                        <span class="priority ${priority}">
                            ${priority} Priority
                        </span>

                        ${task.dueDate ? `
                            <span class="due-date ${overdue ? "overdue" : ""}">
                                <i class="fa-regular fa-calendar"></i>
                                ${formatDate(task.dueDate)}
                                ${overdue ? "(Overdue)" : ""}
                            </span>
                        ` : ""}
                    </div>
                </div>

                <div class="task-actions">
                    <button
                        class="action-btn edit"
                        data-action="edit"
                        aria-label="Edit task"
                        title="Edit task">
                        <i class="fa-solid fa-pen"></i>
                    </button>

                    <button
                        class="action-btn delete"
                        data-action="delete"
                        aria-label="Delete task"
                        title="Delete task">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    }).join("");
}

/* UPDATE STATISTICS */
function updateStatistics(){
    const total = tasks.length;
    const completed = tasks.filter(
        task => task.completed
    ).length;

    const pending = total - completed;
    totalTasks.textContent = total;
    pendingTasks.textContent = pending;
    completedTasks.textContent = completed;
    allNavCount.textContent = total;
    activeNavCount.textContent = pending;
    completedNavCount.textContent = completed;
}

/* UPDATE UI */
function updateUI(){
    renderTasks();
    updateStatistics();
    updateFilters();
}

// Update active filter styles
function updateFilters(){
    document.querySelectorAll(".filter-btn").forEach(button => {
        button.classList.toggle(
            "active",
            button.dataset.filter === currentFilter
        );
    });

    document.querySelectorAll(".nav-item").forEach(button => {
        button.classList.toggle(
            "active",
            button.dataset.filter === currentFilter
        );
    });
}

/* TOGGLE TASK STATUS */
taskList.addEventListener("change", function(event){
    if (!event.target.matches('[data-action="toggle"]')){
        return;
    }
    const taskElement = event.target.closest(".task-item");
    const taskId = taskElement.dataset.id;
    const task = tasks.find(task => task.id === taskId);

    if (!task) return;
    task.completed = event.target.checked;
    saveTasks();
    updateUI();

    showToast(
        task.completed
            ? "Task completed successfully!"
            : "Task marked as pending."
    );
});

/* EDIT TASK */
function editTask(taskId){
    const task = tasks.find(task => task.id === taskId);
    if (!task) return;
    const newTitle = prompt("Edit your task:", task.title);

    // Cancel
    if (newTitle === null) return;
    const updatedTitle = newTitle.trim();
    if (!updatedTitle) {
        showToast("Task title cannot be empty.");
        return;
    }

    if (updatedTitle.length > 150){
        showToast("Task title cannot exceed 150 characters.");
        return;
    }
    const newPriority = prompt(
        "Enter priority: low, medium, or high",
        task.priority
    );
    if (newPriority === null) return;
    const updatedPriority = newPriority.trim().toLowerCase();
    if (!["low", "medium", "high"].includes(updatedPriority)) {
        showToast("Invalid priority. Use low, medium, or high.");
        return;
    }

    task.title = updatedTitle;
    task.priority = updatedPriority;
    saveTasks();
    updateUI();
    showToast("Task updated successfully!");
}

/* DELETE TASK */
function deleteTask(taskId){
    const task = tasks.find(task => task.id === taskId);
    if (!task) return;
    const confirmed = confirm(
        `Are you sure you want to delete "${task.title}"?`
    );
    if (!confirmed) return;
    tasks = tasks.filter(task => task.id !== taskId);
    saveTasks();
    updateUI();
    showToast("Task deleted successfully!");
}

/* TASK ACTIONS */
taskList.addEventListener("click", function(event){
    const button = event.target.closest("[data-action]");
    if (!button) return;
    const action = button.dataset.action;
    if (!["edit", "delete"].includes(action)) return;

    const taskElement = button.closest(".task-item");
    const taskId = taskElement.dataset.id;

    if (action === "edit"){
        editTask(taskId);
    }
    if (action === "delete"){
        deleteTask(taskId);
    }
});

/* FILTER TASKS */
function setFilter(filter){
    currentFilter = filter;
    updateUI();
}

document.querySelectorAll("[data-filter]").forEach(button =>{
    button.addEventListener("click", function(){
        setFilter(this.dataset.filter);
    });

});

/* SEARCH TASKS */
searchInput.addEventListener("input", function(){
    searchQuery = this.value.trim();
    renderTasks();
});

/* CLEAR COMPLETED TASKS */
clearCompletedBtn.addEventListener("click", function() {
    const completedCount = tasks.filter(
        task => task.completed
    ).length;

    if (completedCount === 0){
        showToast("No completed tasks to clear.");
        return;
    }

    const confirmed = confirm(
        `Delete all ${completedCount} completed tasks?`
    );

    if (!confirmed) return;
    tasks = tasks.filter(task => !task.completed);
    saveTasks();
    updateUI();
    showToast("Completed tasks cleared!");
});

/* CURRENT DATE */
function displayCurrentDate(){
    const today = new Date();
    document.getElementById("currentDate").textContent =
        today.toLocaleDateString("en-US", {
            weekday: "short",
            day: "numeric",
            month: "short",
            year: "numeric"
        });
}

/* INITIALIZE APPLICATION */
function init(){
    displayCurrentDate();
    dueDateInput.min = getToday();
    updateUI();
    console.log("TaskFlow application initialized successfully!");
}
init();
