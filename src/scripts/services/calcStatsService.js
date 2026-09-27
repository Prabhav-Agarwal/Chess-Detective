import * as gameModel from "../models/gameModel.js";

import { standardDeviation } from "../helpers.js";
import { harmonicMean } from "../helpers.js";
import { weightedMean } from "../helpers.js";
import { cpForMate } from "../helpers.js";
import { effectiveCp } from "../helpers.js";
import { INIT_CP } from "../config.js";

//Function for calculating win percentage from the prespective of white
const centiPawnsToWinPercentage = function (centiPawns) {
  const MULTIPLIER = -0.00368208;

  const winningChances =
    2 / (1 + Math.exp(MULTIPLIER * Math.ceil(centiPawns))) - 1;

  return 50 + 50 * Math.max(-1, Math.min(1, winningChances));
};

//Function for calculating accuracy percentage of a move by taking win percentqage of position before and after.
const accuracyPercentage = function (before, after) {
  if (after >= before) return 100;

  const winDiff = before - after;

  const raw =
    103.1668100711649 * Math.exp(-0.04354415386753951 * winDiff) -
    3.166924740191411;

  return Math.max(0, Math.min(100, raw + 1));
};

//Function for calculating expectedPoints from winPercentages (from white's prespective)
const calcExpectedPoints = function (winPercentageArr) {
  const winPercentageInit = centiPawnsToWinPercentage(INIT_CP);

  return winPercentageArr.map((currWinPercentage, i, arr) => {
    if (i === 0) return (winPercentageInit - currWinPercentage) / 100;
    return (arr[i - 1] - currWinPercentage) / 100;
  });
};

//function for calculating win percentages for each color
//param cps : number[] --> centipawn evaluation after each move , from whites's prespective
//startColor : "white" or "black" --> Color thta played the first move , default ("white")

//this function returns an object containing accuracy of black and white based on lichess model
const calculateGameAccuracy = function (cps, startColor = "white") {
  if (!Array.isArray(cps)) {
    throw new TypeError("cps must be an array");
  }

  if (startColor !== "white" && startColor !== "black") {
    throw new TypeError('startColor must be "white" or "black"');
  }

  if (cps.length === 0) {
    return { white: null, black: null };
  }

  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

  // Evaluations are expected to be from White's perspective.
  const allWinPercentages = [
    centiPawnsToWinPercentage(INIT_CP),
    ...cps.map((cp) => (cp == null ? null : centiPawnsToWinPercentage(cp))),
  ];

  const windowSize = clamp(Math.floor(cps.length / 10), 2, 8);

  const initialWindow = allWinPercentages.slice(0, windowSize);

  const repeatedWindowCount =
    Math.min(windowSize, allWinPercentages.length) - 2;

  const weights = [];
  for (let i = 0; i < cps.length; i++) {
    const window =
      i < repeatedWindowCount
        ? initialWindow
        : allWinPercentages.slice(i, i + windowSize);

    weights.push(
      window.some((value) => value == null)
        ? null
        : clamp(standardDeviation(window), 0.5, 12),
    );
  }

  const weightedAccuracies = {
    white: [],
    black: [],
  };

  // Pair each consecutive position with its corresponding weight.
  for (let i = 0; i < cps.length; i++) {
    const before = allWinPercentages[i];
    const after = allWinPercentages[i + 1];
    const weight = weights[i];

    if (before == null || after == null || weight == null) {
      continue;
    }

    const color =
      i % 2 === 0 ? startColor : startColor === "white" ? "black" : "white";

    // Convert White-perspective Win% to the mover's perspective.
    const moverBefore = color === "white" ? before : 100 - before;

    const moverAfter = color === "white" ? after : 100 - after;

    weightedAccuracies[color].push({
      accuracy: accuracyPercentage(moverBefore, moverAfter),
      weight,
    });
  }

  const getColorAccuracy = (color) => {
    const moves = weightedAccuracies[color];

    if (moves.length === 0) {
      return null;
    }

    // Reuse your existing weighted and harmonic mean helpers.
    const weighted = weightedMean(moves);

    const harmonic = harmonicMean(moves.map((move) => move.accuracy));

    if (weighted == null || harmonic == null) {
      return null;
    }

    return (weighted + harmonic) / 2;
  };

  return {
    white: getColorAccuracy("white"),
    black: getColorAccuracy("black"),
  };
};

////////////////////////////
export const calculateStats = function () {
  gameModel.game.centiPawnsArr = gameModel.game.gameMoves.map((move) => {
    if (move.posAnalysis.engineLines.line1.mate) {
      return cpForMate(move);
    }

    return effectiveCp(move);
  });

  gameModel.game.winPercentagesArr = gameModel.game.centiPawnsArr.map(
    (cpValue) => centiPawnsToWinPercentage(cpValue),
  );

  gameModel.game.expectedPointsArr = calcExpectedPoints(
    gameModel.game.winPercentagesArr,
  );

  gameModel.game.playerAccuracies = calculateGameAccuracy(
    gameModel.game.centiPawnsArr,
  );

  console.log(gameModel.game);
};
