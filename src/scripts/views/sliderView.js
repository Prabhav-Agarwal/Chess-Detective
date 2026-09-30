import { CHESSCOM_LOGO_SRC } from "../config";
import { LICHESS_LOGO_SRC } from "../config";

class Slider {
  #parentElement = document.querySelector(".body-slider");
  #allChoosePlatformBtns = document.querySelectorAll(".choose-platform-btn");
  #allSlides = document.querySelectorAll(".slider-slide");

  //functions for adding handlers for events of slide 1
  addHandlerSelectPlatform() {
    console.log("Hnadler attached");
    this.#parentElement.addEventListener("click", (event) => {
      console.log("event triggered");
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

  addHandlerGetUsername(getUsernameHandler) {
    this.#parentElement.addEventListener("click", (event) => {
      const target = event.target.closest(".fetch-games-btn");
      if (!target) return;
      const inputUsername = document.querySelector(".input-username");
      const username = inputUsername.value;

      const changeToSlide = document.querySelector(".slider-games");
      const numSlide = 3;
      this.#changeSlide(changeToSlide, numSlide);
      // this.#renderLoadingBar();
      getUsernameHandler(username);
    });
  }

  addHandlerChangePlatform() {
    this.#parentElement.addEventListener("click", (event) => {
      const target = event.target.closest(".change-platform-btn");
      if (!target) return;
      const changeToSlide = document.querySelector(".slider-platform");
      const numSlide = 1;
      this.#changeSlide(changeToSlide, numSlide);
    });
  }

  addHandlerChangeUsername() {
    this.#parentElement.addEventListener("click", (event) => {
      const target = event.target.closest(".change-username-btn");
      if (!target) return;
      const changeToSlide = document.querySelector(".slider-username");
      const numSlide = 2;
      this.#changeSlide(changeToSlide, numSlide);
    });
  }

  #renderLoadingBar() {
    const loadingBar = document.querySelector(".games-loading");
    loadingBar.classList.remove("hidden");
  }

  #removeLoadingBar() {
    const loadingBar = document.querySelector(".games-loading");
    loadingBar.classList.add("hidden");
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
