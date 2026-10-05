import "chessboard-element";

// Board highlights (chess.com-style yellow overlay)
import { MOVE_COLORS } from "../config";

class Chessboard {
  #chessboard = document.querySelector("#chess-board");
  #styles = document.querySelector(".styles");
  #iconOverlay = document.querySelector(".square-icons-overlay");
  currMoveInfo;
  constructor() {
    this.setBoardPosition();
    this.#chessboard.showNotation = false;
  }

  //function for setting board position || argument is a string
  setBoardPosition(fen = "start") {
    this.#chessboard.setPosition(fen);
  }
  //function for setting board orientation ||argument is 'white' / 'black'
  setBoardOrientation(color) {
    this.#chessboard.orientation = color;
    this.#removeMoveClassificationIcon();
    const square = this.currMoveInfo.to;
    const classification = this.currMoveInfo.classification;
    this.#addMoveClassificationIcon(square, classification);
  }

  //function for chnagin color of a square || argument1 : targetColor , argument2 : square (eg: 'e4')
  #setSquareColor(square, color) {
    const styleString = `#chess-board::part(${square}){
        box-shadow : inset 0 0 0 100px ${color};
    }`;
    this.#styles.textContent = this.#styles.textContent + styleString;
  }

  //function for reverting all board square colors to orginal
  #removeSquareColor() {
    this.#styles.textContent = "";
  }

  //function for adding move classification icon || argument1 : square(eg: 'e4')  , arg2 : svgSelector
  #addMoveClassificationIcon(square, moveSvgType) {
    if (!/^[a-h][1-8]$/.test(square) || !moveSvgType) return;

    const svgSelector = `.${moveSvgType}`;
    const svg = document.querySelector(svgSelector);
    if (!svg) return;

    const boardRect = this.#chessboard.getBoundingClientRect();
    const wrapperRect = this.#iconOverlay.parentElement.getBoundingClientRect();

    Object.assign(this.#iconOverlay.style, {
      left: `${boardRect.left - wrapperRect.left}px`,
      top: `${boardRect.top - wrapperRect.top}px`,
      width: `${boardRect.width}px`,
      height: `${boardRect.height}px`,
    });

    const files = "abcdefgh";
    const file = files.indexOf(square[0]);
    const rank = Number(square[1]);

    const isBlack = this.#chessboard.orientation === "black";

    const col = isBlack ? 7 - file : file;
    const row = isBlack ? rank - 1 : 8 - rank;

    const icon = svg.cloneNode(true);
    icon.classList.add("square-move-icon");

    // Icon occupies 25% of one square.
    const iconSize = 0.4;
    const squareSize = 1 / 8;

    icon.style.width = `${(iconSize * 100) / 8}%`;
    icon.style.height = `${(iconSize * 100) / 8}%`;

    // Top-right corner of the target square.
    // Position the icon's center at the square's top-right corner
    icon.style.left = `${(col + 1) * 12.5}%`;
    icon.style.top = `${row * 12.5}%`;
    icon.style.transform = "translate(-75%, -25%)";

    this.#iconOverlay.append(icon);
  }

  #removeMoveClassificationIcon() {
    this.#iconOverlay.innerHTML = "";
  }

  addLastMoveClassificationStyling(squareFrom, squareTo, classification) {
    this.#removeSquareColor();
    this.#removeMoveClassificationIcon();
    if (!classification) {
      this.#setSquareColor(squareFrom, MOVE_COLORS.COLOR_LAST_MOVE);
      this.#setSquareColor(squareTo, MOVE_COLORS.COLOR_LAST_MOVE);
    }
    const color = MOVE_COLORS[`COLOR_${classification.toUpperCase()}`];
    this.#setSquareColor(squareTo, color);
    this.#setSquareColor(squareFrom, color);

    this.#addMoveClassificationIcon(squareTo, classification);
  }

  //function for adding classification to last move on board
}

export default new Chessboard();
