/**
 * Division
 * --------
 * Holds the ply-index boundaries that split a chess game into
 * opening / middlegame / endgame phases.
 *
 * INPUT (constructor):
 *   middle : number | null  -> ply index where middlegame starts (or null if never reached)
 *   end    : number | null  -> ply index where endgame starts (or null if never reached)
 *   plies  : number         -> total number of plies (half-moves) in the game
 *
 * Example:
 *   const d = new Division(12, 40, 60);
 *
 *   d.openingSize   // -> 12   (0 to middle)
 *   d.middleSize    // -> 28   (40 - 12)
 *   d.endSize       // -> 20   (60 - 40)
 *   d.openingBounds // -> [0, 12]
 *   d.middleBounds  // -> [12, 40]
 *   d.endBounds     // -> [40, 60]
 *
 *   Division.empty  // -> Division { middle: null, end: null, plies: 0 }
 */
class Division {
  constructor(middle, end, plies) {
    this.middle = middle;
    this.end = end;
    this.plies = plies;
  }

  // OUTPUT: number of plies in the opening (0..middle), or total plies if no middlegame was found
  get openingSize() {
    return this.middle ?? this.plies;
  }

  // OUTPUT: number of plies in the middlegame, or null if there is no middlegame
  get middleSize() {
    return this.middle !== null
      ? (this.end ?? this.plies) - this.middle
      : null;
  }

  // OUTPUT: number of plies in the endgame, or null if there is no endgame
  get endSize() {
    return this.end !== null
      ? this.plies - this.end
      : null;
  }

  // OUTPUT: [startPly, endPly] for the opening phase, or null if no middlegame was found
  get openingBounds() {
    return this.middle !== null ? [0, this.middle] : null;
  }

  // OUTPUT: [startPly, endPly] for the middlegame phase, or null if either boundary is missing
  get middleBounds() {
    return this.middle !== null && this.end !== null
      ? [this.middle, this.end]
      : null;
  }

  // OUTPUT: [startPly, endPly] for the endgame phase, or null if no endgame was found
  get endBounds() {
    return this.end !== null ? [this.end, this.plies] : null;
  }

  // OUTPUT: an empty Division representing a game with no plies at all
  static get empty() {
    return new Division(null, null, 0);
  }
}

/**
 * Divider
 * -------
 * Static helper that analyzes a sequence of chess.js-style Position
 * objects (each exposing a .board() method that returns an 8x8 array
 * of {type, color} | null squares) and figures out where the
 * opening/middlegame/endgame boundaries fall.
 *
 * INPUT (Divider.divide):
 *   positions : Array<Position>
 *     Each Position must implement position.board() -> square[8][8],
 *     where a square is either null or { type: "p"|"n"|"b"|"r"|"q"|"k", color: "w"|"b" }.
 *
 * OUTPUT (Divider.divide):
 *   Division instance describing the game's phase boundaries.
 *
 * Example:
 *   // positions[i] = the board position after ply i
 *   const division = Divider.divide(positions);
 *
 *   division.middle // -> e.g. 14  (ply index where middlegame begins)
 *   division.end    // -> e.g. 46  (ply index where endgame begins)
 *   division.plies  // -> positions.length
 */
class Divider {
  // INPUT:  positions - array of Position objects with a .board() method
  // OUTPUT: a Division instance with middle/end ply indices (or null) and total plies
  static divide(positions) {
    const indexedPositions = positions.map((position, index) => ({
      position,
      index
    }));

    const middleGamePosition = indexedPositions.find(({ position }) => {
      const board = position.board();

      return (
        Divider.majorsAndMinors(board) <= 10 ||
        Divider.backRankSparse(board) ||
        Divider.mixedness(board) > 150
      );
    });

    const middleGame = middleGamePosition
      ? middleGamePosition.index
      : null;

    let endGame = null;

    if (middleGame !== null) {
      const endGamePosition = indexedPositions.find(({ position }) => {
        const board = position.board();

        return Divider.majorsAndMinors(board) <= 6;
      });

      endGame = endGamePosition
        ? endGamePosition.index
        : null;
    }

    const middle =
      middleGame !== null &&
      (endGame === null || middleGame < endGame)
        ? middleGame
        : null;

    return new Division(
      middle,
      endGame,
      positions.length
    );
  }

