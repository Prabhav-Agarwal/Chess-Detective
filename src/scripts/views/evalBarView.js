class evalBar {
  #parentElement = document.querySelector(".eval-bar");
  #whiteEval = document.querySelector(".white-eval");
  #evalBarTrack = document.querySelector(".eval-bar-track");
  #currEvalValue = document.querySelector(".curr-eval-value");
  evalPrespective = "white";

  updateEvalBar({ currMoveCp, currMoveWinPctg }) {
    this.#whiteEval.style.height = `${currMoveWinPctg}%`;
    this.#setCurrEvalPos(currMoveWinPctg);
    console.log(currMoveCp);
    this.#currEvalValue.textContent = `${currMoveCp / 100}`;
  }

  #setCurrEvalPos(currMoveWinPctg) {
    if (this.evalPrespective === "white") {
      this.#currEvalValue.style.top = `${100 - currMoveWinPctg}%`;
    }
    if (this.evalPrespective === "black") {
      this.#currEvalValue.style.top = `${currMoveWinPctg}%`;
    }
  }

  flipEvalPrespective(evalPrespective) {
    this.evalPrespective = evalPrespective;
    const rotateBy = this.evalPrespective === "white" ? "0deg" : "180deg";
    this.#evalBarTrack.style.transform = `rotate(${rotateBy})`;
    console.log(this.#currEvalValue.style.top.slice(0, -1));
    this.#currEvalValue.style.top = `${100 - +this.#currEvalValue.style.top.slice(0, -1)}%`;
  }
}

export default new evalBar();
