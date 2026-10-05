import { CHESSCOM_LOGO_SRC } from "../config";
import { LICHESS_LOGO_SRC } from "../config";
import { saveToSessionStorage } from "../helpers";
import { escapeHtml } from "../helpers";

class Slider {
  #parentElement = document.querySelector(".body-slider");
  #allChoosePlatformBtns = document.querySelectorAll(".choose-platform-btn");
  #allSlides = document.querySelectorAll(".slider-slide");
  #gamesList = document.querySelector(".games-list");

  //functions for adding handlers for events of slide 1
  addHandlerSelectPlatform() {
    this.#parentElement.addEventListener("click", (event) => {
      const target = event.target.closest(".choose-platform-btn");
      if (!target) return;
      this.#allChoosePlatformBtns.forEach((btn) =>
        btn.classList.remove("selected"),
      );
      target.classList.add("selected");
    });
  }

  addHandlerGetPlatform(getPlatformHandler) {
    this.#parentElement.addEventListener("click", (event) => {
      const target = event.target.closest(".next-btn");
      if (!target) return;
      const platform = document.querySelector(".choose-platform-btn.selected")
        .dataset.platform;

      getPlatformHandler(platform);

      const changeToSlide = document.querySelector(".slider-username");
      const numSlide = 2;
      this.#changeSlide(changeToSlide, numSlide);

      const platformName = document.querySelectorAll(".platform-name");
      const platformImg = document.querySelector(".platform-logo-img");

      platformName.forEach((el) => (el.textContent = platform));
      if (platform === "Chesscom")
        platformImg.setAttribute("src", CHESSCOM_LOGO_SRC);
      else platformImg.setAttribute("src", LICHESS_LOGO_SRC);
    });
  }

  //functions for adding handlers for events of slide 2

  addHandlerFormSubmit() {
    document
      .querySelector(".input-username-form")
      .addEventListener("submit", (event) => event.preventDefault());
  }

  addHandlerGetUsername(getUsernameHandler, fetchAndRenderGameResults) {
    this.#parentElement.addEventListener("click", (event) => {
      const target = event.target.closest(".fetch-games-btn");
      if (!target) return;
      const inputUsername = document.querySelector(".input-username");
      const username = inputUsername.value;

      const changeToSlide = document.querySelector(".slider-games");
      const numSlide = 3;
      this.#changeSlide(changeToSlide, numSlide);
      this.#gamesList.innerHTML = "";
      this.renderLoadingBar();
      getUsernameHandler(username);
      fetchAndRenderGameResults();
    });
  }

  renderGameResults(fetchedGames) {
    fetchedGames.forEach((gameObj) => {
      const gameRowHTML = this.#getGameRowHTML(gameObj);
      this.#gamesList.insertAdjacentHTML("beforeend", gameRowHTML);
    });
    this.#addHandlerReviewBtn(fetchedGames);
  }
  #getGameRowHTML(options) {
    return `<li class="game-row">
                    <div class="cell date-cell">${escapeHtml(options.date)}</div>
                    <div class="cell opponent-cell">${escapeHtml(options.opponent)}</div>
                    <div class="cell time-control-cell">${escapeHtml(options.timeControl)}</div>
                    <div class="cell result-cell">
                      <div class="result ${escapeHtml(options.result.toLowerCase())}">${escapeHtml(options.result)}</div>
                    </div>
                    <div class="cell opening-cell">${escapeHtml(options.opening)}</div>
                    <div class="cell action-cell" >
                      <a href="gameReview.html" class="review-btn" data-id="${escapeHtml(options.id)}">Review</a>
                    </div>
                  </li>`;
  }

  addHandlerChangePlatform(handler) {
    this.#parentElement.addEventListener("click", (event) => {
      const target = event.target.closest(".change-platform-btn");
      if (!target) return;
      handler();
      const changeToSlide = document.querySelector(".slider-platform");
      const numSlide = 1;
      this.#changeSlide(changeToSlide, numSlide);
    });
  }

  addHandlerChangeUsername(handler) {
    this.#parentElement.addEventListener("click", (event) => {
      const target = event.target.closest(".change-username-btn");
      if (!target) return;
      const changeToSlide = document.querySelector(".slider-username");
      const numSlide = 2;
      this.#changeSlide(changeToSlide, numSlide);
    });
  }

  #addHandlerReviewBtn(gamesArray) {
    const allReviewBtns = document.querySelectorAll(".review-btn");
    allReviewBtns.forEach((btn) =>
      btn.addEventListener("click", (event) => {
        const target = event.target;
        const id = target.dataset.id;
        const game = gamesArray.find((game) => game.id === id);
        saveToSessionStorage("gameInfo", game);
      }),
    );
  }

  renderLoadingBar() {
    const loadingBar = document.querySelector(".games-loading");
    loadingBar.classList.remove("hidden");
  }

  removeLoadingBar() {
    const loadingBar = document.querySelector(".games-loading");
    loadingBar.classList.add("hidden");
  }

  renderGamesError() {
    const errorElement = document.querySelector(".games-error");

    errorElement.classList.remove("hidden");
  }

  removeGamesError() {
    const errorElement = document.querySelector(".games-error");

    errorElement.classList.add("hidden");
  }
  #changeSlide(toDisplaySlide, numSlide) {
    //updating slide
    this.#allSlides.forEach((slide) => slide.classList.remove("active"));
    toDisplaySlide.classList.add("active");

    //updating stepIndicator
    const allSteps = document.querySelectorAll(".step");
    const allStepLines = document.querySelectorAll(".indicator-line");
    [...allSteps, ...allStepLines].forEach((el) =>
      el.classList.remove("active"),
    );

    for (let i = 0; i < numSlide; i++) {
      allSteps[i].classList.add("active");
    }

    if (numSlide === 1) {
      allStepLines[0].classList.add("active");
    }
    if (numSlide > 1) {
      allStepLines.forEach((line) => line.classList.add("active"));
    }
  }
}

export default new Slider();
