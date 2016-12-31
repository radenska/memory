'use strict';
////// GLOBAL VARIABLES BOI /////////
var allPictures = [];
var boardLocation = [];
var clickStorage = [];
var matchLocation = [];
var subset = [];
var gameBoard = document.getElementById('gameBoard');
var startingTimeInMs;
var boardSize;
var initialNameEntered = false;
var isHighScore = false;//used to determine if the Register Your Score button should be displayed

//DOM variables
var userForm = document.getElementById('user-form'); //user name
var playGame = document.getElementById('playGame');//want to play?
var yesButton = document.getElementById('yesButton');//yes to play
var noButton = document.getElementById('noButton');//no to play
var wantToPlay = document.getElementById('yesLetsPlay');//displays game instructions
var seeInstructions = document.getElementById('seeInstructions');
var registerScore = document.getElementById('registerScore');//top ten player registry

function Img(idNumber) {
  this.idNumber = idNumber;
  this.filepath = 'img/' + this.idNumber + '.png';
  this.boardLocation = -1;
  this.currentSide = 'img/card.png';
  this.cardBack = 'img/card.png';
}

function randomizeSet() {
  return Math.floor(Math.random() * 23);
}

function pickRandomSetOfImages() {
  var tempId;
  subset = [];
  while (subset.length < boardSize) {
    tempId = randomizeSet();
    if (!subset.includes(tempId)) {
      subset.push(tempId);
    }
  }
}

// All of our pic names are just numbers so we don't have to write out all of the individual pic IDS doppppeeeeeee
function picIds() {
  for (var i = 0; i < boardSize; i++) {
    allPictures.push(new Img(subset[i]));
  }
}

function rand() {
  return Math.floor(Math.random() * (boardSize * 2));
}

function randomImages () {
  do {
    var temp = rand();
    if (boardLocation.indexOf(temp) === -1) {
      boardLocation.push(temp);
      allPictures[temp].boardLocation = boardLocation.length - 1;
    }
  } while (boardLocation.length < (boardSize * 2));
}

function putImagesOnBoard (tcEl, imgEl, trEl, gameBoard, i) {
  tcEl = trEl.insertCell(-1);
  imgEl = document.createElement('img');
  imgEl.id = i;
  imgEl.src = allPictures[boardLocation[i]].currentSide;
  tcEl.appendChild(imgEl);
  trEl.appendChild(tcEl);
  gameBoard.appendChild(trEl);
}

function makeGameBoard() {
  var trEl;
  var imgEl;
  var tcEl;
  for (var i = 0; i < boardLocation.length; i++) {
    if (i % (Math.sqrt(boardSize * 2)) === 0) {
      trEl = document.createElement('tr');
      putImagesOnBoard(tcEl, imgEl, trEl, gameBoard, i);
    } else {
      putImagesOnBoard(tcEl, imgEl, trEl, gameBoard, i);
    }
  }
}
////////////////// VARIABLES USED FOR THE GAME CLICK FUNCTION /////////////////

function initializeMatchLocation () {
  for (var i = 0; i < boardLocation.length; i++) {
    matchLocation.push(false);
  }
}

function wait () {
  gameBoard.innerHTML = '';
  makeGameBoard();
}

function endOfRound() {
  if (clickStorage.length === 2) {
    if (allPictures[clickStorage[0]].idNumber !== allPictures[clickStorage[1]].idNumber) {
      allPictures[clickStorage[1]].currentSide = allPictures[0].cardBack;
      allPictures[clickStorage[0]].currentSide = allPictures[0].cardBack;
      setTimeout(wait, 2000);
    } else {
      matchLocation[allPictures[clickStorage[1]].boardLocation] = true;
      matchLocation[allPictures[clickStorage[0]].boardLocation] = true;
    }
    clickStorage = [];
  }
}

///////////////////////// FUNCTION FOR GAME ///////////////////////////
function clickFlip(event) {
  event.preventDefault();
  if (matchLocation[parseInt(event.target.id)] === false && clickStorage.length < 2) {
    var numId = parseInt(event.target.id);
    // for two turns
    for (var i = 0; i < boardLocation.length; i++) {
      if (numId === allPictures[i].boardLocation) {
        allPictures[i].currentSide = allPictures[i].filepath;
        clickStorage.push(i);
      }
    }
    gameBoard.innerHTML = '';
    makeGameBoard();
    endOfRound();
    if (matchLocation.indexOf(false) === -1) {
      endGame();
    }
  }
}

