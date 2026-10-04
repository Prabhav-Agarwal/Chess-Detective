class BoardOrientation {
  currBoardOrientation = "white";
  #rotateBoardBtn = document.querySelector(".board-orientation-btn");

  addHandlerChangeBoardOrientation(handler) {
    this.#rotateBoardBtn.addEventListener("click", (event) => {
      const target = event.target.closest(".board-orientation-btn");
      if (!target) return;

      handler(this.currBoardOrientation);
    });
  }
}

export default new BoardOrientation();
