"use strict";

// selecting elements
const player0El = document.querySelector(".player--0");
const player1El = document.querySelector(".player--1");
const score0El = document.querySelector("#score--0");
const score1El = document.getElementById("score--1");
const btnReset = document.querySelector(".btn--reset");
const btnNewRound = document.querySelector(".btn--newRound");
const statusDisplay = document.querySelector(".game--status");
const cellSelection = document.querySelectorAll(".cell");

let scores,
  activePlayer = 0,
  playing;

let gameState = ["", "", "", "", "", "", "", "", ""];

const winningConditions = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

//
const randomPlayer = function () {
  Math.random() < 0.5 ? (activePlayer = 1) : (activePlayer = 0);

  if (activePlayer === 1) {
    player0El.classList.remove("player--active");
    player1El.classList.add("player--active");
  } else {
    player1El.classList.remove("player--active");
    player0El.classList.add("player--active");
  }
};

const winningMessage = () =>
  (statusDisplay.textContent = `PLAYER ${
    activePlayer + 1
  } has WON this round!`);
const drawMessage = () => (statusDisplay.textContent = `Game ended in a DRAW!`);
const currentPlayerTurn = () =>
  (statusDisplay.textContent = `It's Player ${activePlayer + 1}'s turn`);
const gameWon = () =>
  (statusDisplay.textContent = `PLAYER ${activePlayer + 1} has WON the GAME`);

const init = function () {
  score0El.textContent = 0;
  score1El.textContent = 0;

  scores = [0, 0];
  playing = true;
  gameState = ["", "", "", "", "", "", "", "", ""];

  score0El.textContent = 0;
  score1El.textContent = 0;

  randomPlayer();

  currentPlayerTurn();
  cellSelection.forEach((cell) => (cell.textContent = ""));
};
init();

function handleCellPlayed(clickedCell, clickedCellIndex) {
  gameState[clickedCellIndex] = activePlayer;
  clickedCell.textContent = activePlayer ? "O" : "X";
  clickedCell.style.color = activePlayer ? "#194b47" : "#61c25d";
}

function handleResultValidation() {
  let roundWon = false;
  for (let i = 0; i <= 7; i++) {
    const winCondition = winningConditions[i];
    let a = gameState[winCondition[0]];
    let b = gameState[winCondition[1]];
    let c = gameState[winCondition[2]];
    if (a === "" || b === "" || c === "") {
      continue;
    }
    if (a === b && b === c) {
      roundWon = true;
      break;
    }
  }
  if (roundWon && scores[activePlayer] < 5) {
    winningMessage();
    scores[activePlayer] += 1;
    document.getElementById(`score--${activePlayer}`).textContent =
      scores[activePlayer];
    playing = false;
    return;
  }

  let roundDraw = !gameState.includes("");
  if (roundDraw) {
    drawMessage();
    playing = false;
    return;
  }
  switchPlayer();
}

btnNewRound.addEventListener("click", function () {
  if (scores[activePlayer] < 5) {
    playing = true;
    gameState = ["", "", "", "", "", "", "", "", ""];

    currentPlayerTurn();
    cellSelection.forEach((cell) => {
      cell.textContent = "";
    });
  } else {
    gameWon();
    setTimeout(init, 2000);
  }
});

function handleCellClick(clickedCellEvent) {
  const clickedCell = clickedCellEvent.target;
  const clickedCellIndex = parseInt(
    clickedCell.getAttribute("data-cell-index")
  );

  if (gameState[clickedCellIndex] !== "" || !playing) {
    return;
  }

  handleCellPlayed(clickedCell, clickedCellIndex);
  handleResultValidation();
}

const switchPlayer = function () {
  activePlayer = activePlayer === 0 ? 1 : 0;
  currentPlayerTurn();
  player0El.classList.toggle("player--active");
  player1El.classList.toggle("player--active");
};

cellSelection.forEach((cell) =>
  cell.addEventListener("click", handleCellClick)
);
btnReset.addEventListener("click", function () {
  init();
});
