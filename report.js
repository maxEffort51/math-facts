
// When the page loads, check if the Results section of the Flashcard Session object is filled, and if isOutdated is false
//  if true: show the popup with all the relevant data, and change isOutdated to false

import UserData from './UserData.json' with { type: 'json' };

var userData = JSON.parse(localStorage.getItem('UserData'));

var flashcardSession = JSON.parse(localStorage.getItem("FlashcardSession"));

var timeString = (milliseconds) => {
  var secs = Math.floor((milliseconds / 1000) % 60);

  var min = (milliseconds / 1000) / 60;

  secs = (secs < 10 ? '0' + secs : secs);
  //console.log(secs);
  return Math.floor(min) + ':' + secs;
};

var secString = (milliseconds) => {
  var secs = Math.round(milliseconds / 10);
  return `${secs / 100}s`;
}

var updateGrid = () => {
  if (Object.is(userData, null)) { // stored UserData object doesn't exist
    userData = UserData;
  }
  // go through flashcardSession.problemSet.tested and set the states of userData
  var tested = flashcardSession.problemSet.tested;
  for (var i = 0; i < tested.length; i++) {
    var q = tested[i].q;

    // console.log(tested[i]);

    if (q.indexOf('+') !== -1) {
      userData.add[q] = tested[i].state;
    } else if (q.indexOf('-') !== -1) {
      userData.sub[q] = tested[i].state;
    } else if (q.indexOf('×') !== -1) {
      userData.mult[q] = tested[i].state;
    } else if (q.indexOf('÷') !== -1) {
      userData.div[q] = tested[i].state;
    }
  }

  // console.log(userData);

  localStorage.setItem("UserData", JSON.stringify(userData));
};

var tryShowPopup = () => {
  var results = flashcardSession.results;
  results.isOutdated = true;
  // console.log(typeof results.totalActivityTime !== "undefined");
  // console.log(flashcardSession.valid === "Report");
  if (typeof results.totalActivityTime !== "undefined" && flashcardSession.valid === "Report") {
    var popupEl = document.getElementById('stats-popup');
    //console.log(popupEl.querySelector('#avg-time'));
    popupEl.querySelector('#percentage').innerText = `${results.percentageProblemsCorrect}%`;
    popupEl.querySelector('#correct-total').getElementsByTagName('span')[0].innerText = `${results.totalProblemsCorrect}`;
    popupEl.querySelector('#correct-total').getElementsByTagName('span')[1].innerText = `${results.totalProblemsTested}`;
    popupEl.querySelector('#total-time').getElementsByTagName('span')[0].innerText = `${timeString(results.totalActivityTime)}`;
    popupEl.querySelector('#avg-time').getElementsByTagName('span')[0].innerText = `${secString(results.averageProblemTime)}`;
    var cats = popupEl.querySelector('#categories').getElementsByTagName('span');

    // display the selected categories
    var catNames = ["add", "sub", "mult", "div"];
    var sessionCats = flashcardSession.choices.categories;
    for (var i = 0; i < cats.length; i++) {
      if (sessionCats[catNames[i]]) cats[i].classList.add("checked");
    }

    var statsPopup = new bootstrap.Modal(popupEl, { backdrop: 'static' });
    statsPopup.show(); // Show modal on page load
  }
  updateGrid();
  flashcardSession.valid = "Debug";
  localStorage.setItem("FlashcardSession", JSON.stringify(flashcardSession));
  generateGrid('+');
  generateGrid('-');
  generateGrid('*');
  generateGrid('/');
};
tryShowPopup();