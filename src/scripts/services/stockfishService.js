class Stockfish {
  #stockfish;
  #fen;

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

  //function for sending fen for analysis to stockfish
  analysePosition(fen) {
    this.#fen = fen;
    return new Promise((resolve, reject) => {
      this.#stockfish.postMessage(`position fen ${this.#fen}`);
      this.#stockfish.postMessage("go depth 15");
      this.#stockfish.onmessage = (event) => {
        const message = event.data;
        if (message.startsWith("bestmove")) {
          resolve();
        }
      };
    });
  }

  //Function for adding event handler to engine when a message is recieved and extracting analysis info.

  addHandlerExtractPosAnalysis(eventHandler) {
    this.#stockfish.onmessage = (event) => {
      const message = event.data;
      console.log(message);
      const posAnalysis = { engineLines: {} };

      //extracting best move

      if (message?.startsWith("bestmove")) {
        posAnalysis.bestMove = message.split(" ")[1];
      }

      //extracting contipawns , principle variation for 1st and 2nd line of engine
      this.#extractEngineLineInfo(1, message, posAnalysis);
      this.#extractEngineLineInfo(2, message, posAnalysis);

      //calling event handler for updating model
      eventHandler(posAnalysis, this.#fen);
    };
  }

  #extractEngineLineInfo(lineNum, message, posAnalysis) {
    if (
      message.startsWith("info depth 15") &&
      message.includes(`multipv ${lineNum}`)
    ) {
      posAnalysis.engineLines[`${lineNum}`] = {
        centipawns: message.match(/cp\s+(-?\d+)/),
        variation: message.match(/pv\s+(.+)/),
      };
    }
  }
}

export default new Stockfish();
