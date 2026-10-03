import View from "./View";
class moveClassificationSection {
  #parentElement = document.querySelector(".move-classification-section");
  

  constructor() {
    super();
  }

  updateMoveClassification({white : {whiteUsername , numMoveWhite} , black : {blackUsername , numMoveBlack}}){
    document.querySelector('.white-username').textContent = whiteUsername;
    document.querySelector('.black-username').textContent = blackUsername;
    this.#updateNumMoves('white' , numMoveWhite);
    this.#updateNumMoves('black' , numMoveBlack);
  }

  #updateNumMoves(color , numMoveObj){
    ['brilliant' , 'great' , 'book' , 'best' , 'excellent' , 'good' , 'inaccuracy' , 'mistake' , 'blunder' ].forEach(type => {
        const ele = document.querySelector(`.for-${color}.num-move-${type}`);
        ele.textContent = numMoveObj[type];
    })
  }
}
