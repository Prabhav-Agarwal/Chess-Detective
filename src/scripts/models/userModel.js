export const userState = {
  platform: "",
  username: "",
  fetchedGamesArr: [],
  extractedGamesArr: [],
};

export const resetUserStateChangeUsername = function () {
  userState.username = "";
  userState.fetchedGamesArr = [];
  userState.extractedGamesArr = [];
};

export const resetUserStateChangePlatform = function () {
  userState.platform = "";
  userState.username = "";
  userState.fetchedGamesArr = [];
  userState.extractedGamesArr = [];
};
