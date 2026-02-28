const countriesContainer = document.querySelector(".countries-container");

fetch("https://restcountries.com/v3.1/all?fields=name,capital,population,flags")
    .then((response) => response.json())
    .then((data) => {
        data.forEach((country) => {
            
            const countryCard = document.createElement("a");
            countryCard.classList.add("countryCard");
            
            const HTML = `
            <img src="${country.flags.svg}" alt="${country.name.common} Flag">
            
            <div class="card-text">
                <h3>${country.name.common}</h3>
                <p><b>Capital:</b> ${country.capital}</p>
                <p><b>Population:</b> ${country.population.toLocaleString()}</p>
            </div>
`;

countryCard.innerHTML = HTML;

countriesContainer.appendChild(countryCard);
        });
    });