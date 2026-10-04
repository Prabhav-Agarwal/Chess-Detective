import { Chess } from "chess.js";
import * as gameModel from "../models/gameModel.js";

const getBestMoveInfoObj = function (
  plyNum,
  prevFen,
  bestMove,
  currMoveCp,
  currMoveWinPctg,
) {
  const moveInfoObj = {};
  const chess = new Chess(prevFen);
  const moveObj = chess.move(bestMove);
  const afterFen = chess.fen();

  moveInfoObj.fenAfter = afterFen;
  moveInfoObj.from = moveObj.from;
  moveInfoObj.to = moveObj.to;
  moveInfoObj.currPly = moveObj.san;
  moveInfoObj.classification = "best";
  moveInfoObj.currMoveWinPctg = currMoveWinPctg;
  moveInfoObj.currMoveCp = currMoveCp;
  moveInfoObj.plyNum = plyNum;
  moveInfoObj.bestMove = null;
  moveInfoObj.lines = null;

  return moveInfoObj;
};

const getEngineLineInfo = function (
  currFen,
  engineLine,
  currMoveCp,
  currMoveWinPctg,
) {
  const movesArr = engineLine.split(" ");
  const chess = new Chess(currFen);

  const moveInfoArr = movesArr.map((move, i) => {
    const moveInfoObj = {};

    const moveObj = chess.move(move);
    const afterFen = chess.fen();
    moveInfoObj.currPly = moveObj.san;
    moveInfoObj.plyNum = i;

    moveInfoObj.fenAfter = afterFen;
    moveInfoObj.from = move.slice(0, 2);
    moveInfoObj.to = move.slice(2);

    moveInfoObj.classification = "";
    moveInfoObj.currMoveWinPctg = currMoveWinPctg;
    moveInfoObj.currMoveCp = currMoveCp;
    moveInfoObj.bestMove = null;
    moveInfoObj.lines = null;

    return moveInfoObj;
  });

  return moveInfoArr;
};

export const restructureModel = function () {
  const game = gameModel.game;
  const gameMoves = game.gameMoves;
  gameMoves.forEach((move, i) => {
    //Updating Best Move Info
    const plyNum = i;
    move.posAnalysis.bestMove = getBestMoveInfoObj(
      plyNum,
      move.after,
      move.posAnalysis.bestMove,
      game.centiPawnsArr.line1[i],
      game.winPercentagesArr.line1[i],
    );

    //Updating Engine Lines Info

    ["line1", "line2"].forEach((line) => {
      move.posAnalysis.engineLines[line] = getEngineLineInfo(
        move.after,
        move.posAnalysis.engineLines[line].variation,
        game.centiPawnsArr[line][i],
        game.winPercentagesArr[line][i],
      );
    });
  });
};
