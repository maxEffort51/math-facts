
// send: 
// 1 create Flashcard Session object
// 1.5 if there's already a Flashcard Session object, delete it
// 2 update Choices subobject
// 3 store Flashcard Session object in local storage

import Session from './FlashcardSession.json' with { type: "json" }; // 1

var flashcardSession = structuredClone(Session);

document.getElementById("submit").onclick = () => {
  if (typeof localStorage.getItem("FlashcardSession") !== "undefined") localStorage.removeItem("FlashcardSession"); // 1.5

  //console.log(flashcardSession);

  flashcardSession = updatedSession(flashcardSession);

  flashcardSession.valid = "Activity";

  //console.log(flashcardSession);

  localStorage.setItem("FlashcardSession", JSON.stringify(flashcardSession)); // 3

  var redirect = window.location.origin + window.location.pathname.slice(0, window.location.pathname.lastIndexOf('/'));
  //console.log(redirect);
  window.location.href = `${redirect}/flashcards.html`;
}

var updatedSession = (session) => {
  var checked = document.getElementsByClassName("checked");
  for (var i = 0; i < checked.length; i++) {
    var value = checked[i].children[0].value;
    switch (value) {
      case "add":
        session.choices.categories.add = true; break;
      case "sub":
        session.choices.categories.sub = true; break;
      case "mult":
        session.choices.categories.mult = true; break;
      case "div":
        session.choices.categories.div = true; break;
      default:
        switch (value.substring(0, 2)) {
          case "at":
            session.choices.timeLimit = parseInt(value.substring(2));
          case "pt":
            session.choices.problemLimit = parseInt(value.substring(2));
          default:
            session.choices.voiceRepeat = parseInt(value);
        }
    }
  }
  return session;
}

/* Setting a Flashcard Session object in local storage:

localStorage.setItem("FlashcardSession",JSON.stringify(myObject));

*/

/* Getting a Flashcard Session object from local storage:

JSON.parse(localStorage.getItem("FlashcardSession"));

*/