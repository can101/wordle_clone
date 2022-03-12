const tileDisplay = document.querySelector(".tile-container");
const keyboard = document.querySelector(".key-container");
const messageDispaly = document.querySelector(".message-container");
const titleDispaly = document.querySelector(".again-game");

let aginBtn;
let guess;

let wordleList = [];
let wordle = "";
let wordleIndex = 0;

const getWordle = () => {
  fetch(`${window.location.href}word`)
    .then((response) => response.json())
    .then((response) => {
      wordleList = response;
      wordle = response[wordleIndex];
      wordleList = response;
    })
    .catch((error) => {
      console.log(error);
    });
};

getWordle();

const keys = ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "a", "s", "d", "f", "g", "h", "j", "k", "l", "enter", "z", "x", "c", "v", "b", "n", "m", "⌫"];

let guessRows = [
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
];

let currentRow = 0;
let currentTile = 0;
let isGameOver = false;

guessRows.forEach((guessRow, guessIndexRow) => {
  const tileRowElement = document.createElement("div");
  tileRowElement.setAttribute("id", `guessRow-${guessIndexRow}`);
  guessRow.forEach((guess, guessIndex) => {
    const tileElement = document.createElement("div");
    tileElement.setAttribute("id", `guessRow-${guessIndexRow}-guessIndex-${guessIndex}`);
    tileElement.classList.add("tile");
    tileRowElement.append(tileElement);
  });
  tileDisplay.append(tileRowElement);
});
keys.forEach((key) => {
  const keyButtonElement = document.createElement("button");
  keyButtonElement.innerText = key;
  keyButtonElement.setAttribute("id", key);
  keyButtonElement.addEventListener("click", () => handleClick(key));
  keyboard.append(keyButtonElement);
});

const handleClick = (key) => {
  if (key === "⌫") {
    deleteLetter();
    return;
  } else if (key.toUpperCase() === "enter".toUpperCase()) {
    checkRow();
    return;
  }
  addLetter(key);
};

const againGame = () => {
  const rety = `<button class="retyButton" style="margin-left: 10px">
  <i class="fa-solid fa-xl fa-play fa-beat-fade" style="padding-left: 5px"></i>
</button>`;
  titleDispaly.innerHTML = rety;
  aginBtn = document.getElementsByClassName("retyButton")[0];
  aginBtn.addEventListener("click", () => {
    //keyboard color delete
    const removeClassList = ["grey-overlay", "green-overlay", "yellow-overlay"];
    keyboard.childNodes.forEach((key) => {
      if (removeClassList.includes(key.getAttribute("class"))) {
        key.classList.remove(key.getAttribute("class"));
      }
    });
    //tile color delete
    //guess / currentRow / currenTile delete
    guess = [];
    currentRow = 0;
    currentTile = 0;
    guessRows = [
      ["", "", "", "", ""],
      ["", "", "", "", ""],
      ["", "", "", "", ""],
      ["", "", "", "", ""],
      ["", "", "", "", ""],
      ["", "", "", "", ""],
    ];
    //tile dlete value end colors
    for (let index = 0; index < guessRows.length; index++) {
      tileDisplay.childNodes[index].childNodes.forEach((t) => {
        t.className = "tile";
        t.textContent = null;
      });
    }
    aginBtn.remove();
    if (wordleIndex < wordleList.length - 1) {
      ++wordleIndex;
      console.log(wordleList[wordleIndex]);
      wordle = wordleList[wordleIndex];
    } else {
      wordleIndex = 0;
      getWordle();
    }
    // wordle = wordleList[wordleIndex];
  });
};

const addLetter = (letter) => {
  if (currentTile < 5 && currentRow < 6) {
    const tile = document.getElementById(`guessRow-${currentRow}-guessIndex-${currentTile}`);
    tile.classList.add("scale");
    setTimeout(() => {
      tile.setAttribute("data", letter);
      tile.textContent = letter.toUpperCase();
      guessRows[currentRow][currentTile] = letter.toUpperCase();
      currentTile++;
    }, 10);
  }
};

const deleteLetter = () => {
  if (currentTile > 0) {
    currentTile--;
    const tile = document.getElementById(`guessRow-${currentRow}-guessIndex-${currentTile}`);
    tile.classList.remove("scale");
    tile.textContent = "";
    tile.setAttribute("data", "");
    guessRows[currentRow][currentTile] = "";
  }
};

const checkRow = () => {
  const guess = guessRows[currentRow].join("");
  if (currentTile > 4) {
    flipTile();
    if (wordle == guess) {
      againGame();
      showMessage("Magnificent!");
      againGame();
      isGameOver = true;
    } else {
      if (currentRow >= 5) {
        againGame();
        isGameOver = false;
        showMessage(wordle);
        return;
      }
      if (currentRow < 5) {
        currentRow++;
        currentTile = 0;
      }
    }
  }
};

const showMessage = (message) => {
  const messageElement = document.createElement("p");
  messageElement.textContent = message;
  messageDispaly.append(messageElement);
  setTimeout(() => {
    messageDispaly.removeChild(messageElement);
  }, 4000);
};

const addColorToKey = (keyLetter, color) => {
  const key = document.getElementById(keyLetter.toLowerCase());
  if ("green-overlay" === key.getAttribute("class")) {
    return false;
  } else {
    key.className = "";
    key.classList.add(color);
  }
};

const flipTile = () => {
  const rowTiles = document.getElementById(`guessRow-${currentRow}`).childNodes;
  let checkWordle = wordle;
  guess = [];

  rowTiles.forEach((tile) => {
    guess.push({ letter: tile.getAttribute("data").toUpperCase(), color: "grey-overlay" });
  });
  guess.forEach((guess, index) => {
    if (guess.letter == wordle[index]) {
      guess.color = "green-overlay";
      checkWordle = checkWordle.replace(guess.letter.toUpperCase(), "");
    }
  });

  guess.forEach((guess, index) => {
    if (checkWordle.includes(guess.letter)) {
      guess.color = "yellow-overlay";
      checkWordle = checkWordle.replace(guess.letter.toUpperCase(), "");
    }
  });

  rowTiles.forEach((tile, index) => {
    setTimeout(() => {
      tile.classList.add("flip");
      tile.classList.add(guess[index].color);
      addColorToKey(guess[index].letter.toUpperCase(), guess[index].color);
    }, 500 * index);
  });
};
