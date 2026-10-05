class NavBtnView {
  #parentElement = document.querySelector(".board-nav-bar");
  currentPlyNum = 0;
  lastPlyNum;

  addHandlerNavBtnClick(handler) {
    this.#parentElement.addEventListener("click", (event) => {
      const target = event.target.closest(".board-nav-btn");
      if (!target) return;
      if (target.classList.contains("first-move-btn")) {
        this.currentPlyNum = 0;
        handler(this.currentPlyNum);
      }
      if (target.classList.contains("previous-move-btn")) {
        if (this.currentPlyNum === 0) return;

        this.currentPlyNum--;
        handler(this.currentPlyNum);
      }
      if (target.classList.contains("play-btn")) {
      }
      if (target.classList.contains("next-move-btn")) {
        if (this.currentPlyNum === this.lastPlyNum) return;

        //rendering position
        this.currentPlyNum++;
        handler(this.currentPlyNum);
      }
      if (target.classList.contains("last-move-btn")) {
        this.currentPlyNum = this.lastPlyNum;
        handler(this.currentPlyNum);
      }
    });
  }
}

export default new NavBtnView();
