import * as userModel from "../models/userModel";
import { getGamesChesscom } from "../services/fetchGamesServics";
import { getGamesLichess } from "../services/fetchGamesServics";
import headerView from "../views/headerView";
import sliderView from "../views/sliderView";

const getPlatformHandler = function (platform) {
  userModel.userState.platform = platform;
};
const getUsernameHandler = function (username) {
  userModel.userState.username = username;
};

const init = function () {
  headerView.addHandlerNavBar();
  sliderView.addHandlerSelectPlatform();
  sliderView.addHandlerGetPlatform(getPlatformHandler);
  sliderView.addHandlerFormSubmit();
  sliderView.addHandlerChangePlatform();
  sliderView.addHandlerGetUsername(getUsernameHandler);
  sliderView.addHandlerChangeUsername();
};

init();
