const maxLength = 1000;
const textarea = document.getElementById("textarea");
const charCount = document.getElementById("char-count");
const remainingCount = document.getElementById("remaining-count");

textarea.addEventListener("input", function (){
    const currentLength = textarea.value.length;

    if (currentLength > maxLength){
        textarea.value = textarea.value.substring(0, maxLength);
    }

    charCount.innerText = textarea.value.length;
    remainingCount.innerText = maxLength - textarea.value.length;
});
