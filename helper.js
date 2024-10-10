/* ========== HELPER FUNCTIONS ========== */

import UserData from './UserData.json' with {type: 'json' };
import cookies from './Cookies.js';

// Generate a Users object
var generate = () => {
  var tempUsers = {
    _restricted: false,
    _loggedin: "",
    _empty: true,
    _length: 0
  };
  localStorage.setItem("Users", JSON.stringify(tempUsers));
  return tempUsers;
}

var getUsers = () => {
  var users = JSON.parse(localStorage.getItem("Users"));
  if (Object.is(users, null)) {
    users = generate();
  }
  if ((users._length === 1 || !users._empty) && typeof users[0] === "undefined") {
    users._length = 0;
    users._empty = true;
  }
  localStorage.setItem("Users", JSON.stringify(users));
  return users;
}

var updateUsers = () => Users = JSON.parse(localStorage.getItem("Users"));

var Users = getUsers();

var findUsername = (name) => {
  Users = getUsers();
  var i = -1;
  Object.keys(Users).some(key => {
    if (key.slice(0, 1) !== "_" && name === Users[key].name) {
      i = key;
      return true;
    }
  });
  return i;
}

var updateUserIndexes = (i) => {
  Users = getUsers();
  Object.keys(Users).forEach(key => {
    if (!isNaN(parseInt(key)) && parseInt(key) > i) {
      Users[key - 1] = Users[key];
      Users[key] = undefined;
    }
  });
}

// Check if the Users page should be restricted, and updates it accordingly
var checkRestricted = () => {
  updateUsers();
  var otherTeachers = false;
  Object.keys(Users).forEach(key => {
    if (key.substring(0, 1) !== "_" && Users[key].teacher) { otherTeachers = true; return; }
  })
  if (!otherTeachers) Users._restricted = false;
  localStorage.setItem("Users", JSON.stringify(Users));
}

// Username already exists
var repeatingUsername = (username, index) => {
  updateUsers();
  if (typeof index === "undefined") index = -1;
  var isAlready = false;
  Object.keys(Users).forEach(key => {
    if (key !== index && key.slice(0, 1) !== "_" && username === Users[key].name) {
      isAlready = true;
      return;
    }
  });
  return isAlready;
}

// Hash a password in certain ways to make it more secure
var _secure = (password) => {
  // "Vanilla364" -> "463allinaV" -> "463ALLINAv" -> "536ALLINAv" -> 3: "536D3.OOLQDy"
  var newPassword = "";
  var shift = Math.abs(Math.ceil(Math.random() * 25));
  var shifted = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
  var nums = [9, 8, 7, 6, 5, 4, 3, 2, 1, 0];
  for (var i = 0; i < password.length; i++) {
    const char = password[password.length - 1 - i];
    if (char >= '0' && char <= '9') {
      newPassword += nums[parseInt(char)];
    } else if (char >= 'A' && char <= 'Z') {
      newPassword += shifted[(shifted.indexOf(char.toLowerCase()) + shift) % 26].toLowerCase();
    } else if (char >= 'a' && char <= 'z') {
      newPassword += shifted[(shifted.indexOf(char) + shift) % 26].toUpperCase();
    } else {
      newPassword += char;
    }
  }
  newPassword = newPassword.slice(0, 5) + `${shift}.` + newPassword.slice(5);
  return newPassword;
}

// Reverse the secure function above, taking a hashed password and getting the true password
var _getPassword = (key) => {
  // "536DO3.OLQDy" -> 3: "536ALLINAv" -> "463ALLINAv" -> "463allinaV" -> "Vanilla364"
  var s = key.slice(5).indexOf('.') + 5;
  var shift = parseInt(key.slice(5, s));
  var shifted = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
  var nums = [9, 8, 7, 6, 5, 4, 3, 2, 1, 0];
  key = key.slice(0, 5) + key.slice(s + 1);
  console.log(`Shift: ${shift}, Key: ${key}`);
  var password = "";
  for (var i = 0; i < key.length; i++) {
    const char = key[key.length - 1 - i]; // reversed again
    if (char >= '0' && char <= '9') {
      password += nums[parseInt(char)];
    } else if (char >= 'A' && char <= 'Z') {
      password += shifted[(shifted.indexOf(char.toLowerCase()) - shift + 26) % 26].toLowerCase();
    } else if (char >= 'a' && char <= 'z') {
      password += shifted[(shifted.indexOf(char) - shift + 26) % 26].toUpperCase();
    } else {
      password += char;
    }
  }
  console.log(`Password: ${password}`);
  return password;
}

var getPassword = (key) => {
  var auth_code = key.substring(0, 16);
  if (auth_code === "@59n&Ai4XGpzxTHg") {
    return _getPassword(key.substring(16));
  }
}

var secure = (key) => {
  var auth_code = key.substring(0, 16);
  if (auth_code === "@59n&Ai4XGpzxTHg") {
    return _secure(key.substring(16));
  }
}

// Create a new row or complete the row creation process
var createRow = (auth, users, i, secure, row) => {
  var password;
  if (typeof row === "undefined") row = document.createElement("tr");
  if (typeof users === "string" && users === "new") {
    row.id = "last";
    row.innerHTML = `<td><button id="new-user" class="btn">+</button></td><td></td><td></td>`;
  } else {
    password = users[i].key;
    if (typeof secure === "boolean" && secure) password = getPassword(`${auth}${password}`);
    row.innerHTML = `<td><span>${users[i].name}</span></td><td><span>${password}</span></td><td><button class="btn" id="edit">#</button><button class="btn" id="teacher">${users[i].teacher ? "Teacher" : "Student"}</button><button class="btn" id="delete">X</button><button class="btn btn-primary login">${users._loggedin === users[i].name ? "User" : "Log In"}</button></td>`;
    row.id = i;
  }
  return row;
}

var userLoggedIn = (name) => Users._loggedin === name && cookies.loggedIn(name);

var setUserData = (value) => {
  var location = "UserData";
  if (userLoggedIn(Users._loggedin)) {
    // The User is logged in, try to get UserData:_username-here_
    location = `UserData:${Users._loggedin}`;
  }
  localStorage.setItem(location, "");
  localStorage.setItem(location, JSON.stringify(value));
}

var getUserData = (user, loggingIn) => {
  Users = JSON.parse(localStorage.getItem("Users"));
  var location = "UserData";
  if (typeof user === "undefined") user = Users._loggedin;
  var logMaybe = (typeof loggingIn !== "undefined" && loggingIn) || typeof loggingIn === "undefined";
  if (Users._loggedin === user && logMaybe) {
    // The User is logged in, try to get UserData:_username-here_
    location = `UserData:${user}`;
  }
  var local = JSON.parse(localStorage.getItem(location));
  if (Object.is(local, null)) {
    // nothing exists at that location, create a new empty UserData instance
    local = { ...UserData };
  }
  return local;
}

var renameUserData = (user, newUser) => {
  var data = getUserData(user);
  localStorage.removeItem(`UserData:${user}`);
  localStorage.setItem(`UserData:${newUser}`, JSON.stringify(data));
}

export { updateUserIndexes, checkRestricted, findUsername, repeatingUsername, getPassword, secure, createRow, getUsers, getUserData, setUserData, renameUserData };