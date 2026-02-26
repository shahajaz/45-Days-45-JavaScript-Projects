

const countryCard = document.createElement("a");

countryCard.classList.add("countryCard");

const cardImg = document.createElement("img");
cardImg.src = "https://flagcdn.com/w320/in.png";
countryCard.append(cardImg);
console.log(cardImg);


// fetch("https://restcountries.com/v3.1/all?fields=name,flags,capital,population,region")
//     .then((response) => response.json())
//     .then((data) => {
//         data.forEach((country) => {
//             console.log(country);
//         });
//     })