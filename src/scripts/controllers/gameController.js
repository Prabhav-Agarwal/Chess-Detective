import * as gameModel from "../models/gameModel.js";
import Stockfish from "../services/stockfishService.js";
import { calculateStats } from "../services/calcStatsService.js";
import { classifyMoves } from "../services/classifyMovesService.js";
import { getGamesChesscom } from "../services/fetchGamesServics.js";

const controlGame = function () {
  gameModel.startGame();
  console.log(gameModel.game);
};

const init = async function () {
  controlGame();
  await Stockfish.getGameEngineAnalysis();
  calculateStats();
  classifyMoves();
};

init();
