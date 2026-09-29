import { MATE_CP } from "./config.js";

//function for calculating standard deviation
export function standardDeviation(values) {
  const mean = values.reduce((sum, value) => sum + value, 0) / values.length;

  const variance =
    values.reduce((sum, value) => sum + (value - mean) ** 2, 0) / values.length;

  return Math.sqrt(variance);
}

//function for calculating harmonic mean
export function harmonicMean(values) {
  if (values.length === 0) return null;
  if (values.some((value) => value === 0)) return 0;

  return values.length / values.reduce((sum, value) => sum + 1 / value, 0);
}

//function for calculating weighted mean
export function weightedMean(values) {
  const totalWeight = values.reduce((sum, item) => sum + item.weight, 0);

  if (totalWeight === 0) return null;

  return (
    values.reduce((sum, item) => sum + item.accuracy * item.weight, 0) /
    totalWeight
  );
}

// function for deciding who is winning
export const cpForMate = function (move, line) {
  return move.color === "w"
    ? move.posAnalysis.engineLines[line].mate > 0
      ? -MATE_CP
      : MATE_CP
    : move.posAnalysis.engineLines[line].mate > 0
      ? MATE_CP
      : -MATE_CP;
};

//function for effective cp based on color
export const effectiveCp = function (move, line) {
  const centipawns = move.posAnalysis.engineLines[line]?.centipawns;
  if (centipawns == null) return null;
  return move.color === "w" ? -centipawns : centipawns; //because after making move side tro move is changed
};

// cp from WHITE's perspective for the position after `move`.
// Returns null when the engine gave no usable line.
export const whitePerspectiveCp = function (move, line, isLastMove) {
  const lines = move.posAnalysis.engineLines;

  // No engine lines at all => side to move has no legal moves
  if (!lines.line1) {
    if (move.san.endsWith("#")) return move.color === "w" ? MATE_CP : -MATE_CP; // checkmate
    return isLastMove ? 0 : null; // stalemate on the last move, otherwise an engine failure
  }

  if (!lines[line]) return null; // e.g. line2 missing: only one legal move
  if (lines[line].mate != null) return cpForMate(move, line);
  return effectiveCp(move, line);
};
