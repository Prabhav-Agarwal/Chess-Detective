import View from "./View";

class gameAccuracySection extends View {
  #parentElement = document.querySelector(".player-accuracy-section");
  constructor() {
    super();
  }

  #generateHtmlStr({
    player1: { avatar1, accuracy1 },
    player2: { avatar2, accuracy2 },
  }) {
    `<div class="white-accuracy-section">
        <img src="${avatar1}" alt="white-avatar" class="player-avatar white-avatar" />
        <div class="player-accuracy white-accuracy">${accuracy1}</div>
      </div>
      <div class="black-accuracy-section">
        <img src="${avatar2}" alt="black-avatar" class="player-avatar black-avatar" />
        <div class="player-accuracy black-accuracy">${accuracy2}</div>
      </div>`;
  }

  updatePlayerAccuracies(playerAccuracyObj) {
    const htmlStr = this.#generateHtmlStr(playerAccuracyObj);
    this.updateHtml(this.#parentElement, htmlStr);
  }
}

export default new gameAccuracySection();
