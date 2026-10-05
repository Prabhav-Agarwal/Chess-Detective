import View from "./View";
class ErrorOverlay extends View {
  #parentElement = document.querySelector(".review-error-overlay");

  get parentElement() {
    return this.#parentElement;
  }
}

export default new ErrorOverlay();
