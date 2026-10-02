import * as gameModel from "../models/gameModel.js";
import Stockfish from "../services/stockfishService.js";
import { calculateStats } from "../services/calcStatsService.js";
import { classifyMoves } from "../services/classifyMovesService.js";
import chessboard from "../views/chessboardview.js";
import { chart } from "../views/evalGraphView.js";
// const sample = [
//   0.23, 0.43, 0.28, 0.3, 0.02, 0.12, 0.05, 0.35, 0.28, 0.22, 0.11, 0.3, 0.13,
//   0.02, -1.85, 0.14, -0.49, -0.46, -0.46, -0.45, -0.76, -0.87, -3.85, -4.2, -5,
//   -3.23, -3.35, 0.22, 0.1, 4.05, 4.5, 4.75, 4.54, 5, 5, 5, 5,
// ];
// const data = sample.map((v, i) => [i, v]);

// const top = Math.max(...sample, 0);
// const bottom = Math.min(...sample, 0);
// const p = (top / (top - bottom)) * 100;

// chart.render().then(() =>
//   chart.updateOptions({
//     series: [{ data }],
//     fill: {
//       gradient: {
//         colorStops: [
//           { offset: 0, color: "#ffffff", opacity: 1 },
//           { offset: p, color: "#ffffff", opacity: 1 },
//           { offset: p, color: "#000000", opacity: 1 },
//           { offset: 100, color: "#000000", opacity: 1 },
//         ],
//       },
//     },
//   }),
// );

chessboard.addLastMoveClassificationStyling("e2", "e4", "great");

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
