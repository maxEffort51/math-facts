
// Set up the variables for generating the Problem Set
import Problems from './Problems.json' with { type: "json" };

var flashcardSession = JSON.parse(localStorage.getItem("FlashcardSession"));

var setProblemTime = () => {
  flashcardSession.timers.problemStartTimestamp = Date.now();

  if (flashcardSession.timers.problem) clearTimeout(flashcardSession.timers.problem);

  if (flashcardSession.choices.problemLimit !== -1) {
    flashcardSession.timers.problem = setTimeout(() => {
      // execute problem time end here...
      var contents = document.getElementById("input");
      contents.disabled = true;
      enterInput('time');
      // wrong("", contents);
    }, flashcardSession.choices.problemLimit);
  } else {
    flashcardSession.timers.problem = "none";
  }

  localStorage.setItem("FlashcardSession", JSON.stringify(flashcardSession));
};

var initiateTime = () => {
  var timeHandler = flashcardSession.timers;
  timeHandler.scheduleEnd = false;
  timeHandler.activityStartTimestamp = Date.now();
  if (flashcardSession.choices.timeLimit !== -1) {
    timeHandler.activity = setTimeout(() => {
      if (!timeHandler.soundPlaying) endActivity("timeout");
      timeHandler.scheduleEnd = true;
    }, flashcardSession.choices.timeLimit);
  }
  setProblemTime();
}
initiateTime();

// Update the flashcard
var updateFlashcard = (current) => {
  var n1 = document.getElementById("n1");
  var symbol = document.getElementById("sym");
  var n2 = document.getElementById("n2");
  var symbols = ["+", "-", "×", "÷"];

  for (var i = 0; i < symbols.length; i++) {
    if (current.indexOf(symbols[i]) !== -1) {
      symbol.innerText = symbols[i];
    }
  }
  n1.innerText = current.substring(0, current.indexOf(symbol.innerText))
  n2.innerText = current.substring(current.indexOf(symbol.innerText) + 1);

  localStorage.setItem("FlashcardSession", JSON.stringify(flashcardSession));
}

var moveToTested = (state) => {
  // make an object out of set.current, state, and problem time and put it in the tested array
  var set = flashcardSession.problemSet;
  var finishedQuestion = {
    q: set.current,
    state: state,
    time: Date.now() - flashcardSession.timers.problemStartTimestamp
  };
  set.tested.push(finishedQuestion);

  localStorage.setItem("FlashcardSession", JSON.stringify(flashcardSession));
};

var grabFromSet = () => {
  document.getElementById('input').disabled = false; // reset contents disabled
  document.getElementById('input').focus();

  var set = flashcardSession.problemSet;
  if (set.untested.length === 0) return;

  var randIndex = Math.ceil(Math.random() * set.untested.length - 1);
  // console.log(randIndex);
  set.current = set.untested[randIndex];
  // console.log(flashcardSession.problemSet);
  flashcardSession.problemSet.untested.splice(randIndex, 1);
  // console.log(flashcardSession.problemSet);

  updateFlashcard(set.current);
}

// Generate a Problem Set
var generate = () => {

  var set = [];
  Object.entries(flashcardSession.choices.categories).forEach((cat) => {
    // console.log(Problems[cat[0]]);
    // console.log(cat[0]);
    // console.log([...Problems[cat[0]]]);
    if (cat[1]) {
      var noTest = [];
      var toAdd = Problems[cat[0]];
      toAdd.forEach((p, i) => {
        if (Object.is(p.a, null)) noTest.push(i);
      });
      for (var i = noTest.length - 1; i >= 0; i--) {
        toAdd.splice(noTest[i], 1);
      }
      set.push(...toAdd.map(p => p.q));
    }
  })
  flashcardSession.problemSet = { untested: set, current: "", tested: [] };

  //console.log(flashcardSession.problemSet);

  grabFromSet();
};
generate();

var searchProblems = (key) => {
  if (key.indexOf("+") !== -1) { // add
    for (var i = 0; i < Problems.add.length; i++) {
      if (Problems.add[i].q === key) return Problems.add[i].a;
    }
  } else if (key.indexOf("-") !== -1) { // sub
    for (var i = 0; i < Problems.sub.length; i++) {
      if (Problems.sub[i].q === key) return Problems.sub[i].a;
    }
  } else if (key.indexOf("×") !== -1) { // mult
    for (var i = 0; i < Problems.mult.length; i++) {
      if (Problems.mult[i].q === key) return Problems.mult[i].a;
    }
  } else if (key.indexOf("÷") !== -1) { // div
    for (var i = 0; i < Problems.div.length; i++) {
      if (Problems.div[i].q === key) return Problems.div[i].a;
    }
  }
  return null;
};

