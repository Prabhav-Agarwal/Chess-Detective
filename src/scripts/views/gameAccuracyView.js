import View from "./View";

class gameAccuracySection extends View {
  #parentElement = document.querySelector(".player-accuracy-section");
  constructor() {
    super();
  }

  get parentElement() {
    return this.#parentElement;
  }

  updatePlayerAccuracies({ white, black }) {
    const whiteAccuracy = document.querySelector(".white-accuracy");
    const blackAccuracy = document.querySelector(".black-accuracy");

    whiteAccuracy.textContent = `${white}%`;
    blackAccuracy.textContent = `${black}%`;
  }
}

export default new gameAccuracySection();
