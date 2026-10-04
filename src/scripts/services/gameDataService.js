import * as gameModel from "../models/gameModel.js";

//info for updating player accuracy section
export const getPlayerAccuracySectionInfo = function () {
  const { white, black } = gameModel.game.playerAccuracies;
  return {
    white: white.toFixed(1),
    black: black.toFixed(1),
  };
};

//info for updating player descriptions
export const getPlayerDescripSectionInfo = function () {
  const { white, black } = gameModel.game.gameInfo.players;
  return { white, black };
};

//info for updating move classifcation section
export const getMoveClassificationSectionInfo = function () {
  const whiteUsername = gameModel.game.gameInfo.players.white.username;
  const blackUsername = gameModel.game.gameInfo.players.black.username;
  const numMoveWhite = getNumMoves("white");
  const numMoveBlack = getNumMoves("black");

  return {
    white: {
      whiteUsername,
      numMoveWhite,
    },

    black: {
      blackUsername,
      numMoveBlack,
    },
  };
};

const getNumMoves = function (color) {
  const numMoveObj = {
    brilliant: 0,
    great: 0,
    book: 0,
    best: 0,
    excellent: 0,
    good: 0,
    inaccuracy: 0,
    mistake: 0,
    blunder: 0,
  };

  let moves = [];

  if (color === "white") {
    moves = gameModel.game.gameMoves.filter((move, i) => {
      return i % 2 === 0;
    });
  }
  if (color === "black") {
    moves = gameModel.game.gameMoves.filter((move, i) => {
      return i % 2 === 1;
    });
  }
  moves.forEach((move) => {
    numMoveObj[move.classification]++;
  });

  return numMoveObj;
};

//info for updating evalGraph section
export const getEvalGraphSectionInfo = function () {
  const cpArrayWhite = gameModel.game.centiPawnsArr.line1;
  const cpArrayWithInitPos = [0, ...cpArrayWhite];
  const evalArr = cpArrayWithInitPos.map((cp) => (cp / 100).toFixed(1));
  return evalArr;
};

//function for extracting move info
export const extractMoveInfo = function (index) {
  //0 based indexing
  const moveObj = {};
  const game = gameModel.game;
  const move = game.gameMoves[index];
  console.log(move, game.gameMoves[index - 1]);
  moveObj.plyNum = index;
  moveObj.fenAfter = move.after;
  moveObj.classification = move.classification;
  moveObj.from = move.from;
  moveObj.to = move.to;
  moveObj.currPly = move.san;
  moveObj.currMoveWinPctg = game.winPercentagesArr.line1[index];
  moveObj.currMoveCp = game.centiPawnsArr.line1[index];
  moveObj.bestMove = game.gameMoves?.[index - 1]?.posAnalysis?.bestMove;
  moveObj.lines = move.posAnalysis.engineLines;
  console.log(moveObj.lines);

  return moveObj;
};

//function for getting data for move List
export const getMoveListSectionInfo = function () {
  const moves = gameModel.game.gameMoves;
  const whitePlies = moves.filter((move, i) => i % 2 === 0);
  const blackPlies = moves.filter((move, i) => i % 2 === 1);
  const moveList = [];
  for (let i = 0; i < whitePlies.length; i++) {
    moveList.push({
      moveNum: i + 1,
      whitePly: whitePlies[i].san,
      blackPly: blackPlies?.[i]?.san || "",
    });
  }
  return moveList;
};

//function for getting data bestMove object by plyNUm
export const getBestMoveObj = function (plyNum) {
  return gameModel.game.gameMoves?.[plyNum - 1]?.posAnalysis?.bestMove;
};
