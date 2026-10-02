import View from "./View";

class BestMoveSection extends View {
  #parentElement = document.querySelector(".best-move-section");

  constructor() {
    super();
  }

  get parentElement() {
    return this.#parentElement;
  }

  #generateHtmlStr({ currMove, classification, bestMove }) {
    return `
        <div class="curr-move-descrip ${`is-${classification}` || ""}">
            <span class="curr-move-icon"></span>
            <span class="curr-move-text">${move} is ${classification}</span>
        </div>
        <div class="best-move ${currMove === bestMove ? "is-hidden" : ""}">
            The best move was <span class="best-move-btn">${bestMove}</span>
        </div>
    `;
  }

  updateCurrMoveDescrip(moveObj) {
    const htmlStr = this.#generateHtmlStr(moveObj);
    this.updateHtml(this.#parentElement, htmlStr);
    const svgBox = document.querySelector(".curr-move-icon");
    this.#addClassificationSvg(svgBox, moveObj.classification);
  }

  #addClassificationSvg(container, classification) {
    const svg = document.querySelector(`.${classification}`).cloneNode(true);
    if (!svg) return;
    container.append(svg);
  }

  addHandlerBestMove(handler) {
    const bestMoveBtn = document.querySelector(".best-move-btn");
    bestMoveBtn.addEventListener("click", (e) => {
      handler(); ////////////////////////// Something to add................................
    });
  }
}

export default new BestMoveSection();