function endGame() {
  var endingTimeInMS = Date.now();
  var timeCalc = (endingTimeInMS - startingTimeInMs) / 60000;
  localStorage.newScore = JSON.stringify(Math.round(Math.floor(timeCalc * 100))); //need to round-up
  setTimeout(function () {
    gameBoard.innerHTML = '';
    if (boardSize === 8) {
      checkScores('highScores4', 'highScorers4');
    } else {
      checkScores('highScores6', 'highScorers6');
    }
    playAgainButtons();
    registerYourScore();
  }, 2000);
}

function play(e) {
  e.preventDefault();
  allPictures = [];
  boardLocation = [];
  clickStorage = [];
  matchLocation = [];
  // document.getElementById('op1').innerHTML = '';
  // document.getElementById('op2').innerHTML = '';
  registerScore.innerHTML = '';
  document.getElementById('playSame').innerHTML = '';
  document.getElementById('playOther').innerHTML = '';
  document.getElementById('afterGame').innerHTML = '';
  pickRandomSetOfImages();
  picIds();
  picIds();
  randomImages();
  makeGameBoard();
  initializeMatchLocation();
  startingTimeInMs = Date.now();
}

function checkScores(whichSizeScores, whichSizeScorers) {
  isHighScore = false;
  var highScores = [];
  var highScorers = [];
  var newScore = parseInt(JSON.parse(localStorage.getItem('newScore')));
  var userName = JSON.parse(localStorage.getItem('userName'));

  function storeScores () {
    if (boardSize === 8) {
      localStorage.highScores4 = JSON.stringify(highScores);
      localStorage.highScorers4 = JSON.stringify(highScorers);
    } else {
      localStorage.highScores6 = JSON.stringify(highScores);
      localStorage.highScorers6 = JSON.stringify(highScorers);
    }
  }

  function placeForScore(score) {
    return score >= newScore;
  }

  if ((boardSize === 8 && localStorage.highScores4) || (boardSize === 18 && localStorage.highScores6)) {
    highScores = JSON.parse(localStorage.getItem(whichSizeScores));
    highScorers = JSON.parse(localStorage.getItem(whichSizeScorers));
    if (parseInt(highScores[highScores.length - 1]) > newScore || highScores.length < 10) {
      isHighScore = true;
      if (highScores.length === 10) {
        highScores.pop();
        highScorers.pop();
      }
      var indexForNewHighScore = highScores.find(placeForScore);
      indexForNewHighScore = highScores.indexOf(indexForNewHighScore);
      if (indexForNewHighScore !== -1) {
        highScores.splice(indexForNewHighScore, 0, newScore);
        highScorers.splice(indexForNewHighScore, 0, userName);
      } else {
        highScores.push(newScore);
        highScorers.push(userName);
      }
      storeScores();
    }
  } else {
    isHighScore = true;
    highScores.push(newScore);
    highScorers.push(userName);
    storeScores();
  }
}

/////////////////////////////////////////////////////////////////////////////////

//Populate User Name
//Check UserName on Main Page for blanks
if (localStorage.userName) {
  userForm.innerHTML='';
  var pEl = document.createElement('p');
  pEl.textContent = JSON.parse(localStorage.getItem('userName')) + ', would you like to play a game?';
  playGame.appendChild(pEl);
  displayYesNoButtons();
}

function userHandler(event) {
  event.preventDefault();
  localStorage.userName = JSON.stringify(event.target.userName.value);
  userNamePopulated();
}

function userNamePopulated() {
  userForm.innerHTML='';
  if (localStorage.userName && initialNameEntered === false) {
    var pEl = document.createElement('p');
    pEl.textContent = JSON.parse(localStorage.getItem('userName')) + ', would you like to play a game?';
    playGame.appendChild(pEl);
    initialNameEntered = true;
    displayYesNoButtons();
  }
}

//Generate a yes and no button
function displayYesNoButtons() {
//Yes button displayed
  var newButtonYes = document.createElement('BUTTON');
  newButtonYes.textContent = 'YES';
  yesButton.appendChild(newButtonYes);
//No button displayed
  var newButtonNo = document.createElement('BUTTON');
  newButtonNo.textContent = 'NO';
  noButton.appendChild(newButtonNo);
}
function newInstructionsButton () {
  var instructionButton = document.createElement('BUTTON');
  instructionButton.textContent = 'SEE GAME INSTRUCTIONS';
  seeInstructions.appendChild(instructionButton);
}

