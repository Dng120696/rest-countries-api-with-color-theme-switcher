import mainMenu, { countrydata } from "./mainMenu.js";

export const viewCountry = async function () {
  try {
    mainMenu.renderSpinner(countrydata);
    const data = await mainMenu.fetchData();
    mainMenu.renderCountry(data);
  } catch (error) {
    console.log(error);
  }
};
viewCountry();
