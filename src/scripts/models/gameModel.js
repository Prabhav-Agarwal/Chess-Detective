import { Chess } from "chess.js";

//object for maintaining state of game
export const game = {
  chessGame: null,
  gamePgn: "",
  gameMoves: [],
  posAnalysis: [],
};

//function for starting a new chess game
export const startGame = function (pgn) {
  game.gamePgn = pgn;
  game.chessGame = new Chess();
  game.chessGame.loadPgn(game.gamePgn);
  game.gameMoves = game.chessGame.history({ verbose: true });
};
