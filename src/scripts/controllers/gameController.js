import * as gameModel from "../models/gameModel.js";
import * as gameDataService from "../services/gameDataService.js";
import Stockfish from "../services/stockfishService.js";
import { calculateStats } from "../services/calcStatsService.js";
import { classifyMoves } from "../services/classifyMovesService.js";
import { restructureModel } from "../services/restructureModelService.js";
import { getNumPlies } from "../services/gameDataService.js";

//importing all the views
import bestMoveView from "../views/bestMoveView.js";
import boardOrientationView from "../views/boardOrientationView.js";
import chessboardView from "../views/chessboardView.js";
import chooseAnalysisReviewView from "../views/chooseAnalysisReviewView.js";
import engineLineView from "../views/engineLineView.js";
import evalBarView from "../views/evalBarView.js";
import evalGraphView from "../views/evalGraphView.js";
import gameAccuracyView from "../views/gameAccuracyView.js";
import loadingOverlayView from "../views/loadingOverlayView.js";
import errorOverlayView from "../views/errorOverlayView.js";
import moveClassificationView from "../views/moveClassificationView.js";
import moveListView from "../views/moveListView.js";
import navBtnView from "../views/navBtnView.js";
// import navBtnView from "../views/navBtnView.js"
import playerDescripView from "../views/playerDescripView.js";

import { extractMoveInfo } from "../services/gameDataService.js";

const controlPositionRender = function ({
  from,
  to,
  fenAfter,
  currMoveCp,
  currMoveWinPctg,
  classification,
  currPly,
  plyNum,
  bestMove,
  lines, //{line1 , line2}
}) {
  bestMoveView.render();
  chessboardView.setBoardPosition(fenAfter);
  chessboardView.addLastMoveClassificationStyling(from, to, classification);
  chessboardView.currMoveInfo = {
    from,
    to,
    fenAfter,
    currMoveCp,
    currMoveWinPctg,
    classification,
    currPly,
    plyNum,
    bestMove,
    lines,
  };

  evalBarView.updateEvalBar({ currMoveCp, currMoveWinPctg });
  bestMove = bestMove?.currPly;

  bestMoveView.updateBestMoveSection({
    currPly,
    plyNum,
    classification,
    bestMove,
  });

  if (lines) {
    engineLineView.updateEngineLineSection(lines);
  }
  moveListView.removeCurrPlyHighlight();
  engineLineView.removeCurrPlyHighlight();
};
const controlUpdateGameStats = function () {
  //updating Player descriptions
  const descripObj = gameDataService.getPlayerDescripSectionInfo();
  playerDescripView.updatePlayersDescrip(descripObj);

  //Updating Player Accuracies
  const accuracyObj = gameDataService.getPlayerAccuracySectionInfo();
  gameAccuracyView.updatePlayerAccuracies(accuracyObj);

  //Updating Player move classifcation nums
  const numMovesObj = gameDataService.getMoveClassificationSectionInfo();
  moveClassificationView.updateMoveClassification(numMovesObj);

  //updating evalGraph
  const evalValues = gameDataService.getEvalGraphSectionInfo();
  evalGraphView.updateChartOptions(evalValues);

  //rendering MoveList
  const moveList = gameDataService.getMoveListSectionInfo();
  moveListView.generateMoveList(moveList);

  // renderingPosition
  controlPositionRender(extractMoveInfo(0));

  // adding highlight to first ply
  const firstPly = moveListView.allPlies[0];
  moveListView.highlightCurrPly(firstPly);
};

//handler for click on plies in engine line
const handlerEngineLinePlies = function (lineNum, plyNum) {
  const movePlyNum = navBtnView.currentPlyNum;

  const engineLinePlyObj = gameDataService.getEngineLinePly(
    movePlyNum,
    lineNum,
    plyNum,
  );

  controlPositionRender(engineLinePlyObj);
};

//handlers for click event on choose handler / analysis btn
const handlerRenderAnalysis = function () {
  bestMoveView.render();
  engineLineView.render();
  moveListView.render();
  gameAccuracyView.hide();
  evalGraphView.hide();
  moveClassificationView.hide();
};

const handlerRenderReview = function () {
  gameAccuracyView.render();
  evalGraphView.render();
  moveClassificationView.render();
  bestMoveView.hide();
  engineLineView.hide();
  moveListView.hide();
};

//handler for changing boardOrientation
const handlerChangeBoardOrientation = function (currBoardOrientation) {
  if (currBoardOrientation === "white") {
    chessboardView.setBoardOrientation("black");
    evalBarView.flipEvalPrespective("black");
    playerDescripView.changePrespective("black");
    boardOrientationView.currBoardOrientation = "black";
  }
  if (currBoardOrientation === "black") {
    chessboardView.setBoardOrientation("white");
    evalBarView.flipEvalPrespective("white");
    playerDescripView.changePrespective("white");
    boardOrientationView.currBoardOrientation = "white";
  }
};

//handler for best move btn
const handlerBestMoveBtn = function (plyNum) {
  const bestMoveObj = gameDataService.getBestMoveObj(plyNum);
  controlPositionRender(bestMoveObj);
};

const controlGame = function () {
  gameModel.startGame();
};

const init = async function () {
  try {
    //Page Loads Overlay is Rendered
    loadingOverlayView.render();

    //Adding handler for switching b/w analysis and review
    chooseAnalysisReviewView.addHandlerChooseAnalysisReview(
      handlerRenderAnalysis,
      handlerRenderReview,
    );

    controlGame();
    await Stockfish.getGameEngineAnalysis(
      loadingOverlayView.updateNumMoveAnalysed,
    );
    calculateStats();
    classifyMoves();
    restructureModel();

    navBtnView.lastPlyNum = getNumPlies();
    //Updating Game Stats in view
    controlUpdateGameStats();

    //Page Loads Overlay is Hidden
    loadingOverlayView.hide();

    //addingEventHandlers
    moveListView.addHandlerRenderPosition((plyNum) => {
      controlPositionRender(gameDataService.extractMoveInfo(plyNum));
      navBtnView.currentPlyNum = plyNum; //updating current ply num for nav btns to work properly
      navBtnView.updateNavBtnState();
    });
    boardOrientationView.addHandlerChangeBoardOrientation(
      handlerChangeBoardOrientation,
    );
    bestMoveView.addHandlerBestMoveBtn(handlerBestMoveBtn);
    engineLineView.addHandlerExpandEngineLineBtn();
    engineLineView.addHandlerEngineLinePlies((lineNum, plyNum) => {
      handlerEngineLinePlies(lineNum, plyNum);
    });

    navBtnView.addHandlerNavBtnClick((plyNum) => {
      controlPositionRender(gameDataService.extractMoveInfo(plyNum));
      moveListView.highlightCurrPly(moveListView.allPlies[plyNum]);
    });
  } catch (error) {
    console.error("Game review initialization failed:", error);
    loadingOverlayView.hide();
    errorOverlayView.render();
  }

  //rendering engine lines when best move is rendered from best move btn; (task left)
  // 1 eval --> 1.00 fix
  //add logic for miss
  //handle error handling in the case of wrong username
  //handle graph data points hover
};

init();
