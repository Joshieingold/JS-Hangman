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
window.onload = function () {};

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
//////////////////////
// Helper Functions //
//////////////////////

function RefreshGame() {
    // Clear HTML classes
    let dirtyLetters = document.querySelectorAll("used");
    for (let i = 0; i < dirtyLetters.length; i++) {
        currentLetter = dirtyLetters[i];
        currentLetter.classList.remove("used");
        currentLetter.classList.remove("correct");
        currentLetter.classList.remove("incorrect");
    }

    // Refresh states
    remainingGuesses = guessAmount;
    hiddenWord = GetNewWord();
    userWord = GetCensoredWord(hiddenWord.length);

    // Refresh Canvas
    RefreshCanvas();
}
function RefreshCanvas() {
    // Clear
    const c = document.querySelector("#hangman-canvas");
    const ctx = c.getContext("2d");
    ctx.clearRect(0, 0, c.width, c.height);
    // Draw Gallow
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

function GetCensoredWord(length) {
    let rString = "";
    for (let i = 0; i < length; i++) {
        rString += "*";
    }
    return rString;
}

//////////////////////
// DOM Manipulation //
//////////////////////

function SetDropDownValues(html) {
    let categorySelectorRef = document.querySelector("#category-selector");
    selectorRef.innerHTML = html;
}

////////// ////////
// HTML Creation //
////////// ////////

function CreateDropDownHTML() {
    let html = "";
    let vocab = jsonData.vocabularies;
    for (let i = 0; i < vocab.length; i++) {
        html += `<option value='${vocab[i].categoryName}'>${vocab[i].categoryName}</option>`;
    }
    return html;
}
