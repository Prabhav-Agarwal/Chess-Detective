class playerDescrip {
  #whiteDescrip = document.querySelector(".white-descrip");
  #blackDescrip = document.querySelector(".black-descrip");

  updatePlayersDescrip({ white, black }) {
    this.#updateDescrip("white", white);
    this.#updateDescrip("black", black);
  }

  #updateDescrip(color, { username, rating }) {
    // const avatarEle = document.querySelector(`.${color}-avatar`);
    const usernameEle = document.querySelector(`.${color}-username`);
    const ratingEle = document.querySelector(`.${color}-rating`);

    // avatarEle.setAttribute("src", avatar);
    usernameEle.textContent = username;
    ratingEle.textContent = `(${rating})`;
  }

  changePrespective(color = "white") {
    if (color === "black") {
      this.#whiteDescrip.style.gridArea = "p2";
      this.#blackDescrip.style.gridArea = "p1";
    }
    if (color === "white") {
      this.#whiteDescrip.style.gridArea = "p1";
      this.#blackDescrip.style.gridArea = "p2";
    }
  }
}

export default new playerDescrip();
