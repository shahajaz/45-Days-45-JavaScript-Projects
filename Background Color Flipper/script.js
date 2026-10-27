const colors = ["red", "green", "blue", "orange", "purple", "black", "pink", "maroon", "yellow"];
const colorName = document.getElementById("color-name");
const btn = document.getElementById("btn");

function getRandomColor(){
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
}

btn.addEventListener("click", function (){
    const SelectedColor = getRandomColor();

    document.body.style.backgroundColor = SelectedColor;

    colorName.innerText = SelectedColor;
});