function seeInitialInstructions() {
  var h3El = document.createElement('h4');
  h3El.textContent = 'The game starts with rows of cards all facing down. Once you click one of the play buttons, an invisible timer will start. You turn cards over by clicking on them, revealing two cards per round. If a match occurs the cards will remain facing up.  If a match doesn’t occur the cards will automatically be turned face down.  Repeat this process until you have matched all the pairs. Good luck!';
  wantToPlay.appendChild(h3El);
  seeInstructions.innerHTML='';
  var hideInstructionsButton = document.createElement('button');
  hideInstructionsButton.textContent = 'HIDE INSTRUCTIONS';
  document.getElementById('hideInstructions').appendChild(hideInstructionsButton);
}

//User doesn't want to play, they are transported to the Jokes page.
function noLetsNotPlay() {
  document.location.href = 'jokes.html'; //this hooks into the Jokes Page
}

function registerYourScore(){
  var newButtonRegisterYourScore = document.createElement('BUTTON');
  newButtonRegisterYourScore.textContent = 'SEE HIGH SCORES';
  registerScore.appendChild(newButtonRegisterYourScore);

  if (isHighScore) {
    document.getElementById('afterGame').textContent = 'Way to go, ' + JSON.parse(localStorage.getItem('userName')) + '! ' + 'Your time of ' + JSON.parse(localStorage.getItem('newScore')) + ' seconds is in the top ten high scores!';
  }
  else {
    document.getElementById('afterGame').textContent = 'Way to go, ' + JSON.parse(localStorage.getItem('userName')) + '! ' + 'You finished the game in ' + JSON.parse(localStorage.getItem('newScore')) + ' seconds!';
  }
  localStorage.newScore = '';
}
function createOptionsButton(size, whereAppend) {
  var newPlayButton = document.createElement('BUTTON');
  newPlayButton.textContent = 'PLAY ' + size;
  document.getElementById(whereAppend).appendChild(newPlayButton);
}

function yesLetsPlay() {
  playGame.innerHTML='';
  yesButton.innerHTML='';
  noButton.innerHTML='';
  createOptionsButton('4x4 BOARD', 'op1');
  createOptionsButton('6x6 BOARD', 'op2');
  newInstructionsButton();
}

function playAgainButtons() {
  var tempSize;
  var tempNewSize;
  if (boardSize === 8) {
    tempSize = '4x4 BOARD AGAIN';
    tempNewSize = '6x6 INSTEAD';
  } else {
    tempSize = '6x6 BOARD AGAIN';
    tempNewSize = '4x4 INSTEAD';
  }
  createOptionsButton(tempSize, 'playSame');
  createOptionsButton(tempNewSize, 'playOther');
  document.getElementById('afterGame').innerHTML = '';

}

function registerScorePage(e) {//placeholder for calling the registerScorePage
  e.preventDefault();
  document.getElementById('afterGame').textContent = '';
  document.location.href = 'scores.html';
}

function hideInstructionsHandler(e) {
  e.preventDefault();
  document.getElementById('hideInstructions').innerHTML = '';
  wantToPlay.innerHTML = '';
  newInstructionsButton();
}

function optionsHandler(e) {
  e.preventDefault();
  var tempSize = event.target.innerText;
  document.getElementById('op1').innerHTML = '';
  document.getElementById('op2').innerHTML = '';
  if (tempSize.charAt(5) === '4') {
    boardSize = 8;
  } else {
    boardSize = 18;
  }
  localStorage.boardSize = JSON.stringify(boardSize);
}

function playAgainHandler(e) {
  e.preventDefault();
  var tempSize = event.target.innerText;
  if (tempSize.charAt(5) === '4') {
    boardSize = 8;
  } else {
    boardSize = 18;
  }
  localStorage.boardSize = JSON.stringify(boardSize);
}

//Event Listeners for Main Page
document.getElementById('op1').addEventListener('click', optionsHandler);
document.getElementById('op2').addEventListener('click', optionsHandler);
document.getElementById('op1').addEventListener('click', play);
document.getElementById('op2').addEventListener('click', play);
userForm.addEventListener('submit', userHandler);
yesButton.addEventListener('click',yesLetsPlay);
seeInstructions.addEventListener('click',seeInitialInstructions);
noButton.addEventListener('click',noLetsNotPlay);
registerScore.addEventListener('click',registerScorePage);//topten
document.getElementById('playSame').addEventListener('click', playAgainHandler);
document.getElementById('playSame').addEventListener('click', play);
document.getElementById('playOther').addEventListener('click', playAgainHandler);
document.getElementById('playOther').addEventListener('click', play);
gameBoard.addEventListener('click', clickFlip);
document.getElementById('hideInstructions').addEventListener('click', hideInstructionsHandler);
