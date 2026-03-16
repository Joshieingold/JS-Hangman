let wrongCounter = 0;
let secretWord;
let foundWord;
let jsonData;
window.onload = function () {
    RequestJsonData();
    ShowStartScreen();
};
function InsertCounter() {
    target = document.querySelector("#counter");
    target.innerHTML = `Guesses Remaining: ${6 - wrongCounter}`;
}
function ShowStartScreen() {
    document.querySelector("#start-container").classList.remove("hidden");
    document.querySelector("#result-container").classList.add("hidden");
    document.querySelector("#game-container").classList.add("hidden");
    document
        .querySelector("#start-button")
        .addEventListener("click", ShowStartGame);
}
function GetRandomWord() {
    let chosenCategory = document.querySelector("#category-selector").value;
    let vocabs = jsonData.vocabularies;
    for (let i = 0; i < vocabs.length; i++) {
        if (vocabs[i].categoryName === chosenCategory) {
            let randomIndex = GetRandomIndexInRange(vocabs[i].words.length);
            secretWord = vocabs[i].words[randomIndex];
        }
    }
}
function GetRandomIndexInRange(max) {
    let randomIndex = Math.floor(Math.random() * max);
    return randomIndex;
}
function ShowResultScreen() {
    document.querySelector("#start-container").classList.add("hidden");
    document.querySelector("#result-container").classList.remove("hidden");
    document.querySelector("#game-container").classList.remove("hidden");
    document
        .querySelector("#play-again-button")
        .addEventListener("click", RestartGame);
}
function RestartGame() {
    let allLetters = document.querySelectorAll(".used");
    for (let i = 0; i < allLetters.length; i++) {
        allLetters[i].classList.remove("used");
        allLetters[i].classList.remove("correct");
        allLetters[i].classList.remove("incorrect");
    }
    wrongCounter = 0;
    ShowStartScreen();
}
function ClearHangman() {
    const c = document.querySelector("#hangman-canvas");
    const ctx = c.getContext("2d");
    ctx.clearRect(0, 0, c.width, c.height);
}
function ShowStartGame(wordToUse) {
    document.querySelector("#start-container").classList.add("hidden");
    document.querySelector("#result-container").classList.add("hidden");
    document.querySelector("#game-container").classList.remove("hidden");
    GetRandomWord();
    ClearHangman();
    CreateGallows();
    foundWord = CreateBlankFoundWord();
    CreateFoundWordHTML();
    InsertCounter();
    let letterButtons = document.querySelector("#letter-buttons");
    letterButtons.addEventListener("click", LetterClick);
}

function CreateBlankFoundWord() {
    returnString = "";
    for (let i = 0; i < secretWord.length; i++) {
        returnString += "*";
    }
    return returnString;
}
function CreateFoundWordHTML() {
    let targetLocation = document.querySelector("#found-container");
    let html = "";
    for (let i = 0; i < foundWord.length; i++) {
        if (foundWord[i] !== "*") {
            html += "<span class='found-letter correct'>";
        } else {
            html += "<span class='found-letter'>";
        }
        html += foundWord[i];
        html += "</span>";
    }
    targetLocation.innerHTML = html;
}
function StartHangingHim() {
    if (wrongCounter === 0) {
        DrawHead();
        wrongCounter++;
    } else if (wrongCounter === 1) {
        DrawBody();
        wrongCounter++;
    } else if (wrongCounter === 2) {
        DrawLeftArm();
        wrongCounter++;
    } else if (wrongCounter === 3) {
        DrawRightArm();
        wrongCounter++;
    } else if (wrongCounter === 4) {
        DrawLeftLeg();
        wrongCounter++;
    } else if (wrongCounter === 5) {
        DrawRightLeg();
        wrongCounter++;
    }
    InsertCounter();
}
function LetterClick(e) {
    let letter = e.target.innerHTML;
    if (letter.length > 1) {
        return;
    }
    if (e.target.classList.contains("used")) {
        return;
    }
    e.target.classList.add("used");
    if (secretWord.toLowerCase().includes(letter.toLowerCase())) {
        CheckLetter(letter.toLowerCase());
        e.target.classList.add("correct");
    } else {
        StartHangingHim();
        e.target.classList.add("incorrect");
    }
    CreateFoundWordHTML();
    if (CheckWin()) {
        CreateWinHTML();
        ShowResultScreen();
    }
    if (CheckLoss()) {
        CreateLossHTML();
        ShowResultScreen();
    }
}
function CheckLoss() {
    if (wrongCounter >= 6) {
        return true;
    }
    return false;
}
function CreateLossHTML() {
    let targetRef = document.querySelector("#result-message-container");

    let html = "";
    html += "<h2 class='incorrect-text'>You lost!</h2>";
    html += `<p>The word was ${secretWord}</p>`;

    targetRef.innerHTML = html;
}
function CreateWinHTML() {
    let targetRef = document.querySelector("#result-message-container");
    let html = "";
    html += "<h2 class='correct-text'>You Win!!</h2>";
    html += `<p>The word was ${secretWord}</p>`;
    targetRef.innerHTML = html;
}
function CheckWin() {
    if (foundWord === secretWord) {
        return true;
    }
    return false;
}
function CheckLetter(letter) {
    let returnWord = foundWord;
    let newString = "";
    for (let i = 0; i < secretWord.length; i++) {
        if (secretWord[i] === letter) {
            newString += letter;
        } else {
            newString += returnWord[i];
        }
    }
    foundWord = newString;
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
    ctx.moveTo(350, 280);
    ctx.lineTo(320, 360);
    ctx.stroke();
}
function DrawRightArm() {
    let c = document.querySelector("#hangman-canvas");
    let ctx = c.getContext("2d");
    ctx.beginPath();
    ctx.moveTo(350, 280);
    ctx.lineTo(380, 360);
    ctx.stroke();
}
function DrawLeftLeg() {
    let c = document.querySelector("#hangman-canvas");
    let ctx = c.getContext("2d");
    ctx.beginPath();
    ctx.moveTo(350, 365);
    ctx.lineTo(330, 420);
    ctx.stroke();
}
function DrawRightLeg() {
    let c = document.querySelector("#hangman-canvas");
    let ctx = c.getContext("2d");
    ctx.beginPath();
    ctx.moveTo(350, 365);
    ctx.lineTo(370, 420);
    ctx.stroke();
}

function RequestJsonData() {
    let url = "./data/vocabularies.json";
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            data = JSON.parse(xhr.responseText);
            jsonData = data;
            CreateDropDown();
        }
    };
    xhr.open("GET", url, true);
    xhr.send();
}

function CreateGallows() {
    let c = document.querySelector("#hangman-canvas");
    let ctx = c.getContext("2d");
    ctx.beginPath();
    ctx.moveTo(100, 100);
    ctx.lineTo(350, 100);
    ctx.moveTo(350, 100);
    ctx.lineTo(350, 200);
    ctx.moveTo(100, 100);
    ctx.lineTo(100, 500);
    ctx.moveTo(100, 500);
    ctx.lineTo(20, 500);
    ctx.moveTo(100, 500);
    ctx.lineTo(180, 500);
    ctx.lineWidth = 3;
    ctx.stroke();
}

function CreateDropDown() {
    let selectorRef = document.querySelector("#category-selector");
    let html = "";
    let vocab = jsonData.vocabularies;
    for (let i = 0; i < vocab.length; i++) {
        html += `<option value='${vocab[i].categoryName}'>${vocab[i].categoryName}</option>`;
    }
    selectorRef.innerHTML = html;
}
