import { getUserData, setUserData } from './helper.js';
import { generateGrid } from './grid.js';

var UserData = getUserData();

var flashcardSession = JSON.parse(localStorage.getItem("FlashcardSession"));

var timeString = (milliseconds) => {
  var secs = Math.floor((milliseconds / 1000) % 60);

  var min = (milliseconds / 1000) / 60;

  secs = (secs < 10 ? '0' + secs : secs);

  return Math.floor(min) + ':' + secs;
};

var secString = (milliseconds) => {
  var secs = Math.round(milliseconds / 10);
  return `${secs / 100}s`;
}

var updateGrid = () => {
  var tested = flashcardSession.problemSet.tested;
  for (var i = 0; i < tested.length; i++) {
    var q = tested[i].q;
    if (q.indexOf('+') !== -1) {
      UserData.add[q] = tested[i].state;
    } else if (q.indexOf('-') !== -1) {
      UserData.sub[q] = tested[i].state;
    } else if (q.indexOf('×') !== -1) {
      UserData.mult[q] = tested[i].state;
    } else if (q.indexOf('÷') !== -1) {
      UserData.div[q] = tested[i].state;
    }
  }
  setUserData(UserData);
};

var tryShowPopup = () => {
  if (!Object.is(flashcardSession, null)) {
    var results = flashcardSession.results;
    if (typeof results.totalActivityTime !== "undefined" && flashcardSession.valid === "Report" && !results.isOutdated) {
      var popupEl = document.getElementById('stats-popup');
      popupEl.querySelector('#percentage').innerText = `${results.percentageProblemsCorrect}%`;
      popupEl.querySelector('#correct-total').getElementsByTagName('span')[0].innerText = `${results.totalProblemsCorrect}`;
      popupEl.querySelector('#correct-total').getElementsByTagName('span')[1].innerText = `${results.totalProblemsTested}`;
      popupEl.querySelector('#total-time').getElementsByTagName('span')[0].innerText = `${timeString(results.totalActivityTime)}`;
      popupEl.querySelector('#avg-time').getElementsByTagName('span')[0].innerText = `${secString(results.averageProblemTime)}`;
      var cats = popupEl.querySelector('#categories').getElementsByTagName('span');

      var catNames = ["add", "sub", "mult", "div"];
      var sessionCats = flashcardSession.choices.categories;
      for (var i = 0; i < cats.length; i++) {
        if (sessionCats[catNames[i]]) cats[i].classList.add("checked");
      }

      var statsPopup = new bootstrap.Modal(popupEl, { backdrop: 'static' });
      statsPopup.show(); // Show modal on page load
      updateGrid();
    }
    var testedSetExists = typeof flashcardSession.problemSet !== "undefined" && typeof flashcardSession.problemSet.tested !== "undefined";
    var testedSetFilled = flashcardSession.problemSet.tested.length > 0;
    var noResults = typeof results.isOutdated === "undefined";
    if (testedSetExists && testedSetFilled && flashcardSession.valid === "Report" && noResults) updateGrid();
    results.isOutdated = true;
    flashcardSession.valid = "Debug";
    localStorage.setItem("FlashcardSession", JSON.stringify(flashcardSession));
  }
  // Loops.same(generateGrid,'+','-','*','/') -> same as below
  generateGrid('+');
  generateGrid('-');
  generateGrid('*');
  generateGrid('/');
};
tryShowPopup();