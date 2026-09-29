import { LICHESS_GAMES_REQUEST_URL } from "../config";
import { CHESSCOM_GAMES_REQUEST_URL } from "../config";

import { getJsonLichess } from "../helpers";
import { getJsonChesscom } from "../helpers";

export const getGamesLichess = async function (username) {
  const url = `${LICHESS_GAMES_REQUEST_URL}${username}?max=60&perfType=bullet,blitz,rapid,classical,correspondance&pgnInJson=true&clocks=false&evals=false&division=true`;

  const options = {
    headers: {
      Accept: "application/x-ndjson",
    },
  };

  const data = await getJsonLichess(url, options);
  return data;
};

export const getGamesChesscom = async function (username) {
  const date = new Date();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const url = `${CHESSCOM_GAMES_REQUEST_URL}${username}/games/${year}/${month.toString(10).length === 2 ? month : `0${month}`}`;

  const data = await getJsonChesscom(url);
  return data;
};
