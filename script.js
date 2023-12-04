// Pages
const gamePage = document.getElementById('game-page');
const scorePage = document.getElementById('score-page');
const splashPage = document.getElementById('splash-page');
const countdownPage = document.getElementById('countdown-page');
// Splash Page
const startForm = document.getElementById('start-form');
const radioContainers = document.querySelectorAll('.radio-container');
const radioInputs = document.querySelectorAll('input');
const bestScores = document.querySelectorAll('.best-score-value');
// Countdown Page
const countdown = document.querySelector('.countdown');
// Game Page
const itemContainer = document.querySelector('.item-container');
// Score Page
const finalTimeEl = document.querySelector('.final-time');
const baseTimeEl = document.querySelector('.base-time');
const penaltyTimeEl = document.querySelector('.penalty-time');
const playAgainBtn = document.querySelector('.play-again');

// Equations
let questionAmount = 0;
let equationsArray = [];
let playGuessArray = [];
let bestScoreArray = [];

// Game Page
let firstNumber = 0;
let secondNumber = 0;
let equationObject = {};
const wrongFormat = [];

// Time
let timer;
let timePlayed = 0;
let baseTime = 0;
let penaltyTIme = 0;
let finalTime =  0;
let finalTimeDisplay = '0.0';

// Scroll
let valueY = 0;

// Refresh splah page best scores
function bestScoresToDOM() {
  bestScores.forEach((bestScore, index) => {
    const bestScoreEl = bestScore;
    bestScoreEl.textContent = `${bestScoreArray[index].bestScore}s`;
  });

}

// check localstorage for vest scores
function getSavedBestScores() {
  if (localStorage.getItem('bestScores')){
    bestScoreArray = JSON.parse(localStorage.bestScores);
    console.log("first");
  } else {
    console.log("second");
    bestScoreArray = [
      {questions: 10, bestScore: finalTimeDisplay},
      {questions: 25, bestScore: finalTimeDisplay},
      {questions: 50, bestScore: finalTimeDisplay},
      {questions: 99, bestScore: finalTimeDisplay}
    ];

    localStorage.setItem('bestScores', JSON.stringify(bestScoreArray));
  }
  console.log("bestscore loaded: " , bestScoreArray);

  bestScoresToDOM();
}

// update bestscore array
function updateBestScore() {

  bestScoreArray.forEach((score, index) => {
    // select correct bestscore to update
    if(questionAmount == score.questions){
      // resturn the best score  as number with one decimal
      const savedBestScore  = Number(bestScoreArray[index].bestScore);

      console.log(savedBestScore);

      if(savedBestScore === 0 || savedBestScore > finalTime){
        bestScoreArray[index].bestScore = finalTimeDisplay;
      }
    }
  });
  // update splash page 
  bestScoresToDOM();
  // save to local
  localStorage.setItem('bestScores', JSON.stringify(bestScoreArray));
}

// reset the game 
function playAgain() {

  gamePage.addEventListener('click', startTimer);
  scorePage.hidden = true;
  splashPage.hidden = false;
  equationsArray = [];
  playGuessArray = [];
  valueY = 0;
  playAgainBtn.hidden = true;
}

// show score page 
function showScorePage() {
  setTimeout(() => {
    playAgainBtn.hidden = false;
  }, 1000);

  gamePage.hidden = true;
  scorePage.hidden = false;
}

// scores to dom format and displays in dom
function scoresToDOM(){
  finalTimeDisplay = finalTime.toFixed(1);
  baseTime = timePlayed.toFixed(1);
  penaltyTIme = penaltyTIme.toFixed(1);
  baseTimeEl.textContent = `Base Time: ${baseTime}s`;
  penaltyTimeEl.textContent = `Penalty: +${penaltyTIme}s`;
  finalTimeEl.textContent = `${finalTimeDisplay}s`;
  updateBestScore();
  // scroll to top 
  itemContainer.scrollTo({top: 0, behavior: 'instant'});
  showScorePage();
}

// stop time , process results go to Score page
function checkTime() {
  if(playGuessArray.length == questionAmount) {
    clearInterval(timer);
    // check wrong guesses, add penalty time;
    equationsArray.forEach((equation, index) =>{
      if(equation.evaluated === playGuessArray[index]) {
          // correct guess , no penalty 
      } else {
        penaltyTIme += 0.5;
      }
    });

    finalTime = timePlayed + penaltyTIme;
    scoresToDOM();
  }
}

// add a 10th of a second to timeplayed
function addTime(){
  timePlayed += 0.1;
  checkTime();
}

// start time when game page is clicked
function startTimer() {
  timePlayed = 0;
  penaltyTIme = 0;
  finalTime = 0;
  timer = setInterval(addTime, 100);
  gamePage.removeEventListener('click', startTimer);
}

