const transactionForm = document.getElementById("transactionForm");
const transactionModal = document.getElementById("transactionModal");
const budgetModal = document.getElementById("budgetModal");

const transactionList = document.getElementById("transactionList");
const emptyState = document.getElementById("emptyState");

const searchInput = document.getElementById("searchInput");
const typeFilter = document.getElementById("typeFilter");
const sortFilter = document.getElementById("sortFilter");
const startDate = document.getElementById("startDate");
const endDate = document.getElementById("endDate");

const typeInput = document.getElementById("type");
const categoryInput = document.getElementById("category");

const CATEGORIES = {
    income: [
        "Salary",
        "Freelance",
        "Business",
        "Investment",
        "Gift",
        "Other"
    ],
    expense: [
        "Food",
        "Shopping",
        "Transport",
        "Entertainment",
        "Bills",
        "Healthcare",
        "Education",
        "Travel",
        "Other"
    ]
};

const CATEGORY_ICONS = {
    Salary: "fa-money-bill-wave",
    Freelance: "fa-laptop",
    Business: "fa-briefcase",
    Investment: "fa-chart-line",
    Gift: "fa-gift",
    Food: "fa-utensils",
    Shopping: "fa-bag-shopping",
    Transport: "fa-car",
    Entertainment: "fa-film",
    Bills: "fa-file-invoice",
    Healthcare: "fa-heart-pulse",
    Education: "fa-graduation-cap",
    Travel: "fa-plane",
    Other: "fa-wallet"
};
let transactions = JSON.parse(
    localStorage.getItem("fintrack_transactions")
) || [];
let monthlyBudget = Number(
    localStorage.getItem("fintrack_budget")
) || 20000;
let expenseChart = null;
let overviewChart = null;


/* === LOCAL STORAGE === */
function saveTransactions() {
    localStorage.setItem(
        "fintrack_transactions",
        JSON.stringify(transactions)
    );
}
function saveBudget() {
    localStorage.setItem(
        "fintrack_budget",
        monthlyBudget
    );
}

/* === UTILITY FUNCTIONS === */

// Generate unique transaction ID.
function generateId() {
    if (window.crypto && window.crypto.randomUUID) {
        return window.crypto.randomUUID();
    }

    return Date.now().toString(36) +
        Math.random().toString(36).slice(2);
}

// Format currency in Indian Rupees.
function formatCurrency(amount) {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 2
    }).format(amount);
}

// Get today's date in local timezone.
function getToday() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

// Get the current month in YYYY-MM format.
function getCurrentMonth() {
    return getToday().slice(0, 7);
}

// Format transaction date.
function formatDate(dateString) {
    const [year, month, day] = dateString.split("-");

    return new Date(
        Number(year),
        Number(month) - 1,
        Number(day)
    ).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
}

// Escape HTML to safely display user-entered text.
function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    })[character]);
}

/* === CATEGORY MANAGEMENT === */
function updateCategories(selectedCategory = "") {
    const selectedType = typeInput.value;
    categoryInput.innerHTML = "";
    CATEGORIES[selectedType].forEach(category => {
        const option = document.createElement("option");
        option.value = category;
        option.textContent = category;
        if (category === selectedCategory) {
            option.selected = true;
        }
        categoryInput.appendChild(option);
    });
}
typeInput.addEventListener("change", () => {
    updateCategories();
});

/* === TRANSACTION CRUD OPERATIONS === */

// CREATE / UPDATE TRANSACTION
transactionForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const id = document.getElementById("transactionId").value;
    const description = document.getElementById("description").value.trim();
    const amount = Number(document.getElementById("amount").value);
    const type = typeInput.value;
    const category = categoryInput.value;
    const date = document.getElementById("date").value;
    if (!description || !Number.isFinite(amount) || amount <= 0 || !date) {
        alert("Please enter valid transaction details.");
        return;
    }
    if (date > getToday()) {
        alert("Future transaction dates are not allowed.");
        return;
    }
    const transaction = {
        id: id || generateId(),
        description,
        amount,
        type,
        category,
        date
    };

    if (id) {
        // UPDATE existing transaction.
        transactions = transactions.map(item =>
            item.id === id ? transaction : item
        );

    } else {
        // CREATE new transaction.
        transactions.push(transaction);
    }
    saveTransactions();
    closeTransactionModal();
    renderDashboard();
});

// EDIT TRANSACTION
function editTransaction(id) {
    const transaction = transactions.find(
        item => item.id === id
    );

    if (!transaction) return;
    document.getElementById("transactionId").value = transaction.id;
    document.getElementById("description").value = transaction.description;
    document.getElementById("amount").value = transaction.amount;
    document.getElementById("date").value = transaction.date;
    typeInput.value = transaction.type;
    updateCategories(transaction.category);
    document.getElementById("modalTitle").textContent = "Edit Transaction";
    transactionModal.classList.add("show");
}