// What to do when the user enters input
var enterInput = (type) => {
  flashcardSession = JSON.parse(localStorage.getItem("FlashcardSession"));

  var contents = document.getElementById("input");
  //console.log("input: " + contents.value);
  var set = flashcardSession.problemSet;
  var answer = searchProblems(set.current);
  // console.log(answer);
  // console.log(contents.value);
  //console.log(answer);
  contents.disabled = true;

  if (parseInt(contents.value) === answer) {
    // they got it right!
    right(contents);
  } else {
    var time = false;
    if (typeof type === "string" && type == "time") time = true;
    wrong(answer, contents, time);
  }
};

var right = (contents) => {
  // change text color
  // play ding sound and wait

  // console.log("hello, " + flashcardSession.timers.problem);

  if (!flashcardSession.timers.problem) return;

  //console.log(flashcardSession.timers.problem + " - after");


  if (flashcardSession.timers.problem !== "none") {
    clearTimeout(flashcardSession.timers.problem);
    flashcardSession.timers.problem = false;
  }
  contents.style.color = "#00f200";
  moveToTested("correct");
  var ding = new Audio('ding-sound.mp3');
  flashcardSession.timers.soundPlaying = true;
  var doNext = () => {
    flashcardSession.timers.soundPlaying = false;
    if (flashcardSession.timers.scheduleEnd) { endActivity("timeout"); return; }
    // reset text color, clear input, and reset everything else
    contents.style.color = "black";
    contents.value = "";
    grabFromSet();
    setProblemTime();
  };
  ding.play().catch(doNext);
  ding.onended = doNext;
};

var wrong = (answer, contents, time) => {

  if (!flashcardSession.timers.problem) return;

  //console.log(flashcardSession.timers.problem + " - after");


  if (flashcardSession.timers.problem !== "none") {
    clearTimeout(flashcardSession.timers.problem);
    flashcardSession.timers.problem = false;
  }

  if (typeof time !== "undefined" && time) {
    contents.style.borderColor = "#ff1800";
  } else { contents.style.color = "#ff1800"; }
  moveToTested("incorrect");

  var error = new Audio('error-sound.mp3');
  flashcardSession.timers.soundPlaying = true;
  var doNext = () => {
    if (flashcardSession.timers.scheduleEnd) { endActivity("timeout"); return; }

    contents.value = answer;
    contents.style.color = "black";
    contents.style.borderColor = "black";

    // Voiceover audio
    var voiceRepeat = flashcardSession.choices.voiceRepeat;

    var atVeryEnd = () => {
      flashcardSession.timers.soundPlaying = false;
      if (flashcardSession.timers.scheduleEnd) { endActivity("timeout"); return; }
      contents.value = "";
      grabFromSet();
      setProblemTime();
    }

    if (voiceRepeat == 0) {
      atVeryEnd();
      return;
    }
    answer = searchProblems(flashcardSession.problemSet.current);

    var correctionText = `${flashcardSession.problemSet.current} = ${answer}. `;

    var pauseTime = 100;

    var parameters = {
      onend: () => {
        if (voiceRepeat == 1) { atVeryEnd(); return; }
        setTimeout(() => {
          var param2 = {
            onend: () => {
              if (voiceRepeat == 2) { atVeryEnd(); return; }
              setTimeout(() => {
                var param2 = {
                  onend: atVeryEnd
                }
                responsiveVoice.speak(correctionText, "UK English Male", param2);
              }, pauseTime);
            }
          }
          responsiveVoice.speak(correctionText, "UK English Male", param2);
        }, pauseTime);
      }
    }
    responsiveVoice.speak(correctionText, "UK English Male", parameters);
  }
  error.play().catch(doNext);
  error.onended = doNext;
};

var endActivity = (way) => {
  // compile results object

  // if (way === "key") console.log("here");

  let tested = flashcardSession.problemSet.tested;
  let totalCorrect = 0;
  let totalTime = 0;
  for (var i = 0; i < tested.length; i++) {
    if (tested[i].state === "correct") {
      totalCorrect++;
      totalTime += tested[i].time;
    }
  }

  flashcardSession.results = {
    isOutdated: false,
    percentageProblemsCorrect: Math.round(totalCorrect / tested.length * 100),
    totalProblemsTested: tested.length,
    totalProblemsCorrect: totalCorrect,
    totalActivityTime: way === "timeout" ? flashcardSession.choices.timeLimit : Date.now() - flashcardSession.timers.activityStartTimestamp,
    averageProblemTime: Math.round(totalTime / totalCorrect)
  };

  // if (way === "key") console.log(tested);

  localStorage.setItem("FlashcardSession", JSON.stringify(flashcardSession));

  // leave the page
  var redirect = window.location.origin + window.location.pathname.slice(0, window.location.pathname.lastIndexOf('/'));
  window.location.href = `${redirect}/report.html`;
}

/* Audio guid in raw JavaScript:

mySound = new Audio(audioFile);
mySound.play();
mySound.onended = function() {
    // Whatever you want to do when the audio ends.
};

*/

export { grabFromSet, generate, enterInput, endActivity };