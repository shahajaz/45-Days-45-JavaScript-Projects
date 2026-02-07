const display = document.getElementById("display");
const buttons = document.querySelectorAll(".btn");

buttons.forEach((button) => {
    button.addEventListener("click", () => {
        const value = button.dataset.value;
        const text = button.innerText;
        
        if (value === "clear") {
            display.value = "";
            return;
        }
        
        if (text === "C") {
            display.value = display.value.slice(0, -1);
            return;
        }
        
        if (text === "=") {
            try {
                display.value = eval(display.value);
            } catch (error) {
                display.value = "Error";
            }
            return;
        }
        
        display.value += value;
    });
});
