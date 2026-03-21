///////////////
// Constants //
///////////////

const guessAmount = 6;

////////////
// Global //
////////////

let jsonData;
let remainingGuesses = guessAmount;
let hiddenWord;
let userWord;

window.onload = function () {
    RequestJsonData();
    GoToSelectionScreen();
    document
        .querySelector("#start-button")
        .addEventListener("click", GoToGameScreen);
    document
        .querySelector("#play-again-button")
        .addEventListener("click", RestartGame);
    document
        .querySelector("#letter-buttons")
        .addEventListener("click", LetterClick);
};

function RequestJsonData() {
    let url = "./data/vocabularies.json";
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            data = JSON.parse(xhr.responseText);
            jsonData = data;
            SetDropDownValues(CreateDropDownHTML());
        }
    };
    xhr.open("GET", url, true);
    xhr.send();
}

/////////////////////
// Screen Handling //
/////////////////////

function GoToSelectionScreen() {
    document.querySelector("#start-container").classList.remove("hidden");
    document.querySelector("#result-container").classList.add("hidden");
    document.querySelector("#game-container").classList.add("hidden");
}
function GoToGameScreen() {
    RefreshGame();
    document.querySelector("#start-container").classList.add("hidden");
    document.querySelector("#result-container").classList.remove("hidden");
    document.querySelector("#game-container").classList.remove("hidden");
}
function GoToResultScreen() {
    document.querySelector("#start-container").classList.add("hidden");
    document.querySelector("#result-container").classList.remove("hidden");
    document.querySelector("#game-container").classList.remove("hidden");
}

////////////////////
// Canvas Drawing //
////////////////////

function RefreshCanvas() {
    // Clear
    const c = document.querySelector("#hangman-canvas");
    const ctx = c.getContext("2d");
    ctx.clearRect(0, 0, c.width, c.height);
    // Draw Gallow
    ctx.beginPath();

    ctx.moveTo(70, 100);
    ctx.lineTo(450, 100);

    ctx.moveTo(350, 100);
    ctx.lineTo(350, 200);

    ctx.moveTo(100, 70);
    ctx.lineTo(100, 500);

    ctx.moveTo(100, 500);
    ctx.lineTo(20, 500);

    ctx.moveTo(100, 500);
    ctx.lineTo(450, 500);

    ctx.moveTo(220, 100);
    ctx.lineTo(100, 150);
    ctx.lineWidth = 3;
    ctx.stroke();
}

function DrawHead() {
    let c = document.querySelector("#hangman-canvas");
    let ctx = c.getContext("2d");
    ctx.beginPath();
    ctx.arc(350, 240, 40, 0, 2 * Math.PI);
    ctx.stroke();
}

function DrawBody() {
    let c = document.querySelector("#hangman-canvas");
    let ctx = c.getContext("2d");
    ctx.beginPath();
    ctx.moveTo(350, 280);
    ctx.lineTo(350, 370);
    ctx.stroke();
}

function DrawLeftArm() {
    let c = document.querySelector("#hangman-canvas");
    let ctx = c.getContext("2d");
    ctx.beginPath();
    ctx.moveTo(350, 310);
    ctx.lineTo(290, 310);
    ctx.stroke();
}

function DrawRightArm() {
    let c = document.querySelector("#hangman-canvas");
    let ctx = c.getContext("2d");
    ctx.beginPath();
    ctx.moveTo(350, 310);
    ctx.lineTo(410, 310);
    ctx.stroke();
}

function DrawLeftLeg() {
    let c = document.querySelector("#hangman-canvas");
    let ctx = c.getContext("2d");
    ctx.beginPath();
    ctx.moveTo(350, 365);
    ctx.lineTo(320, 420);
    ctx.stroke();
}

function DrawRightLeg() {
    let c = document.querySelector("#hangman-canvas");
    let ctx = c.getContext("2d");
    ctx.beginPath();
    ctx.moveTo(350, 365);
    ctx.lineTo(380, 420);
    ctx.stroke();
}

////////////////
// Game Logic //
////////////////

function RestartGame() {
    RefreshGame();
    GoToSelectionScreen();
}

function LetterClick(e) {
    let letter = e.target.innerHTML;
    if (letter.length > 1) {
        return;
    }
    if (e.target.classList.contains("used")) {
        return;
    }
    if (remainingGuesses < 1) {
        return;
    }
    e.target.classList.add("used");
    if (hiddenWord.toLowerCase().includes(letter.toLowerCase())) {
        UpdateGuess(letter.toLowerCase());
        e.target.classList.add("correct");
    } else {
        HandleIncorrect();
        e.target.classList.add("incorrect");
    }
    UpdatePlayerWordValue();
    if (CheckWin()) {
        SetResultPopOver("win");
        GoToResultScreen();
    }
    if (CheckLose()) {
        SetResultPopOver("lose");
        GoToResultScreen();
    }
}