// DELETE TRANSACTION
function deleteTransaction(id) {
    const confirmed = confirm(
        "Are you sure you want to delete this transaction?"
    );
    if (!confirmed) return;
    transactions = transactions.filter(
        item => item.id !== id
    );
    saveTransactions();
    renderDashboard();
}

/* === MODAL MANAGEMENT === */
document.getElementById("openAddModal").addEventListener("click", () => {
    openTransactionModal();
});

function openTransactionModal() {
    transactionForm.reset();
    document.getElementById("transactionId").value = "";
    document.getElementById("modalTitle").textContent = "Add Transaction";
    document.getElementById("date").value = getToday();
    typeInput.value = "expense";
    updateCategories();
    transactionModal.classList.add("show");
}

function closeTransactionModal() {
    transactionModal.classList.remove("show");
    transactionForm.reset();
}
document.getElementById("closeModal").addEventListener(
    "click",
    closeTransactionModal
);
document.getElementById("closeBudgetModal").addEventListener(
    "click",
    () => budgetModal.classList.remove("show")
);

// Close modal by clicking outside.
[transactionModal, budgetModal].forEach(modal => {
    modal.addEventListener("click", event => {
        if (event.target === modal) {
            modal.classList.remove("show");
        }
    });
});

// Close modal using Escape key.
document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
        transactionModal.classList.remove("show");
        budgetModal.classList.remove("show");
    }
});

/* === FINANCIAL CALCULATIONS === */
function calculateTotals() {
    let totalIncome = 0;
    let totalExpense = 0;
    let monthlyExpense = 0;

    transactions.forEach(transaction => {
        if (transaction.type === "income") {
            totalIncome += transaction.amount;
        } else {
            totalExpense += transaction.amount;
            if (transaction.date.startsWith(getCurrentMonth())) {
                monthlyExpense += transaction.amount;
            }
        }

    });
    return {
        totalIncome,
        totalExpense,
        balance: totalIncome - totalExpense,
        monthlyExpense
    };
}

/* === DASHBOARD RENDERING === */
function renderDashboard() {
    renderSummary();
    renderTransactions();
    renderBudget();
    renderCharts();
}

// Update summary cards.
function renderSummary() {
    const totals = calculateTotals();
    document.getElementById("totalBalance").textContent = formatCurrency(totals.balance);
    document.getElementById("totalIncome").textContent = formatCurrency(totals.totalIncome);
    document.getElementById("totalExpense").textContent = formatCurrency(totals.totalExpense);
    document.getElementById("monthlyExpense").textContent = formatCurrency(totals.monthlyExpense);
}

/* === SEARCH, FILTER & SORT === */
function getFilteredTransactions() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    const selectedType = typeFilter.value;
    const start = startDate.value;
    const end = endDate.value;
    let filtered = transactions.filter(transaction => {
        const matchesSearch = transaction.description
            .toLowerCase()
            .includes(searchTerm);

        const matchesType =
            selectedType === "all" ||
            transaction.type === selectedType;

        const matchesStart =
            !start || transaction.date >= start;

        const matchesEnd =
            !end || transaction.date <= end;

        return matchesSearch &&
            matchesType &&
            matchesStart &&
            matchesEnd;

    });

    // Sorting.
    switch (sortFilter.value) {
        case "newest":
            filtered.sort((a, b) =>
                b.date.localeCompare(a.date) ||
                b.id.localeCompare(a.id)
            );
            break;
        case "oldest":
            filtered.sort((a, b) =>
                a.date.localeCompare(b.date) ||
                a.id.localeCompare(b.id)
            );
            break;
        case "highest":
            filtered.sort((a, b) => b.amount - a.amount);
            break;
        case "lowest":
            filtered.sort((a, b) => a.amount - b.amount);
            break;
    }
    return filtered;
}

