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
  locate: function (name) {
    var names = document.cookie.split('; ').map(value => value.substring(0, value.indexOf("=")));
    var i = -1;
    // Loops.for(names.length,(ind) => { ... }) - start?,stop,iterate?,callback
    for (var ind = 0; ind < names.length; ind++) {
      if (names[ind] === name) {
        i = ind;
      }
    }
    return {
      name: name,
      value: i,
      not: () => i === -1,
      cookies: this,
    };
  },
  get: function (name) {
    var cookies = document.cookie.split('; ');
    var names = cookies.map(value => value.substring(0, value.indexOf("=")));
    var l = this.locate(name);
    if (l.not()) return null;
    var i = l.value;
    var newCookie = { key: name };
    var cookieParts = cookies[i].trim().split(';');
    var partNames = cookieParts.map(value => value.substring(0, value.indexOf("=")));
    var partValues = cookieParts.map(value => value.substring(value.indexOf("=") + 1));
    for (var j = 0; j < cookieParts.length; j++) {
      if (partNames[j] === name) {
        newCookie["value"] = partValues[j];
      } else if (partNames[j] === "expires") {
        newCookie["expires"] = new Date(partValues[j]);
      } else if (typeof partValues[j] === "undefined") {
        newCookie[partNames[j]] = true;
      } else {
        newCookie[partNames[j]] = partValues[j];
      }
    }
    newCookie.cookies = this;
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