import View from "./View";
class LoadingOverlay extends View {
  #parentElement = document.querySelector(".review-overlay");

  get parentElement() {
    return this.#parentElement;
  }
}

export default new LoadingOverlay();
