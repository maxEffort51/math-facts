// Get the function that handles entering input
import { enterInput, endActivity } from './handle-flashcards.js';

var flashcardSession;
var isKeyPress;

// Check if a letter or symbol is valid or invalid (for text input)
var invalidInput = (data) => {
  if (Object.is(data, null) || data == "") {
    return false;
  }

  var is = true;
  var valid = "0.1.2.3.4.5.6.7.8.9";
  valid.split(".").forEach(element => {
    if (data === element) {
      is = false;
      return;
    }
  });

  return is;
}

var checkInput = (e) => {
  var value = e.target.value;

  if (value.length > 3 || invalidInput(e.data)) {
    //console.log("cut");
    e.target.value = value.replace(e.data, "");
    var next = e.target.value.substring(e.target.value.length - 1);
    //console.log(next);
    if (invalidInput(next)) checkInput({ data: next, target: e.target, name: "copy" });
  }

  if ((value.substring(0, 1) === "0" && value.length > 1 && e.data !== " ") || parseInt(value) > 999) e.target.value = value.substring(value.length - 1);

  // The original checkInput function returns if e.data was " "
  //console.log(isKeyPress);
  if (e.data === " " && e.name !== "copy" && document.getElementById('input').value !== "" && !isKeyPress) {
    enterInput();
  }
  isKeyPress = false;
}

document.getElementById('input').addEventListener('keydown', () => {
  isKeyPress = true;
});
document.getElementById("input").oninput = checkInput;
document.getElementById("input").onpaste = (e) => { e.stopPropagation(); e.preventDefault(); console.log("AHA! Caught you redhanded!"); };

// Key press functionality (spacebar, escape, return)
document.addEventListener("keyup", (e) => {
  //console.log(`"${e.key}"`);

  if (e.key === " " || e.key === "Enter") {
    // enter the input
    var contents = document.getElementById('input');
    if (contents.disabled || contents.value == "") return;
    enterInput();
  } else if (e.key === "Escape" || e.key === "Esc") {
    endActivity("key");
  }
})