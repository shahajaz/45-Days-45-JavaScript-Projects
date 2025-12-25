let count = 0;

const value = document.getElementById("value");
const increaseBtn = document.getElementById("increase");
const decreaseBtn = document.getElementById("decrease");
const resetBtn = document.getElementById("reset");

increaseBtn.addEventListener("click", function (){
    count++;
    value.innerText = count;
});

decreaseBtn.addEventListener("click", function (){
    count--;
    value.innerText = count;
});

resetBtn.addEventListener("click", function (){
    count = 0;
    value.innerText = count;
});


