
// Set up the variables for generating the Problem Set
import Problems from './Problems.json' with { type: "json" };
import { getUserData } from './helper.js';

var flashcardSession = JSON.parse(localStorage.getItem("FlashcardSession"));

// Determine what to do when the user enters input
var enterInput = (type) => {
  flashcardSession = JSON.parse(localStorage.getItem("FlashcardSession"));
  var contents = document.getElementById("input");
  var set = flashcardSession.problemSet;
  var answer = searchProblems(set.current);
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

// Set the problem time loop
var setProblemTime = () => {
  flashcardSession.timers.problemStartTimestamp = Date.now();
  if (flashcardSession.timers.problem) clearTimeout(flashcardSession.timers.problem);
  if (flashcardSession.choices.problemLimit !== -1) {
    flashcardSession.timers.problem = setTimeout(() => {
      var contents = document.getElementById("input");
      contents.disabled = true;
      enterInput('time');
    }, flashcardSession.choices.problemLimit);
  } else {
    flashcardSession.timers.problem = "none";
  }
  localStorage.setItem("FlashcardSession", JSON.stringify(flashcardSession));
};

// Initiate the activity time and problem time
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
var updateFlashcard = (set) => {
  var current = set.current;
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

  flashcardSession.problemSet = set;
  localStorage.setItem("FlashcardSession", JSON.stringify(flashcardSession));
}

// Move a question to the tested array within the ProblemSet sub object
var moveToTested = (state) => {
  var set = flashcardSession.problemSet;
  var finishedQuestion = {
    q: set.current,
    state: state,
    time: Date.now() - flashcardSession.timers.problemStartTimestamp
  };
  set.tested.push(finishedQuestion);
  localStorage.setItem("FlashcardSession", JSON.stringify(flashcardSession));
};

var pullRandom = () => Math.abs(Math.ceil(Math.random() * flashcardSession.problemSet.untested.length - 1));

var getDataArray = (data, q) => {
  if (q.indexOf('+') !== -1) {
    return data.add;
  } else if (q.indexOf('-') !== -1) {
    return data.sub;
  } else if (q.indexOf('×') !== -1) {
    return data.mult;
  } else if (q.indexOf('÷') !== -1) {
    return data.div;
  }
}

var getData = (data, q) => {
  if (q.indexOf('+') !== -1) {
    return data.add[q];
  } else if (q.indexOf('-') !== -1) {
    return data.sub[q];
  } else if (q.indexOf('×') !== -1) {
    return data.mult[q];
  } else if (q.indexOf('÷') !== -1) {
    return data.div[q];
  }
}

// Get the index of a random problem; input the chance that a question that would've been already correct will try again to get a random index
var findRandom = (data, chance, i) => {
  if (typeof i === "undefined") i = 0;
  if (typeof chance === "undefined") chance = 0.5;
  var random = pullRandom();
  var untested = flashcardSession.problemSet.untested;
  if (i > 5) {
    // search the untested for a question that was gotten wrong or there's no data for
    for (var i = 0; i < untested.length; i++) {
      var value = getData(data, untested[i]);
      if (value === "incorrect" || value === "no-data") {
        return i;
      }
    }
    return pullRandom();
  };
  if (getData(data, flashcardSession.problemSet.untested[random]) === "correct") {
    var skip = Math.random();
    if (skip < chance) {
      return findRandom(data, chance, i + 1);
    }
  }
  return random;
}

var grabFromSet = () => {
  document.getElementById('input').disabled = false;
  document.getElementById('input').focus();
  var set = flashcardSession.problemSet;
  if (set.untested.length === 0) endActivity();
  var random = pullRandom();
  var data = getUserData();
  var random = findRandom(data, 0.7);
  set.current = set.untested[random];
  set.untested.splice(random, 1);
  updateFlashcard(set);
}

// Generate a Problem Set
var generate = () => {
  var set = [];
  Object.entries(flashcardSession.choices.categories).forEach((cat) => {
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

// The user got it right; this function controls what happens
var right = (contents) => {
  if (!flashcardSession.timers.problem) return;

  if (flashcardSession.timers.problem !== "none") {
    clearTimeout(flashcardSession.timers.problem);
    flashcardSession.timers.problem = false;
  }
  contents.style.color = "#00f200";
  moveToTested("correct");
  var ding = new Audio('ding-sound.mp3');
  flashcardSession.timers.soundPlaying = true;
  var next = () => {
    flashcardSession.timers.soundPlaying = false;
    if (flashcardSession.timers.scheduleEnd) { endActivity("timeout"); return; }
    // reset text color, clear input, and reset everything else
    contents.style.color = "black";
    contents.value = "";
    grabFromSet();
    setProblemTime();
  };
  ding.play().catch(next);
  ding.onended = next;
};

var speak = (text, voice, repeat, end, pause) => {
  if (typeof repeat === "undefined") repeat = 1;
  if (typeof voice === "undefined") voice = "UK English Male";
  if (typeof end === "undefined") end = () => { };
  if (typeof pause === "undefined") pause = 0;
  repeat = Math.abs(Math.round(repeat % 3));

  var speakOnce = (params) => responsiveVoice.speak(text, voice, params);

  speakOnce({
    onend: () => {
      if (repeat == 1) { end(); return } // Only speak once
      setTimeout(() => {
        speakOnce({
          onend: () => {
            if (repeat == 2) { end(); return; } // Only speak twice
            setTimeout(() => { speakOnce({ onend: end }); }, pause);
          }
        })
      }, pause);
    }
  });
}

// The user got it wrong; this function controls what happens
var wrong = (answer, contents, time) => {
  if (!flashcardSession.timers.problem) return;

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
  var next = () => {
    if (flashcardSession.timers.scheduleEnd) { endActivity("timeout"); return; }
    contents.value = answer;
    contents.style.color = "black";
    contents.style.borderColor = "black";

    // Voiceover audio
    var repeat = flashcardSession.choices.voiceRepeat;

    var end = () => {
      flashcardSession.timers.soundPlaying = false;
      if (flashcardSession.timers.scheduleEnd) { endActivity("timeout"); return; }
      contents.value = "";
      grabFromSet();
      setProblemTime();
    }
    if (repeat == 0) { end(); return; }
    answer = searchProblems(flashcardSession.problemSet.current);
    var text = `${flashcardSession.problemSet.current} = ${answer}.`;
    speak(text, "UK English Male", repeat, end, 100);
  }
  error.play().catch(next);
  error.onended = next;
};

var endActivity = (way) => {
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
  localStorage.setItem("FlashcardSession", JSON.stringify(flashcardSession));

  // leave the page
  var redirect = window.location.origin + window.location.pathname.slice(0, window.location.pathname.lastIndexOf('/'));
  window.location.href = `${redirect}/report.html`;
}

export { grabFromSet, generate, enterInput, endActivity };