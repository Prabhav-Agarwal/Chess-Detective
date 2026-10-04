import { Chess } from "chess.js";
import { fetchFromSessionStorage } from "../helpers";

//object for maintaining state of game
export const game = {
  chessGame: null,
  gamePgn: "",
  gameMoves: [],
};

//function for starting a new chess game
export const startGame = function () {
  game.gameInfo = fetchFromSessionStorage("gameInfo");
  game.chessGame = new Chess();
  game.chessGame.loadPgn(game.gameInfo.pgn);
  game.gameMoves = game.chessGame.history({ verbose: true });
};
