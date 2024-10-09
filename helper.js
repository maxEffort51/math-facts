/* ========== HELPER FUNCTIONS ========== */

import UserData from './UserData.json' with {type: 'json' };

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
  var i = -1;
  Object.keys(Users).some(key => {
    if (key.slice(0, 1) !== "_" && name === Users[key].name) {
      i = key;
      return true;
    }
  });
  return i;
}

// Check if the Users page should be restricted, and updates it accordingly
var checkRestricted = () => {
  updateUsers();
  var otherTeachers = false;
  Object.keys(Users).forEach(key => {
    if (key.substring(0, 1) !== "_" && Users[key].teacher) { otherTeachers = true; return; }
  })
  if (!otherTeachers) Users._restricted = false;
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
  console.log(users[i]);
  var password;
  if (typeof row === "undefined") row = document.createElement("tr");
  if (typeof users === "string" && users === "new") {
    row.id = "last";
    row.innerHTML = `<td><button id="new-user" class="btn">+</button></td><td></td><td></td>`;
  } else {
    password = users[i].key;
    if (typeof secure === "boolean" && secure) password = getPassword(`${auth}${password}`);
    row.innerHTML = `<td><span>${users[i].name}</span></td><td><span>${password}</span></td><td><button class="btn" id="edit">#</button><button class="btn" id="teacher">${users[i].teacher ? "Teacher" : "Student"}</button><button class="btn" id="delete">X</button><button class="btn btn-primary" id="login">${users._loggedin === users[i].name ? "User" : "Log In"}</button></td>`;
    row.id = i;
  }
  return row;
}

var c_loggedIn = (username) => {
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
}

var c_generateData = (name) => {
  var location = `UserData:${name}`;
  var newData = getUserData();
  if (existsInStorage("UserData")) {
    this.clearInLocalStorage("UserData");
  }
  localStorage.setItem(location, newData);
  return this;
}

var c_clear = () => {
  document.cookie.split(";").forEach(c => {
    var cNoSpace = c.replace(/^ +/, "");
    document.cookie = cNoSpace.replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
  });
  return this;
}

var c_get = (name) => {
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
  newCookie.cookies = this;
  return newCookie;
}

var c_exists = (name) => {
  var names = document.cookie.split('; ').map(value => value.substring(0, value.indexOf("=")));
  var values = document.cookie.split('; ').map(value => value.substring(value.indexOf("=") + 1));
  for (var i = 0; i < names.length; i++) {
    if (names[i] === name) return true;
  }
  return false;
}
var c_changeValue = (name, value) => {
  document.cookie = `${name}=${value}`;
  return this;
}

var c_create = (name, value, daysExpire) => {
  if (typeof expires === "undefined") {
    document.cookie = `${name}=${value}; Secure`;
  } else {
    const days = new Date();
    days.setTime(sevenDays.getTime() + (daysExpire * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${value}; expires=${days.toUTCString()}; Secure`;
  }
  return this;
}

var c_delete = (name) => {
  if (typeof name === "undefined") {
    localStorage.removeItem("UserData");
    return;
  }
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC`;
  localStorage.removeItem(`UserData:${name}`);
  return this;
}

var c_if = (bool, cookieFunc, ...parameters) => {
  if (bool) this[cookieFunc](...parameters);
  return this;
}

var bake = () => {
  // expires: name; returns expire value - c_attr("expires") returns this function
  // isSecure: name; returns whether it's secure - c_attr("secure") returns this function
  // value: name; returns the value - c_attr("value") returns this function
  // getAttr: name, attr; returns the value of the attribute - c_attr() returns this function
  // find: searchDetails; returns a list of names of the cookies that haves those attributes
  //   searchDetails -> { secure: true, expires: new Date(), value:"3", ... }
  // list: returns an array of all cookies, parsed as if you called the get() function
  var batter = {
    loggedIn: c_loggedIn,
    generateData: c_generateData,
    exists: c_exists,
    changeValue: c_changeValue,
    get: c_get,
    clear: c_clear,
    create: c_create,
    delete: c_delete,
    if: c_if
  }
  return batter;
}

var cookies = bake();

var userLoggedIn = (name) => {
  return Users._loggedin !== "" && cookies.loggedIn(Users._loggedin) ? Users._loggedin : false;
}

var getUserData = () => {
  var location = "UserData";
  if (userLoggedIn(Users._loggedin)) {
    // The User is logged in, try to get UserData:_username-here_
    location = `UserData:${Users._loggedin}`;
  }
  var local = JSON.parse(localStorage.getItem(location));
  if (Object.is(local, null)) {
    // nothing exists at that location, create a new empty UserData instance
    local = { ...UserData };
  }
  return local;
}

var setUserData = (value) => {
  var location = "UserData";
  if (userLoggedIn(Users._loggedin)) {
    // The User is logged in, try to get UserData:_username-here_
    location = `UserData:${Users._loggedin}`;
  }
  localStorage.setItem(location, JSON.stringify(value));
}

export { checkRestricted, findUsername, repeatingUsername, getPassword, secure, createRow, getUsers, getUserData, setUserData, cookies };