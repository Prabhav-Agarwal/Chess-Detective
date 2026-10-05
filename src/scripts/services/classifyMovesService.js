import { Chess } from "chess.js";
import * as gameModel from "../models/gameModel.js";
import { EXPECTED_SCORE_TABLE } from "../config.js";
import { ONLY_MOVE_THRESHOLD_PCTG } from "../config.js";
import { COMP_LOOSING_PCTG } from "../config.js";
import { LOSING_MAX_PCTG } from "../config.js";
import { EQUAL_MIN_PCTG } from "../config.js";
import { EQUAL_MAX_PCTG } from "../config.js";
import { WINNING_MIN_PCTG } from "../config.js";
import { COMP_WINNING_PCTG } from "../config.js";

import { PEICE_VALUES } from "../config.js";
import { SACRIFICE_PV_MAX_PLIES } from "../config.js";
import { MIN_SACRIFICIAL_MATERIAL_LOSS } from "../config.js";

import { openings } from "../../assets/openings/openings_computed.js";

const isBookMove = function (fen) {
  const opening = openings.find((openingObj) => fen === openingObj.fen);
  if (opening) return true;
  else return false;
};

const classifyMovesStandard = function (expectedScore) {
  if (!Number.isFinite(expectedScore)) return null; // unknown, not "best" or "blunder"
  if (expectedScore < 0) return "best";
  const classificationTypes = Object.keys(EXPECTED_SCORE_TABLE);
  for (let classification of classificationTypes) {
    const { lowerLim, upperLim } = EXPECTED_SCORE_TABLE[classification];

    if (expectedScore >= lowerLim && expectedScore <= upperLim) {
      return classification;
    }
  }
  return "blunder";
};

//miss test
const isMoveMiss = function (expectedScore, winPctgBefore, winPctgAfter) {
  const { lowerLim, upperLim } = EXPECTED_SCORE_TABLE["blunder"];
  if (
    expectedScore >= lowerLim &&
    expectedScore <= upperLim &&
    winPctgBefore >= WINNING_MIN_PCTG &&
    winPctgAfter >= EQUAL_MIN_PCTG &&
    winPctgAfter < EQUAL_MAX_PCTG
  ) {
    return true;
  } else return false;
};

//greta move test
const isMoveGreat = function ({
  playedMove,
  bestMove,
  expectedScore,
  beforeWinPercentageLine1,
  beforeWinPercentageLine2,
}) {
  //base clause 1 : missing data or a forced line (only one legal move)
  if (
    !Number.isFinite(beforeWinPercentageLine1) ||
    !Number.isFinite(beforeWinPercentageLine2) ||
    !Number.isFinite(expectedScore)
  ) {
    return false;
  }

  //base clause 2 : great move can either be best or excellent

  const { upperLim } = EXPECTED_SCORE_TABLE.excellent;
  if (expectedScore > upperLim) {
    return false;
  }

  //base clause 3: only enter if played move is best move of engine.
  if (playedMove !== bestMove) {
    return false;
  }

  // base clause 4: great move classification is not required if player was already completely winning
  if (beforeWinPercentageLine1 > COMP_WINNING_PCTG) {
    return false;
  }

  //Only-Move Test : To check if there is only one good move in the position.
  const gapWinPercentageLine1Line2 =
    beforeWinPercentageLine1 - beforeWinPercentageLine2;

  if (
    beforeWinPercentageLine1 > COMP_LOOSING_PCTG &&
    gapWinPercentageLine1Line2 > ONLY_MOVE_THRESHOLD_PCTG
  ) {
    return true;
  }

  // TRANSITION TEST : for LOSS to DRAW and DRAW to WINNING

  if (
    beforeWinPercentageLine2 <= LOSING_MAX_PCTG &&
    beforeWinPercentageLine1 >= EQUAL_MIN_PCTG
  ) {
    return true;
  }
  if (
    beforeWinPercentageLine2 >= EQUAL_MIN_PCTG &&
    beforeWinPercentageLine2 < EQUAL_MAX_PCTG &&
    beforeWinPercentageLine1 >= WINNING_MIN_PCTG
  ) {
    return true;
  }

  return false;
};

const isSacrificial = function ({ fen, variation, capturedByMover }) {
  if (!variation) return false;
  //fen , variation :  is after mover has played his move;
  // Start with what the played move itself captured (gain for the mover),
  // otherwise equal trades like Nxe5 Nxe5 look like a 3-point sacrifice.

  let materialChangeMover = PEICE_VALUES[capturedByMover] || 0;
  let materialChangeOther = -materialChangeMover;

  const moves = variation.split(" ");
  const chess = new Chess(fen);

  let numPliesSimuate =
    SACRIFICE_PV_MAX_PLIES < moves.length
      ? SACRIFICE_PV_MAX_PLIES
      : moves.length;
  for (let i = 0; i < numPliesSimuate; i++) {
    const move = moves[i];
    let moveObj;
    try {
      moveObj = chess.move(move);
    } catch (error) {
      break;
    }
    if (!moveObj?.captured && !moveObj?.promotion) {
      continue;
    }
    if (i === numPliesSimuate - 1 && i % 2 === 0) continue;
    const changeByCaptureOrPromotion =
      (PEICE_VALUES[moveObj?.captured] || 0) +
      (PEICE_VALUES[moveObj?.promotion] - PEICE_VALUES.p || 0);
    if (i % 2 === 0) {
      materialChangeMover -= changeByCaptureOrPromotion;
      materialChangeOther += changeByCaptureOrPromotion;
    } else {
      materialChangeMover += changeByCaptureOrPromotion;
      materialChangeOther -= changeByCaptureOrPromotion;
    }
  }
  return materialChangeMover <= -MIN_SACRIFICIAL_MATERIAL_LOSS;
};

const isMoveBrilliant = function (options) {
  if (isMoveGreat(options) && isSacrificial(options)) return true;
  return false;
};

export const classifyMoves = function () {
  const { expectedScoresArr, gameMoves, winPercentagesArr } = gameModel.game;

  gameMoves.forEach((move, i) => {
    // winPercentagesArr is White's perspective -> convert to the mover's
    const toMoverPov = (winPct) =>
      Number.isFinite(winPct)
        ? move.color === "w"
          ? winPct
          : 100 - winPct
        : null;

    //book move test
    if (isBookMove(move.after)) {
      move.classification = "book";
      return;
    }
    const beforeWinPercentage = toMoverPov(winPercentagesArr?.line1[i - 1]);
    const afterWinPercentage = toMoverPov(winPercentagesArr?.line1[i]);

    //miss move test
    if (
      isMoveMiss(
        expectedScoresArr.line1[i],
        beforeWinPercentage,
        afterWinPercentage,
      )
    ) {
      move.classification = "miss";
      return;
    }

    //standard move classification test
    move.classification = classifyMovesStandard(expectedScoresArr.line1[i]);
    if (i < 8) return;

    const options = {
      playedMove: move.lan,
      bestMove: gameMoves[i - 1].posAnalysis.bestMove,
      expectedScore: expectedScoresArr?.line1[i],
      beforeWinPercentageLine1: toMoverPov(winPercentagesArr?.line1[i - 1]),
      beforeWinPercentageLine2: toMoverPov(winPercentagesArr?.line2[i - 1]),
      fen: move.after,
      variation: move.posAnalysis.engineLines.line1?.variation,
      capturedByMover: move.captured,
    };

    if (isMoveBrilliant(options)) move.classification = "brilliant";
    else if (isMoveGreat(options)) move.classification = "great";
  });
};
