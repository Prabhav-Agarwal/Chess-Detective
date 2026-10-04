import View from "./View";

class EngineLinesSection extends View {
  #parentElement = document.querySelector(".engine-line-section");
  #selectedPly;
  constructor() {
    super();
  }

  get parentElement() {
    return this.#parentElement;
  }

  #generateHtmlStr(lineNum, { plyNum, currPly }) {
    return `<div class="move-ply data-ply-num=${plyNum} data-line-num = ${lineNum}">${currPly}</div>`;
  }

  #updateEngineLine(lineNum, engineLinePliesArr) {
    const htmlStr = engineLinePliesArr
      .map((plyObj) => this.#generateHtmlStr(lineNum, plyObj))
      .join("");
    const movePliesContainer = document.querySelector(
      `.move-plies-line-${lineNum}`,
    );
    movePliesContainer.insertAdjacentHTML("afterbegin", htmlStr);
  }

  #removeAllPlies() {
    const allMovePlies = document.querySelectorAll(".move-ply");
    allMovePlies.forEach((ply) => ply.remove());
  }

  updateEngineLineSection({ line1, line2 }) {
    this.#removeAllPlies();
    this.#updateEngineLine(1, line1);
    this.#updateEngineLine(2, line2);
    const evalLine1 = document.querySelector(".engine-eval-line-1");
    const evalLine2 = document.querySelector(".engine-eval-line-2");

    const EvalLine1 = line1[0].currMoveCp / 100;
    const EvalLine2 = line2[0].currMoveCp / 100;
    evalLine1.textContent = EvalLine1;
    evalLine2.textContent = EvalLine2;

    if (EvalLine1 < 0) {
      evalLine1.classList.add("is-negative");
    } else evalLine1.classList.remove("is-negative");
    if (EvalLine2 < 0) {
      evalLine2.classList.add("is-negative");
    } else evalLine2.classList.remove("is-negative");
  }

  addHandlerRenderPosition(handler) {
    this.#parentElement.addEventListener("click", (event) => {
      const target = event.target.closest(".move-ply");
      //guard clause
      if (!target) return;

      this.removeCurrPlyHighlight();
      this.#highlightCurrPly(target);

      const plyNum = target.dataset.plyNum;
      const lineNum = target.dataset.lineNum;
      handler(plyNum, lineNum);
    });
  }

  #highlightCurrPly(targetPly) {
    this.#selectedPly = targetPly;
    this.#selectedPly.classList.add("is-current-ply");
  }
  removeCurrPlyHighlight() {
    if (!this.#selectedPly) return;
    this.#selectedPly = null;
    this.#selectedPly.classList.remove("is-current-ply");
  }
}

export default new EngineLinesSection();
