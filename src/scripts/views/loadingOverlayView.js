import View from "./View";
class LoadingOverlay extends View {
  #parentElement = document.querySelector(".review-overlay");

  get parentElement() {
    return this.#parentElement;
  }

  updateNumMoveAnalysed(currentCount, totalCount) {
    const movesAnalysed = document.querySelector(".review-analysis-current");
    const totalMovesToAnalyse = document.querySelector(
      ".review-analysis-total",
    );
    movesAnalysed.textContent = currentCount;
    totalMovesToAnalyse.textContent = totalCount;
  }
}

export default new LoadingOverlay();
