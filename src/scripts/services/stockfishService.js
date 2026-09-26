import * as gameModel from "../models/gameModel.js";

class Stockfish {
  #stockfish;

  constructor() {
    this.#stockfish = new Worker(
      new URL(
        "../../assets/stockfishEngineFiles/stockfish-19-lite-single.js",
        import.meta.url,
      ), //new URL(url , base , options)
      { type: "module" },
    );

    this.#stockfish.postMessage("uci");
    this.#stockfish.postMessage("isready");
    this.#stockfish.postMessage("setoption name MultiPV value 2");
  }

  //function for extracting info about line of engine
  #extractEngineLineInfo(lineNum, message, posAnalysis) {
    if (
      message.startsWith("info depth 15") &&
      message.includes(`multipv ${lineNum}`)
    ) {
      const cpMatch = message.match(/cp\s+(-?\d+)/);
      const mateMatch = message.match(/mate\s+(-?\d+)/);
      const pvMatch = message.match(/\bpv\s+(.+)/)?.[1];

      posAnalysis.engineLines[`line${lineNum}`] = {
        centipawns: cpMatch?.[1] ? Number(cpMatch[1]) : undefined,
        mate: mateMatch?.[1] ? Number(mateMatch[1]) : undefined,
        variation: pvMatch,
      };
    }
  }

  //function for sending fen for analysis to stockfish
  #getPosEngineAnalysis(move) {
    const fen = move.after;
    const posAnalysis = { engineLines: {} };
    return new Promise((resolve, reject) => {
      this.#stockfish.postMessage(`position fen ${fen}`);
      this.#stockfish.postMessage("go depth 15");

      this.#stockfish.onmessage = (event) => {
        const message = event.data;

        //extracting contipawns , principle variation for 1st and 2nd line of engine
        this.#extractEngineLineInfo(1, message, posAnalysis);
        this.#extractEngineLineInfo(2, message, posAnalysis);

        if (message.startsWith("bestmove")) {
          //extracting best move
          posAnalysis.bestMove = message.split(" ")[1];
          resolve(posAnalysis);
        }
      };
    });
  }

  async getGameEngineAnalysis() {
    console.log("Game Analysis Started");

    for (let i = 0; i < gameModel.game.gameMoves.length; i++) {
      const move = gameModel.game.gameMoves[i];
      const posAnalysis = await this.#getPosEngineAnalysis(move);
      gameModel.game.gameMoves[i] = { ...move, posAnalysis };
      console.log("Move Analyzed");
    }

    console.log("Game Analysed");
    console.log(gameModel.game.gameMoves);
  }

  // Function for adding event handler to engine when a message is recieved and extracting analysis info.

  // addHandlerExtractPosAnalysis(eventHandler, resolve) {
  //   this.#stockfish.onmessage = (event) => {
  //     const message = event.data;
  //     const posAnalysis = { engineLines: {} };

  //     //extracting contipawns , principle variation for 1st and 2nd line of engine
  //     this.#extractEngineLineInfo(1, message, posAnalysis);
  //     this.#extractEngineLineInfo(2, message, posAnalysis);

  //     //extracting best move

  //     if (message.startsWith("bestmove")) {
  //       posAnalysis.bestMove = message.split(" ")[1];
  //     }

  //     //calling event handler for updating model
  //     eventHandler(posAnalysis, this.#fen);
  //   };
  // }
}

export default new Stockfish();
