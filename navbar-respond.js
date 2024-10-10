var _getUsers = () => {
  var users = JSON.parse(localStorage.getItem("Users"));
  if (Object.is(users, null)) {
    users = {
      _restricted: false,
      _loggedin: "",
      _empty: true,
      _length: 0
    };
  }
  if ((users._length === 1 || !users._empty) && typeof users[0] === "undefined") {
    users._length = 0;
    users._empty = true;
  }
  localStorage.setItem("Users", JSON.stringify(users));
  return users;
}
var Users;

var cookies = {
  loggedIn: (username) => {
    var names = document.cookie.split('; ').map(value => value.substring(0, value.indexOf("=")));
    var values = document.cookie.split('; ').map(value => value.substring(value.indexOf("=") + 1));
    var exists = false;
    var index = -1;
    for (var i = 0; i < names.length; i++) {
      if (names[i] === username) {
        exists = true;
        index = i;
      }
    }
    if (!exists) return;
    var value = values[index] === "teacher" || values[index] === "student";
    return exists && value;
  },
  get: (name) => {
    var cookies = document.cookie.split('; ');
    var names = cookies.map(value => value.substring(0, value.indexOf("=")));
    var exists = false;
    var i = -1;
    for (var ind = 0; ind < names.length; ind++) {
      if (names[ind] === name) {
        exists = true;
        i = ind;
      }
    }
    if (!exists) return null;
    var newCookie = { key: names[i] };
    var cookieParts = cookies[i].trim().split(';');
    var partNames = cookieParts.map(value => value.substring(0, value.indexOf("=")));
    var partValues = cookieParts.map(value => value.substring(value.indexOf("=") + 1));
    for (var i = 0; i < cookieParts.length; i++) {
      if (partNames[i] === names[i]) {
        newCookie["value"] = partValues[i];
      } else if (partNames[i] === "expires") {
        newCookie["expires"] = new Date(partValues[i]);
      } else if (typeof partValues[i] === "undefined") {
        newCookie[partNames[i]] = true;
      } else {
        newCookie[partNames[i]] = partValues[i];
      }
    }
    return newCookie;
  }
}

var navbarRespond = () => {
  Users = _getUsers();
  var usersItem = document.getElementsByClassName('nav-item')[2];
  var username = Users._loggedin;
  var href = "users";
  var text = "Users";
  if (username !== "" && cookies.loggedIn(username) && cookies.get(username).value !== "teacher") {
    if (Users._restricted) href = "account";
    text = username.substring(0, 1).toUpperCase() + username.substring(1);
  }
  if ((!cookies.loggedIn(username) || username === "") && Users._restricted) {
    href = "login";
    text = "Log In";
  }
  usersItem.innerHTML = `<a class="nav-link" href="${href}.html">${text}</a>`;
}
navbarRespond();

export { navbarRespond };