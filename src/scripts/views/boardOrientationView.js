class BoardOrientation {
  #rotateBoardBtn = document.querySelector(".board-orientation-btn");

  addHandlerChangeBoardOrientation(handler) {
    this.#rotateBoardBtn.addEventListener("click", handler);
  }
}

export default new BoardOrientation()
