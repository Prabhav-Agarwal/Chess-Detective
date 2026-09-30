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

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const getJsonLichess = async function (url, options) {
  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`HTTP Error : Status : ${response.status}`);
    }

    const text = await response.text();
    const data = text
      .split("\n")
      .filter((el) => el.trim() !== "")
      .map((el) => JSON.parse(el));

    return data;
  } catch (error) {
    throw error;
  }
};

export const getJsonChesscom = async function (url, options) {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP Error : Status : ${response.status}`);
    }

    const data = await response.json();

    return data;
  } catch (error) {
    throw error;
  }
};

export const extractChesscomApiData = function (gameObject, playerUsername) {
  const extractedGameObj = {};
  const date = new Date(gameObject.end_time * 1000);
  const whiteUsername = gameObject.white.username;
  const blackUsername = gameObject.black.username;

  const opponent =
    whiteUsername === playerUsername ? gameObject.black : gameObject.white;
  const timeControl = gameObject.time_class;
  const openingNameWordsArr = gameObject.eco
    .match(/(?<=\/openings\/).*/)?.[0]
    .split("-");
  if (typeof openingNameWordsArr.at(-1)[0] === "number") {
    openingNameWordsArr.splice(-1);
  }
  const index = openingNameWordsArr.at(-1).indexOf("...");
  if (index != undefined && index != null) {
    openingNameWordsArr[openingNameWordsArr.length - 1] = openingNameWordsArr
      .at(-1)
      .slice(0, index);
  }

  extractedGameObj.date = `${date.getDate()} ${date.toLocaleString("en-US", { month: "short" })}, ${date.getFullYear()}`;
  extractedGameObj.opponent = opponent.username;
  extractedGameObj.timeControl =
    timeControl[0].toUpperCase() + timeControl.slice(1);
  extractedGameObj.opening = openingNameWordsArr.join(" ");
  extractedGameObj.result = "";
  if (opponent.result === "win") {
    extractedGameObj.result = "Loss";
  }
  if (
    opponent.result === "loss" ||
    opponent.result === "abandoned" ||
    opponent.result === "checkmated" ||
    opponent.result === "resigned" ||
    opponent.result === "timeout"
  ) {
    extractedGameObj.result = "Win";
  }
  if (
    opponent.result === "draw" ||
    opponent.result === "timevsinsufficient" ||
    opponent.result === "insufficient" ||
    opponent.result === "repetition" ||
    opponent.result === "agreed"
  ) {
    extractedGameObj.result = "Draw";
  }
  if (opponent.result === "stalemate") {
    extractedGameObj.result = "Stalemate";
  }
  extractedGameObj.pgn = gameObject.pgn;

  return extractedGameObj;
};

export const extractLichessApiData = function (gameObject, playerUsername) {
  const extractedGameObj = {};
  const date = new Date(gameObject.lastMoveAt);
  const whiteUsername = gameObject.players.white.user.name;
  const blackUsername = gameObject.players.black.user.name;
  const opponent =
    whiteUsername === playerUsername
      ? gameObject.players.black.user
      : gameObject.players.white.user;
  const timeControl = gameObject.speed;

  extractedGameObj.date = `${date.getDate()} ${date.toLocaleString("en-US", { month: "short" })}, ${date.getFullYear()}`;
  extractedGameObj.opponent = opponent.name;
  extractedGameObj.timeControl =
    timeControl[0].toUpperCase() + timeControl.slice(1);
  extractedGameObj.opening = gameObject.opening.name;
  if (
    gameObject.status === "draw" ||
    gameObject.status === "threefold" ||
    gameObject.status === "fiftymoves" ||
    gameObject.status === "insufficient"
  ) {
    extractedGameObj.result = "Draw";
  } else if (gameObject.status === "stalemate") {
    extractedGameObj.result = "Stalemate";
  } else {
    extractedGameObj.result =
      gameObject.players[gameObject.winner].user.name === opponent.name
        ? "Loss"
        : "Win";
  }
  extractedGameObj.pgn = gameObject.pgn;
  return extractedGameObj;
};

///saving data to session storage
export const saveToSessionStorage = function (key, value) {
  sessionStorage.setItem(key, value);
};
