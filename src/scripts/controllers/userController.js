import * as userModel from "../models/userModel";
import { getGamesLichess } from "../services/fetchGamesServics";
import { getGamesChesscom } from "../services/fetchGamesServics";
import { extractChesscomApiData } from "../helpers";
import { extractLichessApiData } from "../helpers";

import sliderView from "../views/sliderView";

import { CURR_MONTH, MIN_GAMES_TO_FETCH } from "../config";
import { CURR_YEAR } from "../config";
import { MAX_YEARS_TO_SEARCH } from "../config";

const getPlatformHandler = function (platform) {
  userModel.userState.platform = platform;
};
const getUsernameHandler = function (username) {
  userModel.userState.username = username;
};

const fetchAndRenderGameResults = async function () {
  try {
    const userState = userModel.userState;
    if (userState.platform === "Chesscom") {
      let month = CURR_MONTH;
      let year = CURR_YEAR;
      while (userState.fetchedGamesArr.length < MIN_GAMES_TO_FETCH) {
        const fetchedGames = (
          await getGamesChesscom(userState.username, year, month)
        ).games.reverse();

        userState.fetchedGamesArr = [
          ...userState.fetchedGamesArr,
          ...fetchedGames,
        ];

        if (month === 1) {
          year--;
          month = 12;
          if (CURR_YEAR - year === MAX_YEARS_TO_SEARCH) break;
        } else {
          month--;
        }
      }

      if (userState.fetchedGamesArr.length === 0)
        throw new Error("No games found");

      userState.extractedGamesArr = userState.fetchedGamesArr.map((gameObj) =>
        extractChesscomApiData(gameObj, userState.username),
      );
    }

    if (userState.platform === "Lichess") {
      userState.fetchedGamesArr = await getGamesLichess(userState.username);

      userState.extractedGamesArr = userState.fetchedGamesArr.map((gameObj) =>
        extractLichessApiData(gameObj, userState.username),
      );
    }

    sliderView.removeLoadingBar();
    sliderView.removeGamesError();
    sliderView.renderGameResults(userState.extractedGamesArr);
  } catch (error) {
    console.error("Unable to fetch games:", error);

    sliderView.removeLoadingBar();
    sliderView.renderGamesError();
  }
};

const init = function () {
  sliderView.addHandlerSelectPlatform();
  sliderView.addHandlerGetPlatform(getPlatformHandler);
  sliderView.addHandlerFormSubmit();
  sliderView.addHandlerChangePlatform(userModel.resetUserStateChangePlatform);
  sliderView.addHandlerGetUsername(
    getUsernameHandler,
    fetchAndRenderGameResults,
  );
  sliderView.addHandlerChangeUsername(userModel.resetUserStateChangeUsername);
};

init();
