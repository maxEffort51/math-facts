import { getUsers } from './helper.js';

window.onpageshow = function (event) {
  if (event.persisted) {
    window.location.reload();
  }
};

var Users = getUsers();

var redirectUser = (page) => {
  if (typeof page === "undefined") { page = ""; } else { page = `${page}.html`; };
  var redirect = window.location.origin + window.location.pathname.slice(0, window.location.pathname.lastIndexOf('/'));
  window.location.replace(`${redirect}/${page}`);
}

// Quickly check if a user is logged in
var isLoggedIn = () => {
  var usernames = document.cookie.split('; ').map(value => value.substring(0, value.indexOf("=")));
  var loggedin = usernames.indexOf(Users._loggedin) !== -1 && Users._loggedin !== "";
  return loggedin;
}

var page = window.location.pathname.split('/').pop().split('.').shift();

switch (page) {
  case "flashcards":
    var flashcardSession = JSON.parse(localStorage.getItem("FlashcardSession"));
    if (!(typeof flashcardSession.valid === "string" && flashcardSession.valid === "Activity")) {
      redirectUser();
    } else {
      flashcardSession.valid = "Report";
      localStorage.setItem('FlashcardSession', JSON.stringify(flashcardSession));
    }
    break;
}

export { redirectUser };