//scroll , store user selection i playGuessArray
function select(guessedTrue) {
 
  // scroll 80px 
  valueY += 80;
  itemContainer.scroll(0, valueY);
  // add player guess to array
  return guessedTrue ? playGuessArray.push('true') : playGuessArray.push('false');
}

// dusplays game page
function showGamePage(){
  gamePage.hidden = false
  countdownPage.hidden = true;
}

// GET random number up to max number 
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

// Create Correct/Incorrect Random Equations
function createEquations() {
  // Randomly choose how many correct equations there should be
   const correctEquations = getRandomInt(questionAmount);
   console.log('correct: ', correctEquations);
  // Set amount of wrong equations
   const wrongEquations = questionAmount - correctEquations;
   console.log('wrong: ', wrongEquations);
  // Loop through, multiply random numbers up to 9, push to array
  for (let i = 0; i < correctEquations; i++) {
    firstNumber = getRandomInt(9);
    secondNumber = getRandomInt(9)
    const equationValue = firstNumber * secondNumber;
    const equation = `${firstNumber} x ${secondNumber} = ${equationValue}`;
    equationObject = { value: equation, evaluated: 'true' };
    equationsArray.push(equationObject);
  }
  // Loop through, mess with the equation results, push to array
  for (let i = 0; i < wrongEquations; i++) {
    firstNumber = getRandomInt(9);
    secondNumber = getRandomInt(9);
    const equationValue = firstNumber * secondNumber;
    wrongFormat[0] = `${firstNumber} x ${secondNumber + 1} = ${equationValue}`;
    wrongFormat[1] = `${firstNumber} x ${secondNumber} = ${equationValue - 1}`;
    wrongFormat[2] = `${firstNumber + 1} x ${secondNumber} = ${equationValue}`;
    const formatChoice = getRandomInt(3);
    const equation = wrongFormat[formatChoice];
    equationObject = { value: equation, evaluated: 'false' };
    equationsArray.push(equationObject);
  }
  shuffle(equationsArray);

}

function equationsToDom() {
  equationsArray.forEach((equation) => {
    // item
    const item = document.createElement('div');
    item.classList.add('item');
    // equation text
    const equationText = document.createElement('h1');
    equationText.textContent = equation.value;
    // append
    item.appendChild(equationText);
    itemContainer.appendChild(item);
  });
}

// Dynamically adding correct/incorrect equations
function populateGamePage() {
  // Reset DOM, Set Blank Space Above
  itemContainer.textContent = '';
  // Spacer
  const topSpacer = document.createElement('div');
  topSpacer.classList.add('height-240');
  // Selected Item
  const selectedItem = document.createElement('div');
  selectedItem.classList.add('selected-item');
  // Append
  itemContainer.append(topSpacer, selectedItem);

  // Create Equations, Build Elements in DOM
  createEquations();
  equationsToDom();
  // Set Blank Space Below
  const bottomSpacer = document.createElement('div');
  bottomSpacer.classList.add('height-500');
  itemContainer.appendChild(bottomSpacer);
}

// display 3 2 1 go
var countdownItems = ['3', '2' ,'1' ,'GO!']

function countdownStart(countdownIndex) {
  countdown.textContent = countdownItems[countdownIndex];
  setTimeout(() => {
    if(countdownIndex < countdownItems.length - 1){
      countdownStart(countdownIndex + 1);
    } else {
      //create equatoins 
      populateGamePage();
      // show the game page
      showGamePage();
    }
  }, 1000);
}

// Navigate splash page to countdown page
function showCountdown() {
  countdownPage.hidden = false;
  splashPage.hidden = true;
  countdownStart(0);


}

// Get the value of selected radio button 
function getRadioValue() {
  let radioValue;
  radioInputs.forEach((radioInput) =>{
    if(radioInput.checked) {
      radioValue = radioInput.value;
    }
  });

  return radioValue;
}

// form that desides amount of questions 
function selectQuestionAmount(e) {
  e.preventDefault();
  questionAmount = getRadioValue();
  // check for undefined
  if(questionAmount){
    showCountdown();
  }
}

startForm.addEventListener('click', () => {
  radioContainers.forEach((radioEl) => {
    // remove Selected lable styling 
    radioEl.classList.remove('selected-label');
    // add it back if radio  input is checked
    if(radioEl.children[1].checked) {
      radioEl.classList.add('selected-label');
    }
  });
});

// eventlisteners 
startForm.addEventListener('submit', selectQuestionAmount);
gamePage.addEventListener('click', startTimer);

// on load
getSavedBestScores();