/* === TRANSACTION LIST RENDERING === */
function renderTransactions() {
    const filtered = getFilteredTransactions();
    transactionList.innerHTML = "";
    emptyState.style.display =
        filtered.length === 0 ? "block" : "none";

    filtered.forEach(transaction => {
        const row = document.createElement("tr");
        const icon =
            CATEGORY_ICONS[transaction.category] ||
            "fa-wallet";

        const amountPrefix =
            transaction.type === "income" ? "+" : "-";

        row.innerHTML = `
            <td>
                <div class="transaction-name">
                    <div class="transaction-icon">
                        <i class="fa-solid ${icon}"></i>
                    </div>

                    <span>${escapeHTML(transaction.description)}</span>
                </div>
            </td>

            <td class="transaction-category">
                ${escapeHTML(transaction.category)}
            </td>

            <td class="transaction-date">
                ${formatDate(transaction.date)}
            </td>

            <td>
                <span class="type-badge ${transaction.type}">
                    ${transaction.type}
                </span>
            </td>

            <td class="amount-${transaction.type}">
                ${amountPrefix}${formatCurrency(transaction.amount)}
            </td>
            <td>
                <div class="action-buttons">
                    <button
                        class="action-btn"
                        data-action="edit"
                        data-id="${escapeHTML(transaction.id)}"
                        title="Edit"
                        aria-label="Edit transaction">

                        <i class="fa-solid fa-pen"></i>
                    </button>

                    <button
                        class="action-btn delete-btn"
                        data-action="delete"
                        data-id="${escapeHTML(transaction.id)}"
                        title="Delete"
                        aria-label="Delete transaction">

                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        transactionList.appendChild(row);
    });
}

// Event delegation for edit and delete buttons.
transactionList.addEventListener("click", event => {
    const button = event.target.closest("button[data-action]");
    if (!button) return;

    const id = button.dataset.id;
    if (button.dataset.action === "edit") {
        editTransaction(id);
    }
    if (button.dataset.action === "delete") {
        deleteTransaction(id);
    }
});

/* === FILTER EVENT LISTENERS === */
searchInput.addEventListener("input", renderTransactions);
typeFilter.addEventListener("change", renderTransactions);
sortFilter.addEventListener("change", renderTransactions);
startDate.addEventListener("change", () => {
    if (endDate.value && startDate.value > endDate.value) {
        alert("Start date cannot be after end date.");
        startDate.value = "";
    }
    renderTransactions();
});

endDate.addEventListener("change", () => {
    if (startDate.value && endDate.value < startDate.value) {
        alert("End date cannot be before start date.");
        endDate.value = "";
    }
    renderTransactions();
});

document.getElementById("clearFilters").addEventListener("click", () => {
    searchInput.value = "";
    typeFilter.value = "all";
    sortFilter.value = "newest";
    startDate.value = "";
    endDate.value = "";
    renderTransactions();
});


/* =========================================
   12. MONTHLY BUDGET MANAGEMENT
========================================= */

document.getElementById("editBudget").addEventListener("click", () => {

    document.getElementById("budgetInput").value = monthlyBudget;

    budgetModal.classList.add("show");

});

document.getElementById("budgetForm").addEventListener("submit", event => {

    event.preventDefault();

    const newBudget = Number(
        document.getElementById("budgetInput").value
    );

    if (!Number.isFinite(newBudget) || newBudget <= 0) {
        alert("Please enter a valid budget.");
        return;
    }

    monthlyBudget = newBudget;

    saveBudget();

    budgetModal.classList.remove("show");

    renderBudget();

});


// Update budget progress and alerts.
function renderBudget() {
    const monthlyExpense = calculateTotals().monthlyExpense;
    const percentage = (monthlyExpense / monthlyBudget) * 100;
    const progress = document.getElementById("budgetProgress");
    const alertElement = document.getElementById("budgetAlert");
    const clampedPercentage = Math.min(percentage, 100);

    document.getElementById("budgetSpent").textContent =
        formatCurrency(monthlyExpense);

    document.getElementById("budgetLimit").textContent =
        formatCurrency(monthlyBudget);

    document.getElementById("budgetPercentage").textContent =
        `${percentage.toFixed(1)}% used`;

    document.getElementById("budgetRemaining").textContent =
        monthlyExpense > monthlyBudget
            ? `${formatCurrency(monthlyExpense - monthlyBudget)} over budget`
            : `${formatCurrency(monthlyBudget - monthlyExpense)} remaining`;
    progress.style.width = `${clampedPercentage}%`;
    progress.className = "progress-fill";
    alertElement.className = "budget-alert";

    if (percentage >= 100) {
        progress.classList.add("danger");
        alertElement.classList.add("danger");
        alertElement.textContent =
            "Budget exceeded! Review your monthly spending.";

    } else if (percentage >= 80) {
        progress.classList.add("warning");
        alertElement.classList.add("warning");
        alertElement.textContent =
          "Warning! You have used 80% or more of your budget.";
    } else {
        alertElement.textContent =
            "You're within your monthly budget. Keep it up!";
    }
}

/* === EXPENSE CATEGORY CHART === */
function renderCharts() {
    if (typeof Chart === "undefined") return;
    const currentMonthTransactions = transactions.filter(
        transaction =>
            transaction.type === "expense" &&
            transaction.date.startsWith(getCurrentMonth())
    );
    const categoryTotals = {};
    currentMonthTransactions.forEach(transaction => {
        categoryTotals[transaction.category] =
            (categoryTotals[transaction.category] || 0) +
            transaction.amount;
    });

    const categories = Object.keys(categoryTotals);
    const amounts = Object.values(categoryTotals);
    const chartColors = [
        "#6956e8",
        "#16a675",
        "#f2a44a",
        "#e45d6a",
        "#4da4d9",
        "#b47ce0",
        "#e7bd4d",
        "#54b6aa",
        "#8991a7"
    ];

    // Destroy previous chart before recreating.
    if (expenseChart) {
        expenseChart.destroy();
    }

    expenseChart = new Chart(
        document.getElementById("expenseChart"),
        {
            type: "doughnut",

            data: {
                labels: categories,

                datasets: [{
                    data: amounts,
                    backgroundColor: chartColors,
                    borderWidth: 0,
                    hoverOffset: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: "bottom", 
                        labels: {
                            usePointStyle: true,
                            padding: 15,
                            font: {
                                size: 10
                            }
                        }
                    },

                    tooltip: {
                        callbacks: {
                            label: context =>
                                `${context.label}: ${formatCurrency(context.raw)}`
                        }
                    }
                },

                cutout: "68%"
            }
        }
    );

/*  INCOME VS EXPENSES CHART === */
    const months = [];
    const incomeData = [];
    const expenseData = [];
    for (let i = 5; i >= 0; i--) {
        const date = new Date();
        date.setDate(1);
        date.setMonth(date.getMonth() - i);
        const monthKey =
            `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

        months.push(
            date.toLocaleDateString("en-IN", {
                month: "short"
            })
        );
        let income = 0;
        let expense = 0;
        transactions.forEach(transaction => {
            if (transaction.date.startsWith(monthKey)) {
                if (transaction.type === "income") {
                    income += transaction.amount;
                } else {
                    expense += transaction.amount;
                }
            }
        });
        incomeData.push(income);
        expenseData.push(expense);

    }

    if (overviewChart) {
        overviewChart.destroy();
    }

    overviewChart = new Chart(
        document.getElementById("overviewChart"),
        {
            type: "bar",

            data: {
                labels: months,

                datasets: [
                    {
                        label: "Income",
                        data: incomeData,
                        backgroundColor: "#16a675",
                        borderRadius: 5
                    },
                    {
                        label: "Expenses",
                        data: expenseData,
                        backgroundColor: "#e45d6a",
                        borderRadius: 5
                    }
                ]
            },

            options: {
                responsive: true,
                maintainAspectRatio: false,

                plugins: {
                    legend: {
                        position: "bottom",

                        labels: {
                            usePointStyle: true,
                            padding: 15,
                            font: {
                                size: 10
                            }
                        }
                    },

                    tooltip: {
                        callbacks: {
                            label: context =>
                                `${context.dataset.label}: ${formatCurrency(context.raw)}`
                        }
                    }
                },

                scales: {
                    x: {
                        grid: {
                            display: false
                        }
                    },
                    y: {
                        beginAtZero: true,

                        ticks: {
                            callback: value =>
                                "₹" + Number(value).toLocaleString("en-IN")
                        }
                    }
                }
            }
        }
    );
}

/* === EXPORT TRANSACTIONS TO CSV === */
document.getElementById("exportCSV").addEventListener("click", () => {
    if (transactions.length === 0) {
        alert("No transactions available to export.");
        return;
    }
    const headers = [
        "Description",
        "Amount",
        "Type",
        "Category",
        "Date"
    ];
    const escapeCSV = value =>
        `"${String(value).replace(/"/g, '""')}"`;
    const rows = transactions.map(transaction => [
        transaction.description,
        transaction.amount,
        transaction.type,
        transaction.category,
        transaction.date

    ].map(escapeCSV).join(","));

    const csvContent = [
        headers.map(escapeCSV).join(","),
        ...rows
    ].join("\r\n");

    // Create downloadable CSV file.
    const blob = new Blob(
        ["\uFEFF" + csvContent],
        {
            type: "text/csv;charset=utf-8;"
        }
    );
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `fintrack-transactions-${getToday()}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
});


/* === DATE & NAVIGATION === */
// Display current date.
document.getElementById("currentDate").textContent =
    new Date().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric"
    });

// Highlight active navigation item.
document.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("click", () => {
        document.querySelectorAll(".nav-link").forEach(item => {
            item.classList.remove("active");
        });
        link.classList.add("active");
    });
});


/* === APPLICATION INITIALIZATION === */

// Render the complete application on page load.
function initApp() {
    updateCategories();
    renderDashboard();
}
initApp();
