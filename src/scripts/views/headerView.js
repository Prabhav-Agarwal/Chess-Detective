class Header {
  #parentElement = document.querySelector(".nav-bar");
  #bodySections = document.querySelectorAll(".landing-page-body-section");

  addHandlerNavBar() {
    this.#parentElement.addEventListener("click", (event) => {
      const target = event.target.closest(".nav-element");
      if (!target) return;
      this.#bodySections.forEach((section) => {
        section.classList.add("hidden");
      });
      document
        .querySelector(`.${target.dataset.section}`)
        .classList.remove("hidden");
    });
  }
}

export default new Header();