  // INPUT:  board - 8x8 array of squares (null | {type, color})
  // OUTPUT: count of all queens, rooks, bishops, and knights on the board (both colors)
  // Example: starting position -> 4 (Q) is 2, but here q/r/b/n only => 2+4+4+4 = 14
  static majorsAndMinors(board) {
    let count = 0;

    for (const row of board) {
      for (const square of row) {
        if (!square) continue;

        if (
          square.type === "q" ||
          square.type === "r" ||
          square.type === "b" ||
          square.type === "n"
        ) {
          count++;
        }
      }
    }

    return count;
  }

  // INPUT:  board - 8x8 array of squares
  // OUTPUT: true if either side's back rank has fewer than 4 of its own pieces
  //         (a sign that pieces have developed/traded off the back rank)
  static backRankSparse(board) {
    const blackBackRank = board[0];
    const whiteBackRank = board[7];

    let whitePieces = 0;
    let blackPieces = 0;

    for (const square of whiteBackRank) {
      if (square && square.color === "w") {
        whitePieces++;
      }
    }

    for (const square of blackBackRank) {
      if (square && square.color === "b") {
        blackPieces++;
      }
    }

    return whitePieces < 4 || blackPieces < 4;
  }

  // INPUT:  y - region row (1-indexed), white/black - piece counts (0-4) in a 2x2 region
  // OUTPUT: a numeric "mixedness" contribution for that region (0 if the combo isn't scored)
  static score(y, white, black) {
    switch (white) {
      case 0:
        switch (black) {
          case 1:
            return 1 + y;

          case 2:
            return y < 6 ? 2 + (6 - y) : 0;

          case 3:
            return y < 7 ? 3 + (7 - y) : 0;

          case 4:
            return y < 7 ? 3 + (7 - y) : 0;

          default:
            return 0;
        }

      case 1:
        switch (black) {
          case 0:
            return 1 + (8 - y);

          case 1:
            return 5 + Math.abs(4 - y);

          case 2:
            return 4 + (7 - y);

          case 3:
            return 5 + (7 - y);

          default:
            return 0;
        }

      case 2:
        switch (black) {
          case 0:
            return y > 2 ? 2 + (y - 2) : 0;

          case 1:
            return 4 + (y - 1);

          case 2:
            return 7;

          default:
            return 0;
        }

      case 3:
        switch (black) {
          case 0:
            return y > 1 ? 3 + (y - 1) : 0;

          case 1:
            return 5 + (y - 1);

          default:
            return 0;
        }

      case 4:
        switch (black) {
          case 0:
            return y > 1 ? 3 + (y - 1) : 0;

          default:
            return 0;
        }

      default:
        return 0;
    }
  }

  // INPUT:  none
  // OUTPUT: array of {x, y} top-left coordinates for every overlapping 2x2 region
  //         of the 8x8 board (x, y each range 0..6) -> 49 regions total
  static createMixednessRegions() {
    const regions = [];

    for (let y = 0; y <= 6; y++) {
      for (let x = 0; x <= 6; x++) {
        regions.push({ x, y });
      }
    }

    return regions;
  }

  // INPUT:  board - 8x8 array of squares
  // OUTPUT: total mixedness score (higher = white and black pieces are more
  //         interleaved across the board, a sign the position is "middlegame-like")
  static mixedness(board) {
    let totalScore = 0;

    for (const region of Divider.mixednessRegions) {
      const y = region.y + 1;

      let whitePieces = 0;
      let blackPieces = 0;

      for (let row = 0; row < 2; row++) {
        for (let column = 0; column < 2; column++) {
          const boardRow = region.y + row;
          const boardColumn = region.x + column;

          if (boardRow > 7 || boardColumn > 7) {
            continue;
          }

          const square = board[boardRow][boardColumn];

          if (!square) continue;

          if (square.color === "w") {
            whitePieces++;
          }

          if (square.color === "b") {
            blackPieces++;
          }
        }
      }

      totalScore += Divider.score(
        y,
        whitePieces,
        blackPieces
      );
    }

    return totalScore;
  }
}

// Precomputed once: 49 overlapping 2x2 regions covering the 8x8 board
Divider.mixednessRegions = Divider.createMixednessRegions();

export { Division, Divider };
