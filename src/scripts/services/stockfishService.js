class Stockfish {
  #stockfish;
  #gamePgn;
  constructor() {
    this.#stockfish = new Worker(
      `../assets/stockfishEngineFiles/stockfish-19-lite-single-js`,
    );

    engine.onmessage = (event) => {
      const line = event.data;
      if (line.startsWith("bestmove")) {
        const move = line.split(" ")[1];
        console.log("Best move:", move);
      }
    };

    engine.postMessage("uci");
    engine.postMessage("isready");
    engine.postMessage(`position fen ${fen}`);
    engine.postMessage("go depth 15");
  }
}
