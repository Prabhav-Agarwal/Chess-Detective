import View from "./View";

class MoveListSection extends View {
  #parentElement = document.querySelector(".move-list-section");
  #moveList = document.querySelector(".move-list");
  #selectedPly;

  constructor() {
    super();
  }

  get parentElement() {
    return this.#parentElement;
  }

  #generateHtmlStr({ moveNum, whitePly, blackPly }) {
    return `
        <li class="move-row">
            <div class="move-num">${moveNum}</div>
            <div class="ply white-ply" data-ply-num="${moveNum * 2 - 1}">${whitePly || ""}</div>
            <div class="ply black-ply" data-ply-num="${moveNum * 2}">${blackPly || ""}</div>
        </li>
    `;
  }

  generateMoveList(moveList) {
    const htmlStr = this.#moveList
      .map((move) => this.#generateHtmlStr(move))
      .join("");
    this.updateHtml(this.#moveList, htmlStr);
  }

  //after move is clicked :
  //1) render fen after move is made on board
  //2) add move classification highlight on board (highlight squares , and add badge)
  //3) render best move descrip box
  //4) update evaluation bar

  addHandlerRenderPosition(handler) {
    this.#parentElement.addEventListener("click", (event) => {
      const target = event.target.closest(".ply");
      //guard clause
      if (!target) return;

      this.#removeCurrPlyHighlight();
      this.#selectedPly = target;

      this.#highlightCurrPly();

      const plyNum = target.dataset.plyNum;
      handler(plyNum);
    });
  }

  #highlightCurrPly() {
    this.#selectedPly.classList.add("is-current-ply");
  }
  #removeCurrPlyHighlight() {
    if (!this.#selectedPly) return;
    this.#selectedPly.classList.remove("is-current-ply");
  }
}

export default new MoveListSection();
