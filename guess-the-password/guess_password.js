"use strict";
const WORD_COUNT = 10;
const guessCount = 4;
let password = "";

let startButton = document.getElementById("start");


/** Toggle classes on `elem`. This takes an arbirtrary number of classes. */

function toggleClasses(element) {
  for (let i = 1; i < arguments.length; i++) {
    element.classList.toggle(arguments[i]);
  }
}


/** Start game:
 *
 * - get WORD_COUNT number of random words
 * - add words to word list in DOM
 * - pick one to be the password
 * - reset the guess count and set up handler for clicking on a word
 *
 */

function startGame() {
  toggleClasses(document.getElementById("start-screen"), "hide", "show");
  toggleClasses(document.getElementById("game-screen"), "hide", "show");

  // get random words and append them to the DOM
  let wordList = document.getElementById("word-list");
  let randomWords = getSample(words, WORD_COUNT);

  randomWords.forEach(word => {
    let li = document.createElement("li");
    li.innerText = word;
    wordList.appendChild(li);
  });

  password = getSample(randomWords, 1)[0];
  setGuessCount(guessCount);

  // when user clicks on a word, this will handle updating the game
  wordList.addEventListener("click", handleGuess);
}


/** Return `n` return items from array. */

function getSample(array, n) {
  return shuffle(array).slice(0, n);
}


/** Returns new array from `array`, shuffled. */

function shuffle(array) {
  let arrayCopy = [...array];

  for (let idx1 = arrayCopy.length - 1; idx1 > 0; idx1--) {
    // generate a random index between 0 and idx1 (inclusive)
    let idx2 = Math.floor(Math.random() * (idx1 + 1));

    // swap elements at idx1 and idx2
    // let temp = arrayCopy[idx1];
    // arrayCopy[idx1] = arrayCopy[idx2];
    // arrayCopy[idx2] = temp;
    [arrayCopy[idx1], arrayCopy[idx2]] = [arrayCopy[idx2], arrayCopy[idx1]];
  }

  return arrayCopy;
}


/** Set `guessCount` and update DOM. */

function setGuessCount(newCount) {
  guessCount = newCount;
  document.getElementById("guesses-remaining").innerText =
      `Guesses remaining: ${guessCount}.`;
}


/** Handle guess by a player:
 *
 * - figure out how different it is from password and display that
 * - if correct, end game with winner message
 * - if used last guess, end game with loser message
 *
 */

function handleGuess(evt) {
  let listItem = evt.target;

  if (listItem.tagName !== "LI" ||
      listItem.classList.contains("disabled")) {
    return;
  }

  let guessedWord = listItem.innerText;
  let similarityScore = getSimilarityScore(guessedWord, password);
  listItem.classList.add("disabled");
  listItem.innerText = `${guessedWord} --> Matching Letters: ${similarityScore}`;
      // guessedWord + " --> Matching Letters: " + similarityScore;
  setGuessCount(guessCount - 1);

  if (similarityScore === password.length) {
    document.getElementById("winner").classList.add("show");
  } else if (guessCount === 0) {
    document.getElementById("loser").classList.add("show");
  }
}


/** Return number of letters in common between `word1` and `word2`. */

function getSimilarityScore(word1, word2) {
  console.assert(word1.length === word2.length,
      "Words must have the same length!");

  let numCommon = 0;

  for (let i = 0; i < word1.length; i++) {
    if (word1[i] === word2[i]) numCommon += 1;
  }

  return numCommon;
}


startButton.addEventListener("click", startGame);
