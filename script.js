"use strict";
const menu = document.querySelector(".menu");
const lightMode = document.querySelector(".light-mode");
const darkMode = document.querySelector(".dark-mode");
const menuTitle = document.querySelector(".menu-title");
class NavMenu {
  constructor() {
    menu.addEventListener("click", this._ligthMode.bind(this));
  }
  _ligthMode() {
    lightMode.classList.toggle("hidden");
    darkMode.classList.toggle("hidden");

    if (darkMode.classList.contains("hidden")) {
      document.querySelector("body").classList.add("light-mode");
      menuTitle.textContent = "Light Mode";
      localStorage.setItem("modePreference", "light-mode");
    } else {
      document.querySelector("body").classList.remove("light-mode");
      menuTitle.textContent = "Dark Mode";
      localStorage.setItem("modePreference", "dark-mode");
    }
  }
}

const countrydata = document.querySelector(".country-data");
const inputSearch = document.getElementById("input-search");
const inputSection = document.querySelector(".input-section");
const region = document.getElementById("region");
const selectedCountry = document.querySelector(".selected-country");
class MainMenu {
  #newData;
  #originalData;
  constructor() {
    this._fetchData();
    this._applyModePreference();
    region.addEventListener("change", this._regionFilter.bind(this));
    inputSearch.addEventListener("input", this._countryFilter.bind(this));
    countrydata.addEventListener("click", this._countrySelect.bind(this));
  }

  _fetchData() {
    fetch("./data.json")
      .then((res) => res.json())
      .then((data) => {
        this.#originalData = data;
        this.#newData = this.#originalData;
        this._renderCountry(this.#newData);
      })
      .catch((error) => console.log(error));
  }

  _selectBorder(e) {
    const el = e.target.closest("button");
    if (!el) return;

    console.log(el.textContent);
    const findSelectedCountry = this.#newData.find((data) => {
      console.log(data.name === el.textContent);
      return data.name === el.textContent.trim();
    });
    this._renderSelectedCountry(findSelectedCountry);
  }

  _countrySelect(e) {
    const el = e.target.closest(".country-box");
    if (!el) return;
    const indexes = +el.dataset.index;
    const selectedCountry = this.#newData[indexes];
    this._renderSelectedCountry(selectedCountry, indexes);
  }

  _countryFilter(e) {
    const inputval = e.target.value.toLowerCase();
    if (!inputval) {
      this._renderCountry(this.#originalData);
    }
    const filterCountry = this.#originalData.filter((data) =>
      data.name.toLowerCase().includes(inputval)
    );
    this.#newData = filterCountry;
    this._renderCountry(this.#newData);
  }
  _regionFilter() {
    const regionVal = region.value;
    if (regionVal === "filterRegion") {
      this._renderCountry(this.#originalData);
    }
    switch (regionVal) {
      case "Asia":
      case "Africa":
      case "Americas":
      case "Europe":
      case "Oceania":
        const filterRegion = this.#originalData.filter(
          (data) => data.region === regionVal
        );
        this.#newData = filterRegion;
        this._renderCountry(this.#newData);
        break;
    }
  }

  _renderCountry(data) {
    countrydata.innerHTML = "";

    data.forEach((el, i) => {
      const { png } = el.flags;

      const html = `
      <article class="country-box box flex flex-col" data-index = '${i}' id = ${i}>
        <div class="img-flag">
        <img src="${png}" alt="" />
        </div>
        <div class="country-info">
        <h2 class="country-name">${el.name}</h2>
        <p class="population">Population:${el.population.toLocaleString()}</p>
        <p class="region">Region:${el.region}</p>
        <p class="capital">Capital:${el.capital}</p>
        </div>
      </article> 
      `;
      countrydata.insertAdjacentHTML("beforeend", html);
    });
  }

  _renderSelectedCountry(data, i) {
    selectedCountry.innerHTML = "";
    const { png } = data.flags;
    const [domain] = data.topLevelDomain;
    const language = data.languages.map((data) => data.name).join(", ");

    const filterBorder = this.#originalData.filter((datas) => {
      if (!data.borders) return false;
      return data.borders.includes(datas.alpha3Code);
    });

    const borderCountryName =
      filterBorder.length > 0
        ? filterBorder
            .map((border) => `<button> ${border.name} </button>`)
            .join("")
        : "No border Countries";
    const html = `
      <button class = 'btn-back'>
      <a href = '#${i}'>
      Go back
      </a></button>
      <div class = 'flex flex-col'>
        <div class = 'img-selected'>
        <img src ='${png}' alt= ''>
        </div>
        <div class = 'selected-info'>
        <h1> ${data.name}
        </h1>
        <div class = 'flex flex-col'>
          <div>
          <p> Native Name: <span>${data.nativeName}
          </span></p>
          <p> Population: <span>${data.population.toLocaleString()}
          </span></p>
          <p> Region: <span>${data.region}
          </span></p>
          <p> Sub Region:<span> ${data.subregion}
          </span></p>
          <p> Capital: <span>${data.capital}
          </span></p>
          </div>
          <div>
          <p>Top Level Domain:<span> ${domain}
          </span></p>
          <p>Currencies: <span>${data.currencies[0].name}
          </span></p>
          <p>Languages:<span> ${language}
          </span></p>
          </div>
        </div>
        <p class = 'btn-border flex flex-col'>
        <span>
        Border Countries: 
        </span>
          <span class ='flex'>${borderCountryName}</span>
         </p>
        </div>
  
      </div>
    `;
    selectedCountry.insertAdjacentHTML("beforeend", html);

    countrydata.classList.add("hide-country");
    inputSection.classList.add("hide-country");
    selectedCountry.classList.add("show-selected");

    document
      .querySelector(".btn-back")
      .addEventListener("click", this.buttonBack);

    document
      .querySelector(".btn-border")
      .addEventListener("click", this._selectBorder.bind(this));
  }
  buttonBack() {
    countrydata.classList.remove("hide-country");
    inputSection.classList.remove("hide-country");
    selectedCountry.classList.remove("show-selected");
  }
  _applyModePreference() {
    const modePreference = localStorage.getItem("modePreference");

    if (modePreference === "light-mode") {
      document.querySelector("body").classList.add("light-mode");
      lightMode.classList.remove("hidden");
      darkMode.classList.add("hidden");
      menuTitle.textContent = "Light Mode";
    } else {
      document.querySelector("body").classList.remove("light-mode");
      lightMode.classList.add("hidden");
      darkMode.classList.remove("hidden");
      menuTitle.textContent = "Dark Mode";
    }
  }
}

const mainMenu = new MainMenu();
const nav = new NavMenu();
