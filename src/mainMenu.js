import { darkMode, lightMode, menuTitle, NavMenu } from "./nav.js";
import { viewCountry } from "./controller.js";
export const countrydata = document.querySelector(".country-data");
const inputSearch = document.getElementById("input-search");
const inputSection = document.querySelector(".input-section");
const region = document.getElementById("region");
const selectedCountry = document.querySelector(".selected-country");
class MainMenu {
  #newData;
  originalData;
  constructor() {
    this.applyModePreference();
    region.addEventListener("change", this.regionFilter.bind(this));
    inputSearch.addEventListener("input", this.countryFilter.bind(this));
    countrydata.addEventListener("click", this.countrySelect.bind(this));
  }

  async fetchData() {
    try {
      const res = await fetch("./data.json");
      const data = await res.json();
      this.originalData = data;
      this.#newData = this.originalData;

      return this.#newData;
    } catch (error) {
      console.log(error);
    }
  }
  renderFakeSpinner(parent, sec) {
    return new Promise((resolve) => {
      this.renderSpinner(parent);
      setTimeout(resolve, sec * 1000);
    });
  }

  renderSpinner(parent) {
    const html = `
        <div class="spinner">
        <img src="./images/loading.svg" alt="" width="500px" height="500px" />
      </div>`;
    parent.innerHTML = "";

    parent.insertAdjacentHTML("beforeend", html);
  }
  renderCountry(data) {
    countrydata.innerHTML = "";

    data.forEach((el, i) => {
      const { png } = el.flags;

      const html = `
      <article class="country-box box flex flex-col" data-index = '${i}'>
        <div class="img-flag">
        <img src="${png}" alt="" />
        </div>
        <div class="country-info">
        <h2 class="country-name"> ${el.name}</h2>
        <p class="population">
        <span> 
        Population:
        </span>
         ${el.population.toLocaleString()}</p>
        <p class="region">
        <span> 
        Region:
        </span>
         ${el.region}</p>
        <p class="capital">
        <span> 
        Capital:
        </span>
         ${el.capital ?? "No Capital"}</p>
        </div>
      </article> 
      `;
      countrydata.insertAdjacentHTML("beforeend", html);
      const countryObserver = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            const { target, isIntersecting } = entry;
            target.classList.toggle("show", isIntersecting);
            if (isIntersecting) {
              observer.unobserve(target);
            }
          });
        },
        { root: null, threshold: 0.5 }
      );

      document.querySelectorAll(".country-box").forEach((box) => {
        countryObserver.observe(box);
      });
    });
  }
  renderSelectedCountry(data, i) {
    selectedCountry.innerHTML = "";
    const { svg } = data.flags;
    const [domain] = data.topLevelDomain;
    const language = data.languages.map((data) => data.name).join(", ");

    const filterBorder = this.originalData.filter((datas) => {
      if (!data.borders) return false;
      return data.borders.includes(datas.alpha3Code);
    });

    const borderCountryName =
      filterBorder.length > 0
        ? filterBorder
            .map((border) => `<button> ${border.name} </button>`)
            .join("")
        : " No border Countries";
    const html = `
      <button class = 'btn-back'>
      Go back</button>
      <div class = 'flex flex-col'>
        <div class = 'img-selected'>
        <img src ='${svg}' alt= ''>
        </div>
        <div class = 'selected-info'>
        <h1> ${data.name}
        </h1>
        <div class = 'flex flex-col country-all-info'>
        <div class = 'flex flex-col'>
          <div>
          <p> Native Name: <span> ${data.nativeName}
          </span></p>
          <p> Population: <span> ${data.population.toLocaleString()}
          </span></p>
          <p> Region: <span> ${data.region}
          </span></p>
          <p> Sub Region:<span> ${data.subregion}
          </span></p>
          <p> Capital: <span> ${data.capital ?? "No Capital"}
          </span></p>
          </div>
          <div>
          <p>Top Level Domain:<span> ${domain}
          </span></p>
          <p>Currencies: <span> ${
            data.currencies ? data.currencies[0].name : "No currency"
          }
          </span></p>
          <p>Languages:<span> ${language}
          </span></p>
          </div>
        </div>
        <p class = 'btn-border'>
        <span>
        Border Countries: 
        </span>
          <span > ${borderCountryName}</span>
         </p>
         </div>
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
      .addEventListener("click", this.selectBorder.bind(this));
  }
  async selectBorder(e) {
    const el = e.target.closest("button");
    if (!el) return;
    const findSelectedCountry = this.originalData.find(
      (data) => data.name.toLowerCase() === el.textContent.trim().toLowerCase()
    );
    await this.renderFakeSpinner(selectedCountry, 0.5);

    this.renderSelectedCountry(findSelectedCountry);
  }

  async countrySelect(e) {
    e.preventDefault();
    const el = e.target.closest(".country-box");
    if (!el) return;

    const indexes = +el.dataset.index;

    const selectedCountry = this.#newData[indexes];
    await this.renderFakeSpinner(countrydata, 0.5);
    this.renderSelectedCountry(selectedCountry, indexes);
  }

  async countryFilter(e) {
    const inputVal = e.target.value.toLowerCase();
    const regionVal = region.value;

    !inputVal
      ? (this.#newData = this.originalData.filter(
          (data) =>
            data.region === regionVal ||
            regionVal === "All" ||
            regionVal === "filterRegion"
        ))
      : (this.#newData = this.originalData.filter(
          (data) =>
            data.name.toLowerCase().includes(inputVal) &&
            (data.region === regionVal ||
              regionVal === "All" ||
              regionVal === "filterRegion")
        ));
    await this.renderFakeSpinner(countrydata, 0.5);
    this.renderCountry(this.#newData);
  }
  async regionFilter() {
    const regionVal = region.value;
    regionVal === "All" || regionVal === "filterRegion"
      ? (this.#newData = this.originalData)
      : (this.#newData = this.originalData.filter(
          (data) => data.region === regionVal
        ));
    await this.renderFakeSpinner(countrydata, 0.5);
    this.renderCountry(this.#newData);
  }

  buttonBack() {
    countrydata.classList.remove("hide-country");
    inputSection.classList.remove("hide-country");
    selectedCountry.classList.remove("show-selected");
    viewCountry();
  }
  applyModePreference() {
    const modePreference = localStorage.getItem("modePreference");
    const isDarkMode = modePreference === "dark-mode";
    document.querySelector("body").classList.toggle("light-mode", !isDarkMode);
    lightMode.classList.toggle("hidden", !isDarkMode);
    darkMode.classList.toggle("hidden", isDarkMode);
    menuTitle.textContent = !isDarkMode ? "Dark Mode" : "Light Mode";
  }
}

export default new MainMenu();
const nav = new NavMenu();
