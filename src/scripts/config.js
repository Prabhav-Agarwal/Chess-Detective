export const SEARCH_DEPTH = 12;
export const INIT_CP = 0;
export const MATE_CP = 1000;
export const CP_CLAMP = 1000; // Lichess clamps cp to ±1000 before converting to win%
export const SACRIFICE_PV_MAX_PLIES = 6;
export const MIN_SACRIFICIAL_MATERIAL_LOSS = 2;
export const ONLY_MOVE_THRESHOLD_PCTG = 4;
export const LOSING_MAX_PCTG = 35;
export const EQUAL_MIN_PCTG = 45;
export const EQUAL_MAX_PCTG = 55;
export const WINNING_MIN_PCTG = 70;
export const COMP_WINNING_PCTG = 95;
export const COMP_LOOSING_PCTG = 20;
export const EXPECTED_SCORE_TABLE = {
  best: {
    lowerLim: 0.0,
    upperLim: 0.0,
  },

  excellent: {
    lowerLim: 0.0,
    upperLim: 0.02,
  },

  good: {
    lowerLim: 0.02,
    upperLim: 0.05,
  },

  inaccuracy: {
    lowerLim: 0.05,
    upperLim: 0.1,
  },

  mistake: {
    lowerLim: 0.1,
    upperLim: 0.2,
  },

  blunder: {
    lowerLim: 0.2,
    upperLim: 1.0,
  },
};
export const PEICE_VALUES = {
  p: 1,
  r: 5,
  n: 3,
  b: 3,
  q: 9,
};

////API CONFIGURATIONS
// export const LICHESS_GAMES_REQUEST_URL = `https://lichess.org/api/games/user/${username}`;
// export const CHESSCOM_GAMES_REQUEST_URL = `https://api.chess.com/pub/player/${username}/games/archives`;
