import { LICHESS_GAMES_REQUEST_URL } from "../config";
import { CHESSCOM_GAMES_REQUEST_URL } from "../config";
import { MIN_GAMES_TO_FETCH } from "../config";

import { getJsonLichess } from "../helpers";
import { getJsonChesscom } from "../helpers";

export const getGamesLichess = async function (username) {
  try {
    const url = `${LICHESS_GAMES_REQUEST_URL}${username}?max=${MIN_GAMES_TO_FETCH}&perfType=bullet,blitz,rapid,classical,correspondance&opening=true&pgnInJson=true&clocks=false&evals=false&division=true`;

    const options = {
      headers: {
        Accept: "application/x-ndjson",
      },
    };

    const data = await getJsonLichess(url, options);
    console.log(data);
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getGamesChesscom = async function (username, year, month) {
  try {
    const date = new Date();
    const url = `${CHESSCOM_GAMES_REQUEST_URL}${username}/games/${year}/${month.toString(10).length === 2 ? month : `0${month}`}`;

    const data = await getJsonChesscom(url);
    console.log(data);
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};
