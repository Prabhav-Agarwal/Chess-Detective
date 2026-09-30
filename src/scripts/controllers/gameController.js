import * as gameModel from "../models/gameModel.js";
import Stockfish from "../services/stockfishService.js";
import { calculateStats } from "../services/calcStatsService.js";
import { classifyMoves } from "../services/classifyMovesService.js";
import { getGamesChesscom } from "../services/fetchGamesServics.js";

// await getGamesChesscom("PrabhavAgarwal1234");

const posFEN = `r3kb1r/5p1p/5p2/1pPP1P2/p1n5/P4B2/2P1KPPP/R1B4R b kq - 0 19`;
const gamePGN = `[Event "Live Chess"]
[Site "Chess.com"]
[Date "2026.08.28"]
[Round "?"]
[White "PrabhavAgarwal1234"]
[Black "thefog1994"]
[Result "1-0"]
[TimeControl "180"]
[WhiteElo "1620"]
[BlackElo "1620"]
[Termination "PrabhavAgarwal1234 won by checkmate"]
[ECO "D21"]
[EndTime "11:44:53 GMT+0000"]
[Link "https://www.chess.com/game/live/173648174890"]

1. d4 d5 2. c4 dxc4 3. Nf3 Nc6 4. e3 Bf5 5. Bxc4 e6 6. Nc3 Nf6 7. O-O Bb4 8. Ne5
Nxe5 9. dxe5 Ng4 10. Qa4+ c6 11. Qxb4 Nxe5 12. Qxb7 O-O 13. Be2 Rb8 14. Qxa7 Re8
15. Qd4 Qc7 16. Qf4 Rbc8 17. e4 Bg6 18. Be3 Nc4 19. Qxc7 Rxc7 20. Bf4 Rb7 21.
Bxc4 Rxb2 22. Bb3 Rc2 23. Bxc2 Rc8 24. Rfd1 c5 25. Rd7 h6 26. Rad1 c4 27. h4 Bh5
28. e5 Bxd1 29. Nxd1 c3 30. Ne3 Rb8 31. Nc4 Rc8 32. Nd6 Rb8 33. Rxf7 Rb2 34. Be4
c2 35. Rc7 Rb1+ 36. Kh2 c1=Q 37. Bxc1 Rb6 38. Rc8# 1-0`;

const gamePGN2 = `[Event "Live Chess"]
[Site "Chess.com"]
[Date "2026.08.22"]
[Round "-"]
[White "Elmo-di-Scipio"]
[Black "PrabhavAgarwal1234"]
[Result "1-0"]
[CurrentPosition "2rq1r1k/pb2bpp1/1p2p3/2nn3Q/3N4/P1NBP3/1P1B1PPP/R4RK1 b - - 6 17"]
[Timezone "UTC"]
[ECO "D30"]
[ECOUrl "https://www.chess.com/openings/Queens-Gambit-Declined-3.e3-Nf6"]
[UTCDate "2026.08.22"]
[UTCTime "17:25:50"]
[WhiteElo "2015"]
[BlackElo "1987"]
[TimeControl "600"]
[Termination "Elmo-di-Scipio won by resignation"]
[StartTime "17:25:50"]
[EndDate "2026.08.22"]
[EndTime "17:31:47"]
[Link "https://www.chess.com/analysis/game/live/173374588986/analysis?flip=true"]
[WhiteUrl "https://images.chesscomfiles.com/uploads/v1/user/240354247.75c47672.50x50o.0451e180f82a.jpg"]
[WhiteCountry "76"]
[WhiteTitle ""]
[BlackUrl "https://images.chesscomfiles.com/uploads/v1/user/176116971.76f40f36.50x50o.d7555a84dc90.png"]
[BlackCountry "69"]
[BlackTitle ""]

1. d4 d5 2. c4 e6 3. e3 Nf6 4. Nf3 Be7 5. Nc3 O-O 6. Bd3 b6 7. O-O Bb7 8. cxd5
Nxd5 9. a3 c5 10. Qc2 Nd7 $2 11. Bxh7+ Kh8 12. Be4 Rc8 13. Bd2 $6 cxd4 14. Nxd4
Ba6 $2 15. Bd3 $9 Bb7 16. Qd1 Nc5 $4 17. Qh5+ $1 1-0`;

const gamePGN3 = `[Event "Rated blitz game"]
[Site "https://lichess.org/KnEtTnei"]
[Date "2024.05.20"]
[Round "?"]
[White "rashkakaput"]
[Black "prabhavagarwal8"]
[Result "0-1"]
[WhiteElo "1498"]
[BlackElo "1500"]
[ECO "B10"]
[Termination "Normal"]
[TimeControl "300+0"]
[Link "https://www.chess.com/analysis/collection/brilliant-3B1h14jNN/47K1UwLW3x/games?move=48"]

1. e4 c6 2. Bc4 $6 {B10 Caro-Kann Defense: Hillbilly Attack} 2... d5 3. exd5 cxd5
4. Bb5+ Nc6 5. Bxc6+ bxc6 6. d4 Bf5 7. h3 e6 8. Nf3 Bd6 9. Be3 $6 Ne7 10. c3 $6
Bg6 $2 11. O-O Nf5 12. Bg5 $6 f6 13. Bd2 h5 $6 14. Re1 $6 Bh7 $2 15. Rxe6+ $9 Kf7 $1 16.
Re1 g5 $1 17. g3 g4 18. hxg4 hxg4 19. Nh2 $6 Qc7 20. Qxg4 $6 Rag8 21. Qh5+ $6 Bg6 $1
22. Qe2 Rxh2 $6 (22... Nxg3) (22... Nxd4 23. cxd4 Be4) 23. Qe6+ $6 Kg7 $1 24. Kxh2
Bxg3+ $3 25. Kg2 Bxf2 $3 26. Kxf2 $2 Qg3+ $9 (26... Qh2+ 27. Kf3) 27. Kf1 Ne3+ $9 28.
Bxe3 $9 Bd3+ $9 29. Re2 Qf3+ 30. Ke1 $4 Qxe2# {Black wins by checkmate.} 0-1`;

const controlGame = function () {
  gameModel.startGame(gamePGN3);
  console.log(gameModel.game);
};

const init = async function () {
  controlGame();
  await Stockfish.getGameEngineAnalysis();
  calculateStats();
  classifyMoves();
};

init();
