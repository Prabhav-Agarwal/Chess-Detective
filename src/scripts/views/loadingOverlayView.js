import View from "./View";
class LoadingOverlay extends View {
  #parentElement = document.querySelector(".review-overlay");
}

export default new LoadingOverlay();
