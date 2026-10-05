class NavBtnView {
  #parentElement = document.querySelector(".board-nav-bar");
  #previousBtn = document.querySelector(".previous-move-btn");
  #firstMoveBtn = document.querySelector(".first-move-btn");
  #playBtn = document.querySelector(".play-btn");
  #nextMoveBtn = document.querySelector(".next-move-btn");
  #lastMoveBtn = document.querySelector(".last-move-btn");
  currentPlyNum = 0;
  lastPlyNum;

  constructor() {
    this.#updateNavBtnState();
  }

  addHandlerNavBtnClick(handler) {
    this.#parentElement.addEventListener("click", async (event) => {
      const target = event.target.closest(".board-nav-btn");
      if (!target) return;

      //first move btn
      if (target.classList.contains("first-move-btn")) {
        this.currentPlyNum = 0;
        this.#updateNavBtnState();
        handler(this.currentPlyNum);
      }

      //previous move btn
      if (target.classList.contains("previous-move-btn")) {
        if (this.currentPlyNum === 0) return;

        this.currentPlyNum--;
        this.#updateNavBtnState();
        handler(this.currentPlyNum);
      }

      //play btn
      if (target.classList.contains("play-btn")) {
        if (target.classList.contains("is-playing")) {
          target.classList.remove("is-playing");
        } else {
          target.classList.add("is-playing");
          while (this.currentPlyNum != this.lastPlyNum) {
            this.currentPlyNum++;
            this.#updateNavBtnState();
            handler(this.currentPlyNum);

            await new Promise((resolve) => {
              setTimeout(() => {
                resolve();
              }, 1500);
            });

            if (!target.classList.contains("is-playing")) break;
          }
          target.classList.remove("is-playing");
        }
      }

      //next move btn
      if (target.classList.contains("next-move-btn")) {
        if (this.currentPlyNum === this.lastPlyNum) return;

        //rendering position
        this.currentPlyNum++;
        this.#updateNavBtnState();
        handler(this.currentPlyNum);
      }

      //last move btn
      if (target.classList.contains("last-move-btn")) {
        this.currentPlyNum = this.lastPlyNum;
        this.#updateNavBtnState();
        handler(this.currentPlyNum);
      }
    });
  }

  #disablePrevAndFirstBtn() {
    this.#previousBtn.classList.add("is-disabled");
    this.#firstMoveBtn.classList.add("is-disabled");
  }
  #enablePrevAndFirstBtn() {
    this.#previousBtn.classList.remove("is-disabled");
    this.#firstMoveBtn.classList.remove("is-disabled");
  }

  #disableNextAndLastBtn() {
    this.#nextMoveBtn.classList.add("is-disabled");
    this.#lastMoveBtn.classList.add("is-disabled");
  }

  #enableNextAndLastBtn() {
    this.#nextMoveBtn.classList.remove("is-disabled");
    this.#lastMoveBtn.classList.remove("is-disabled");
  }

  #updateNavBtnState() {
    if (this.currentPlyNum === 0) {
      this.#disablePrevAndFirstBtn();
    } else {
      this.#enablePrevAndFirstBtn();
    }

    if (this.currentPlyNum === this.lastPlyNum) {
      this.#disableNextAndLastBtn();
    } else {
      this.#enableNextAndLastBtn();
    }
  }

  updateNavBtnState() {
    this.#updateNavBtnState();
  }
}

export default new NavBtnView();
