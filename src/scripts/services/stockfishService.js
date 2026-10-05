import { SEARCH_DEPTH } from "../config.js";
import * as gameModel from "../models/gameModel.js";

class Stockfish {
  #stockfish;

  constructor() {
    this.#stockfish = new Worker(
      `${import.meta.env.BASE_URL}stockfish/stockfish-19-lite-single.js`,
      { type: "classic" },
    );

    this.#stockfish.postMessage("uci");
    this.#stockfish.postMessage("isready");
    this.#stockfish.postMessage("setoption name MultiPV value 2");
  }

  //function for extracting info about line of engine
  #extractEngineLineInfo(lineNum, message, posAnalysis) {
    if (
      message.startsWith(`info depth ${SEARCH_DEPTH}`) &&
      message.includes(`multipv ${lineNum}`) &&
      !message.includes("lowerbound") &&
      !message.includes("upperbound")
    ) {
      const cpMatch = message.match(/score cp (-?\d+)/);
      const mateMatch = message.match(/score mate (-?\d+)/);
      const pvMatch = message.match(/\bpv\s+(.+)/)?.[1];

      posAnalysis.engineLines[`line${lineNum}`] = {
        //centipawns and mate from the prespective of whichever side to move
        centipawns: cpMatch?.[1] ? Number(cpMatch[1]) : undefined,
        mate: mateMatch?.[1] ? Number(mateMatch[1]) : undefined,
        variation: pvMatch,
      };
    }
  }

  //function for sending fen for analysis to stockfish
  #getPosEngineAnalysis(fen) {
    const posAnalysis = { engineLines: {} };
    return new Promise((resolve, reject) => {
      let timeoutId;

      const cleanup = () => {
        clearTimeout(timeoutId);
        this.#stockfish.onmessage = null;
        this.#stockfish.onerror = null;
      };

      timeoutId = setTimeout(() => {
        cleanup();
        reject(new Error("Stockfish analysis timed out."));
      }, 15000);

      this.#stockfish.onmessage = (event) => {
        const message = event.data;

        //extracting contipawns , principle variation for 1st and 2nd line of engine
        this.#extractEngineLineInfo(1, message, posAnalysis);
        this.#extractEngineLineInfo(2, message, posAnalysis);

        if (message.startsWith("bestmove")) {
          //extracting best move
          const bestMove = message.split(" ")[1];
          posAnalysis.bestMove = bestMove === "(none)" ? null : bestMove;
          cleanup();
          resolve(posAnalysis);
        }
      };

      this.#stockfish.onerror = (error) => {
        cleanup();
        reject(new Error("Stockfish worker failed.", { cause: error }));
      };

      this.#stockfish.postMessage(`position fen ${fen}`);
      this.#stockfish.postMessage(`go depth ${SEARCH_DEPTH}`);
    });
  }

  async getGameEngineAnalysis(handler) {
    console.log("Game Analysis Started");

    for (let i = 0; i < gameModel.game.gameMoves.length; i++) {
      const move = gameModel.game.gameMoves[i];
      const posAnalysis = await this.#getPosEngineAnalysis(move.after);
      gameModel.game.gameMoves[i] = { ...move, posAnalysis };
      console.log("Move Analyzed");
      const currentAnalysed = Math.floor((i + 1) / 2);
      const totalMoves = Math.ceil(gameModel.game.gameMoves.length / 2);
      handler(currentAnalysed, totalMoves);
    }

    console.log("Game Analysed");
  }
}

export default new Stockfish();