function CheckWin() {
    return hiddenWord === userWord;
}

function CheckLose() {
    return remainingGuesses <= 0;
}
function UpdateGuess(letter) {
    let rString = "";
    for (let i = 0; i < hiddenWord.length; i++) {
        if (hiddenWord[i] === letter) {
            rString += letter;
        } else {
            rString += userWord[i];
        }
    }
    userWord = rString;
}
function HandleIncorrect() {
    if (remainingGuesses === 6) {
        DrawHead();
    } else if (remainingGuesses === 5) {
        DrawBody();
    } else if (remainingGuesses === 4) {
        DrawLeftArm();
    } else if (remainingGuesses === 3) {
        DrawRightArm();
    } else if (remainingGuesses === 2) {
        DrawLeftLeg();
    } else if (remainingGuesses === 1) {
        DrawRightLeg();
    }
    remainingGuesses--;
    UpdateGuessCounter();
}

//////////////////////
// Helper Functions //
//////////////////////

function SetRandomWord() {
    let chosenCategory = document.querySelector("#category-selector").value;
    let vocab = jsonData.vocabularies;
    for (let i = 0; i < vocab.length; i++) {
        if (vocab[i].categoryName === chosenCategory) {
            let randomIndex = GetRandomIndexInRange(vocab[i].words.length);
            hiddenWord = vocab[i].words[randomIndex];
        }
    }
}

function GetRandomIndexInRange(max) {
    let randomIndex = Math.floor(Math.random() * max);
    return randomIndex;
}

function RefreshGame() {
    // Clear HTML classes
    let dirtyLetters = document.querySelectorAll(".used");
    for (let i = 0; i < dirtyLetters.length; i++) {
        currentLetter = dirtyLetters[i];
        currentLetter.classList.remove("used");
        currentLetter.classList.remove("correct");
        currentLetter.classList.remove("incorrect");
    }
    // Refresh states
    remainingGuesses = guessAmount;
    SetRandomWord();
    userWord = GetCensoredWord(hiddenWord.length);

    // Update UI
    RefreshCanvas();
    UpdatePlayerWordValue();
    UpdateGuessCounter();
}

function GetCensoredWord(length) {
    let rString = "";
    for (let i = 0; i < length; i++) {
        rString += " ";
    }
    return rString;
}

//////////////////////
// DOM Manipulation //
//////////////////////

function SetDropDownValues(html) {
    let categorySelectorRef = document.querySelector("#category-selector");
    categorySelectorRef.innerHTML = html;
}
function SetResultPopOver(result) {
    let resultPopOver = document.querySelector("#result-message-container");
    resultPopOver.innerHTML = CreateResultHTML(result);
}
function UpdateGuessCounter() {
    counter = document.querySelector("#result-message-container");
    counter.innerHTML = CreateInProgressResultHTML();
}
function UpdatePlayerWordValue() {
    let letterSpans = document.querySelector("#found-container");
    letterSpans.innerHTML = CreatePlayerWordHTML();
}

///////////////////
// HTML Creation //
///////////////////

function CreatePlayerWordHTML() {
    let html = "";
    for (let i = 0; i < userWord.length; i++) {
        if (userWord[i] !== " ") {
            html += "<span class='found-letter'>";
        } else {
            html += "<span class='found-letter'>";
        }
        html += userWord[i].toUpperCase();
        html += "</span>";
    }
    return html;
}

function CreateCounterHTML() {
    return `Guesses Remaining: ${remainingGuesses}`;
}
function CreateInProgressResultHTML(result) {
    let html = "";
    let selectedCategory = document.querySelector("#category-selector").value;
    html += `<p class='what-word'>Category: ${selectedCategory}</p>`;
    html += `<h2 class='what-word'>Guesses Remaining: ${remainingGuesses}<h2>`;
    return html;
}
function CreateResultHTML(result) {
    let html = "";
    html += `<p class='what-word'>The word was: ${hiddenWord}</p>`;
    if (result === "lose") {
        html += "<h2 class='incorrect-text'>Sorry, you lose!<h2>";
    } else {
        html += "<h2 class='correct-text'>Congratulations, you win!</h2>";
    }
    return html;
}
function CreateDropDownHTML() {
    let html = "";
    let vocab = jsonData.vocabularies;
    for (let i = 0; i < vocab.length; i++) {
        html += `<option value='${vocab[i].categoryName}'>${vocab[i].categoryName}</option>`;
    }
    return html;
}
