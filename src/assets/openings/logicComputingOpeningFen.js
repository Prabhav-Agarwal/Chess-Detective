import { Chess } from "chess.js";
import { openings } from "./openings_raw.js";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const computeFen = function (openingObjectsArray) {
  return openingObjectsArray.map((openingObj) => {
    const chess = new Chess();

    chess.loadPgn(openingObj.pgn);

    return {
      ...openingObj,
      fen: chess.fen(),
    };
  });
};

const computedOpeningArray = computeFen(openings);

const content = `export const openings = ${JSON.stringify(
  computedOpeningArray,
  null,
  2,
).replace(/"([^"]+)":/g, "$1:")};\n`;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const outputPath = path.join(__dirname, "openings_computed.js");

fs.writeFileSync(outputPath, content, "utf8");

console.log(`Generated: ${outputPath}`);
