class chooseAnalysisReview {
  #parentElement = document.querySelector(".choose-review-analysis");
  #allChooseBtns = document.querySelectorAll(".choose-btn");

  addHandlerChooseAnalysisReview(handlerRenderAnalysis, handlerRenderReview) {
    this.#parentElement.addEventListener("click", (event) => {
      console.log("clicked");
      const target = event.target.closest(".choose-btn");
      if (!target) return;
      this.#unselectAllBtns();
      target.classList.add("is-active");

      if (target.classList.contains("view-review-btn")) {
        handlerRenderReview();
      }
      if (target.classList.contains("view-analysis-btn")) {
        handlerRenderAnalysis();
      }
    });
  }

  #unselectAllBtns() {
    this.#allChooseBtns.forEach((btn) => btn.classList.remove("is-active"));
  }
}

export default new chooseAnalysisReview();
