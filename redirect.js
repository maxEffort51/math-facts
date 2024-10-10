import { getUsers } from './helper.js';

var Users = getUsers();

var redirectUser = (page) => {
  if (typeof page === "undefined") { page = ""; } else { page = `${page}.html`; };
  var redirect = window.location.origin + window.location.pathname.slice(0, window.location.pathname.lastIndexOf('/'));
  window.location.replace(`${redirect}/${page}`);
}

var isLoggedIn = (onlyTeacher, restricted) => {
  var usernames = document.cookie.split('; ').map(value => value.substring(0, value.indexOf("=")));
  var values = document.cookie.split('; ').map(value => value.substring(value.indexOf("=") + 1));
  var loggedin = usernames.indexOf(Users._loggedin) !== -1 && Users._loggedin !== "";
  if (onlyTeacher) loggedin = loggedin && values[usernames.indexOf(Users._loggedin)] !== "teacher";
  if (restricted) loggedin = loggedin && Users._restricted;
  return loggedin;
}

var notLoggedIn = (restricted) => {
  var usernames = document.cookie.split('; ').map(value => value.substring(0, value.indexOf("=")));
  var loggedin = usernames.indexOf(Users._loggedin) !== -1 && Users._loggedin !== "";
  if (restricted) return !loggedin && Users._restricted;
  return !loggedin;
}

var page = window.location.pathname.split('/').pop().split('.').shift();

if (page === "flashcards") {
  var flashcardSession = JSON.parse(localStorage.getItem("FlashcardSession"));

  if (!(typeof flashcardSession.valid === "string" && flashcardSession.valid === "Activity")) {
    redirectUser();
  } else {
    flashcardSession.valid = "Report";
    localStorage.setItem('FlashcardSession', JSON.stringify(flashcardSession));
  }
} else if (page === "users") {
  if (isLoggedIn(true, true)) {
    redirectUser("account");
  } else if (notLoggedIn(true)) {
    Users._loggedin = "";
    redirectUser("login");
  }
} else if (page === "login") {
  if (isLoggedIn()) redirectUser("account");
} else if (page === "account") {
  if (notLoggedIn()) redirectUser("login");
}

export { redirectUser };