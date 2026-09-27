import { MATE_CP } from "./config";

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
export const cpForMate = function (move) {
  return move.color === "w"
    ? move.posAnalysis.engineLines.line1.mate > 0
      ? -MATE_CP
      : MATE_CP
    : move.posAnalysis.engineLines.line1.mate > 0
      ? MATE_CP
      : -MATE_CP;
};

//function for effective cp based on color
export const effectiveCp = function (move) {
  const centipawns = move.posAnalysis.engineLines.line1.centipawns;
  return move.color === "w" ? -centipawns : centipawns; //because after making move side tro move is changed
};
