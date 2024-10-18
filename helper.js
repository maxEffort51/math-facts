/* ========== HELPER FUNCTIONS ========== */

import UserData from './UserData.json' with {type: 'json' };
import cookies from './Cookies.js';

// Generate a Users object
var generate = () => {
  var tempUsers = {
    _loggedin: "",
    _empty: true,
    _length: 0
  };
  localStorage.setItem("Users", JSON.stringify(tempUsers));
  return tempUsers;
}

// Get either an already existsing Users object or generate a new one
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
    if (key.slice(0, 1) !== "_" && name === Users[key]) {
      i = key;
      return true;
    }
  });
  return i;
}

var updateUserIndexes = (i) => {
  Users = JSON.parse(localStorage.getItem("Users"));
  Object.keys(Users).forEach(key => {
    if (!isNaN(parseInt(key)) && parseInt(key) > i) {
      Users[key - 1] = Users[key];
      if (typeof Users[key + 1] == "undefined") delete Users[key];
    }
  });
  localStorage.setItem("Users", JSON.stringify(Users));
}

// Username already exists
var repeatingUsername = (username, index) => {
  updateUsers();
  if (typeof index === "undefined") index = -1;
  var isAlready = false;
  Object.keys(Users).forEach(key => {
    if (key !== index && key.slice(0, 1) !== "_" && username === Users[key]) {
      isAlready = true;
      return;
    }
  });
  return isAlready;
}

// A function that helps with the process of creating rows for the table on the Users page
var createRow = (users, i, row) => {
  if (typeof row === "undefined") row = document.createElement("tr");
  if (typeof users === "string" && users === "new") {
    row.id = "last";
    row.innerHTML = `<td><button id="new-user" class="btn">+</button></td><td></td>`;
  } else {
    row.innerHTML = `<td><span>${users[i]}</span></td><td style="text-align: right"><button class="btn" id="edit">Edit</button><button class="btn btn-primary login">${users._loggedin === users[i] ? "Log Out" : "Log In"}</button><button class="btn" id="delete">X</button></td>`;
    row.id = i;
  }
  return row;
}

// A function to set the UserData for whoever is logged in, or for a generic guest user
var setUserData = (value) => {
  var location = "UserData";
  if (cookies.loggedIn(Users._loggedin)) {
    // The User is logged in, try to get UserData:_username-here_
    location = `UserData:${Users._loggedin}`;
  }
  localStorage.setItem(location, "");
  localStorage.setItem(location, JSON.stringify(value));
}

// A function to get the UserData of a certain user or the generic guest user, or to get the UserData of whoever is logged in
var getUserData = (user, loggingIn) => {
  Users = JSON.parse(localStorage.getItem("Users"));
  var location = "UserData";
  if (typeof user === "undefined") user = Users._loggedin;
  var logMaybe = (typeof loggingIn !== "undefined" && loggingIn) || typeof loggingIn === "undefined";
  if (Users._loggedin === user && logMaybe && user !== "") {
    // The User is logged in, try to get UserData:_username-here_
    location = `UserData:${user}`;
  }
  var local = JSON.parse(localStorage.getItem(location));
  if (Object.is(local, null)) {
    // Create a new empty UserData instance
    local = { ...UserData };
  }
  return local;
}

// A function rename a given user from the perspective of its associated UserData object
var renameUserData = (user, newUser) => {
  var data = getUserData(user);
  localStorage.removeItem(`UserData:${user}`);
  localStorage.setItem(`UserData:${newUser}`, JSON.stringify(data));
}

export { updateUserIndexes, findUsername, repeatingUsername, createRow, getUsers, getUserData, setUserData, renameUserData };