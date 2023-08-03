import mainMenu from "./mainMenu.js";

export const viewCountry = async function () {
  try {
    mainMenu.renderSpinner();
    const data = await mainMenu.fetchData();
    mainMenu.renderCountry(data);
  } catch (error) {
    console.log(error);
  }
};
viewCountry();
