const billAmount = document.getElementById("billAmount");
const customTip = document.getElementById("customTip");
const people = document.getElementById("people");

const tipButtons = document.querySelectorAll(".tip-btn");
const decreasePeople = document.getElementById("decreasePeople");
const increasePeople = document.getElementById("increasePeople");
const resetBtn = document.getElementById("resetBtn");

// Error Elements
const billError = document.getElementById("billError");
const tipError = document.getElementById("tipError");
const peopleError = document.getElementById("peopleError");

// Result Elements
const resultBill = document.getElementById("resultBill");
const resultTipPercent = document.getElementById("resultTipPercent");
const resultTip = document.getElementById("resultTip");
const resultTotal = document.getElementById("resultTotal");
const tipPerPerson = document.getElementById("tipPerPerson");
const billPerPerson = document.getElementById("billPerPerson");
const totalPerPerson = document.getElementById("totalPerPerson");

/* Application State */
let selectedTip = 15;

/* Currency Formatter */
function formatCurrency(amount) {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(amount);
}

/* Get Selected Tip */
function getTipPercentage() {
    if (customTip.value.trim() !== "") {
        return Number(customTip.value);
    }
    return selectedTip;
}

/* Input Validation */
function validateInputs() {
    let isValid = true;
    const bill = billAmount.value.trim();
    const tip = customTip.value.trim();
    const numberOfPeople = people.value.trim();

    billError.textContent = "";
    tipError.textContent = "";
    peopleError.textContent = "";

    // Validate Bill Amount
    if (bill === "") {
        billError.textContent = "Please enter the bill amount.";
        isValid = false;
    } else if (!Number.isFinite(Number(bill)) || Number(bill) <= 0) {
        billError.textContent = "Bill amount must be greater than zero.";
        isValid = false;
    }

    // Validate Custom Tip
    if (tip !== "") {

        const tipValue = Number(tip);

        if (!Number.isFinite(tipValue) || tipValue < 0 || tipValue > 100) {
            tipError.textContent = "Tip must be between 0% and 100%.";
            isValid = false;
        }
    }

    // Validate People
    const peopleValue = Number(numberOfPeople);
    if (
        numberOfPeople === "" ||
        !Number.isInteger(peopleValue) ||
        peopleValue < 1
    ) {
        peopleError.textContent = "Enter a valid number of people.";
        isValid = false;
    }
    return isValid;
}

/* Calculate Tip */
function calculateTip() {
    if (!validateInputs()) {
        resetResults();
        return;
    }
    const bill = Number(billAmount.value);
    const tipPercentage = getTipPercentage();
    const numberOfPeople = Number(people.value);

    // Calculate Total Tip
    const tipAmount = bill * (tipPercentage / 100);

    // Calculate Total Bill
    const totalBill = bill + tipAmount;

    // Calculate Per Person Amounts
    const tipEach = tipAmount / numberOfPeople;
    const billEach = bill / numberOfPeople;
    const totalEach = totalBill / numberOfPeople;

    // Update Results
    resultBill.textContent = formatCurrency(bill);
    resultTipPercent.textContent = `${tipPercentage}%`;
    resultTip.textContent = formatCurrency(tipAmount);
    resultTotal.textContent = formatCurrency(totalBill);
    tipPerPerson.textContent = formatCurrency(tipEach);
    billPerPerson.textContent = formatCurrency(billEach);
    totalPerPerson.textContent = formatCurrency(totalEach);
}

/* Reset Results */
function resetResults() {
    resultBill.textContent = formatCurrency(0);
    resultTipPercent.textContent = `${getTipPercentage()}%`;
    resultTip.textContent = formatCurrency(0);
    resultTotal.textContent = formatCurrency(0);
    tipPerPerson.textContent = formatCurrency(0);
    billPerPerson.textContent = formatCurrency(0);
    totalPerPerson.textContent = formatCurrency(0);
}

/* Predefined Tip Buttons */
tipButtons.forEach(button => {
    button.addEventListener("click", () => {
        selectedTip = Number(button.dataset.tip);
        customTip.value = "";

        // Update Active Button
        tipButtons.forEach(btn => {
            btn.classList.remove("active");
        });
        button.classList.add("active");

        calculateTip();
    });
});

/* Custom Tip Input */
customTip.addEventListener("input", () => {
    tipButtons.forEach(button => {
        button.classList.remove("active");
    });
    calculateTip();
});

/* Bill Amount Input */
billAmount.addEventListener("input", calculateTip);

/* People Input */
people.addEventListener("input", calculateTip);

/* Increase People */
increasePeople.addEventListener("click", () => {
    const currentPeople = Number(people.value) || 0;

    people.value = currentPeople + 1;

    calculateTip();
});

/* Decrease People */
decreasePeople.addEventListener("click", () => {
    const currentPeople = Number(people.value);

    if (currentPeople > 1) {
        people.value = currentPeople - 1;
    }
    calculateTip();
});

/* Reset Calculator */
resetBtn.addEventListener("click", () => {

    // Reset Inputs
    billAmount.value = "";
    customTip.value = "";
    people.value = 1;

    // Reset Selected Tip
    selectedTip = 15;

    tipButtons.forEach(button => {
        button.classList.remove("active");
        if (Number(button.dataset.tip) === 15) {
            button.classList.add("active");
        }
    });

    // Clear Errors
    billError.textContent = "";
    tipError.textContent = "";
    peopleError.textContent = "";

    // Reset Results
    resetResults();

});

resetResults();
