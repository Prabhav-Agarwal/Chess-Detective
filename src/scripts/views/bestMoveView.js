import View from "./View";

class BestMoveSection extends View {
  #parentElement = document.querySelector(".best-move-section");

  constructor() {
    super();
  }

  get parentElement() {
    return this.#parentElement;
  }

  #generateHtmlStr({ currPly, plyNum, classification, bestMove }) {
    return `
        <div class="curr-move-descrip ${`is-${classification}` || ""}">
            <span class="curr-move-icon"></span>
            <span class="curr-move-text">${currPly} is ${classification}</span>
        </div>
        <div class="best-move ${currPly === bestMove ? "is-hidden" : ""}">
            The best move was <span class="best-move-btn" data-ply-num="${plyNum}">${bestMove}</span>
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

  addHandlerRenderPosition(handler) {
    this.#parentElement.addEventListener("click", (event) => {
      const target = event.target.closest(".best-move-btn");
      //guard clause
      if (!target) return;

      const plyNum = target.dataset.plyNum;
      handler(plyNum);
    });
  }
}

export default new BestMoveSection();
