import * as userModel from "../models/userModel";
import { getGamesLichess } from "../services/fetchGamesServics";
import { getGamesChesscom } from "../services/fetchGamesServics";
import { extractChesscomApiData } from "../helpers";
import { extractLichessApiData } from "../helpers";

import headerView from "../views/headerView";
import sliderView from "../views/sliderView";

const getPlatformHandler = function (platform) {
  userModel.userState.platform = platform;
};
const getUsernameHandler = function (username) {
  userModel.userState.username = username;
};

const fetchAndRenderGameResults = async function () {
  const userState = userModel.userState;
  if (userState.platform === "Chesscom") {
    userState.fetchedGamesArr = (
      await getGamesChesscom(userState.username)
    ).games.reverse();

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
  sliderView.renderGameResults(userState.extractedGamesArr);
};

const init = function () {
  headerView.addHandlerNavBar();
  sliderView.addHandlerSelectPlatform();
  sliderView.addHandlerGetPlatform(getPlatformHandler);
  sliderView.addHandlerFormSubmit();
  sliderView.addHandlerChangePlatform();
  sliderView.addHandlerGetUsername(
    getUsernameHandler,
    fetchAndRenderGameResults,
  );
  sliderView.addHandlerChangeUsername();
};

init();
