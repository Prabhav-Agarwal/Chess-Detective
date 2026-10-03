class evalBar {
  #parentElement = document.querySelector(".eval-bar");
  #whiteEval = document.querySelector(".white-eval");
  #evalBarTrack = document.querySelector(".eval-bar-track");
  #currEvalValue = document.querySelector("curr-eval-value");

  updateEvalBar({ currMoveCp, currMoveWinPctg, evalPrespective = "white" }) {
    this.#whiteEval.style.height = `${currMoveWinPctg}%`;
    this.#setCurrEvalPos(evalPrespective, currMoveWinPctg);
    this.#currEvalValue.textContent = `${currMoveCp / 100}`;
  }

  #setCurrEvalPos(evalPrespective, currMoveWinPctg) {
    if (evalPrespective === "white") {
      this.#currEvalValue.style.top = `${100 - currMoveWinPctg}%`;
    }
    if (evalPrespective === "black") {
      this.#currEvalValue.style.top = `${currMoveWinPctg}%`;
    }
  }

  flipEvalPrespective(evalPrespective = "white") {
    const rotateBy = evalPrespective === "white" ? "0deg" : "180deg";
    this.#evalBarTrack.style.transform = `rotate(${rotateBy})`;
    this.#currEvalValue.style.top = `${100 - this.#currEvalValue.style.top}`;
  }
}

export default new evalBar();
