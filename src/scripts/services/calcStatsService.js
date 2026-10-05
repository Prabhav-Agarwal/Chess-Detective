import * as gameModel from "../models/gameModel.js";

import { standardDeviation } from "../helpers.js";
import { harmonicMean } from "../helpers.js";
import { weightedMean } from "../helpers.js";
import { whitePerspectiveCp } from "../helpers.js";
import { INIT_CP, CP_CLAMP } from "../config.js";

//Function for calculating win percentage from the prespective of white
const centiPawnsToWinPercentage = function (centiPawns) {
  if (!Number.isFinite(centiPawns)) return null; // null / undefined / NaN -> null
  const MULTIPLIER = -0.00368208;
  const clamped = Math.max(-CP_CLAMP, Math.min(CP_CLAMP, centiPawns));
  const winningChances = 2 / (1 + Math.exp(MULTIPLIER * clamped)) - 1;
  return 50 + 50 * winningChances;
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

//Function for calculating expectedPoints from winPercentages (from mover's prespective)
const calcExpectedScore = function (winPercentageArr, moves) {
  const winPercentageInit = centiPawnsToWinPercentage(INIT_CP);

  return winPercentageArr.map((after, i, arr) => {
    const before = i === 0 ? winPercentageInit : arr[i - 1];
    if (before == null || after == null) return null;
    // Win% is White's perspective:
    // White loses (before - after), Black loses (after - before)
    return (moves[i].color === "w" ? before - after : after - before) / 100;
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
    ...cps.map((cp) => centiPawnsToWinPercentage(cp)), // returns null for null/NaN now
  ];

  const windowSize = clamp(Math.floor(allWinPercentages.length / 10), 2, 8);

  const repeatedWindowCount =
    Math.min(windowSize, allWinPercentages.length) - 2;

  const weights = [];
  for (let i = 0; i < cps.length; i++) {
    const start = Math.max(0, i - repeatedWindowCount);
    const window = allWinPercentages.slice(start, start + windowSize);

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
  const game = gameModel.game;
  game.centiPawnsArr = {};
  game.winPercentagesArr = {};
  game.expectedScoresArr = {};

  ["line1", "line2"].forEach((line) => {
    game.centiPawnsArr[line] = game.gameMoves.map((move, i, moves) =>
      whitePerspectiveCp(move, line, i === moves.length - 1),
    );

    game.winPercentagesArr[line] = game.centiPawnsArr[line].map((cpValue) =>
      centiPawnsToWinPercentage(cpValue),
    );

    gameModel.game.expectedScoresArr[line] = calcExpectedScore(
      gameModel.game.winPercentagesArr[line],
      gameModel.game.gameMoves,
    );
  });

  gameModel.game.playerAccuracies = calculateGameAccuracy(
    game.centiPawnsArr["line1"],
    game.gameMoves[0]?.color === "b" ? "black" : "white",
  );
};
