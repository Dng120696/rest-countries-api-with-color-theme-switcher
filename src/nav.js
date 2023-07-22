export const menu = document.querySelector(".menu");
export const lightMode = document.querySelector(".light-mode");
export const darkMode = document.querySelector(".dark-mode");
export const menuTitle = document.querySelector(".menu-title");
export class NavMenu {
  constructor() {
    menu.addEventListener("click", this._ligthMode.bind(this));
  }
  _ligthMode() {
    lightMode.classList.toggle("hidden");
    darkMode.classList.toggle("hidden");

    const isDarkMode = darkMode.classList.contains("hidden");
    document.querySelector("body").classList.toggle("light-mode", !isDarkMode);
    menuTitle.textContent = !isDarkMode ? "Dark Mode" : "Light Mode";
    localStorage.setItem(
      "modePreference",
      !isDarkMode ? "light-mode" : "dark-mode"
    );
  }
}
