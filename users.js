// Prevent the form from submitting when an input submits
document.getElementsByTagName('form')[0].addEventListener("submit", (e) => { e.preventDefault(); });

/* ========== USERS OBJECT ========== */

// Generate or obtain a Users object
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
var Users = JSON.parse(localStorage.getItem("Users"));

if (Object.is(Users, null)) {
  Users = generate();
}

if ((Users._length === 1 || !Users._empty) && typeof Users[0] === "undefined") {
  Users._length = 0;
  Users._empty = true;
}

/* ========== POTENTIAL REDIRECT ========== */

var usernames = document.cookie.split('; ').map(value => value.substring(0, value.indexOf("=")));
var values = document.cookie.split('; ').map(value => value.substring(value.indexOf("=") + 1));

var loggedin = usernames.indexOf(Users._loggedin) !== -1 && Users._loggedin !== "";
if (loggedin && values[usernames.indexOf(Users._loggedin)] !== "teacher" && Users._restricted) {
  // redirect to User page
  var redirect = window.location.origin + window.location.pathname.slice(0, window.location.pathname.lastIndexOf('/'));
  window.location.href = `${redirect}/account.html`;
} else if (!loggedin && Users._restricted) {
  // redirect to login page
  Users.loggedin = "";
  var redirect = window.location.origin + window.location.pathname.slice(0, window.location.pathname.lastIndexOf('/'));
  window.location.href = `${redirect}/login.html`;
}

/* ========== AUTHENTICATION ========== */


var infoAlert = document.getElementById("process-info");

// Username already exists
var redundant = (username, index) => {
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

var authenticate = (username, password, index) => {
  if (username.trim() === "" || password.trim() === "") {
    infoAlert.classList.remove("collapse");
    infoAlert.firstElementChild.innerText = "You didn't fill out both of the required fields!";
    return true;
  } else if (password.length < 8) {
    infoAlert.classList.remove("collapse");
    infoAlert.firstElementChild.innerText = "Your password needs to be at least 8 characters long!";
    return true;
  } else if (typeof index === "number" && redundant(username, index)) {
    infoAlert.classList.remove("collapse");
    infoAlert.firstElementChild.innerText = "Please choose a unique username.";
    return true;
  } else {
    if (!infoAlert.classList.contains("collapse")) {
      infoAlert.classList.add("collapse");
    }
  }
  return false;
}

/* ========== PASSWORD MANAGEMENT ========== */

// Hash a password in certain ways to make it more secure
var secure = (password) => {
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

/* ========== TABLE MANAGEMENT ========== */

var setup = (el, todo) => {
  el.addEventListener("click", todo);
};

// Delete a row and User
var deleteUser = (e) => {
  var row = e.target.parentElement.parentElement;
  var i = row.id;
  // console.log(row);
  // console.log(i);
  // console.log(Users[i]);
  delete Users[i];
  // console.log(Users);
  row.remove();
  Users._length--;
  if (Users._length == 0) Users._empty = true;

  Object.keys(Users).forEach(key => {
    // update indexes
    if (!isNaN(parseInt(key)) && parseInt(key) > i) {
      Users[key - 1] = Users[key];
      Users[key] = undefined;
    }
  });
  document.getElementById("user-list").innerHTML = "";
  loadTable();

  localStorage.setItem("Users", JSON.stringify(Users));
  setupNew();
}

var saveUser = (e) => {
  var row = e.target.parentElement.parentElement;
  var i = row.id;
  var username = row.firstElementChild.firstElementChild.value;
  // console.log(username);
  var password = row.children[1].firstElementChild.value;
  // console.log(password);

  if (authenticate(username, password, i)) return;

  createRow(i, username, password, false, row);
  Users[i] = { name: username, key: secure(password), teacher: Users[i].teacher };
  Users._empty = false;
  localStorage.setItem("Users", JSON.stringify(Users));
  setupModify(row);
}

// Edit the contents of a user
var editUser = (e) => {
  var row = e.target.parentElement.parentElement;
  var i = row.id;
  row.innerHTML = `<td><input type="text" id="username" value="${Users[i].name}"></td><td><input type="password" id="password" autocomplete="new-password" value="${_getPassword(Users[i].key)}"></td><td><button class="btn" id="save">Save</button></td>`;
  setup(row.querySelector('#save'), saveUser);
}

var setupModify = (row) => {
  setup(row.querySelector('#edit'), editUser);
  setup(row.querySelector('#delete'), deleteUser);
}

// Create a new row or complete the row creation process
var createRow = (i, username, password, secure, row) => {
  if (typeof secure === "boolean" && secure) password = _getPassword(password);
  if (typeof row === "undefined") row = document.createElement("tr");
  if (typeof password === "undefined" && typeof username === "string" && username === "new") {
    row.id = "last";
    row.innerHTML = `<td><button id="new-user" class="btn">+</button></td><td></td><td></td>`;
  } else {
    row.innerHTML = `<td><span>${username}</span></td><td><span>${password}</span></td><td><button class="btn" id="edit">#</button><button class="btn" id="teacher">$</button><button class="btn" id="delete">X</button></td>`;
    row.id = i;
  }
  return row;
}

// Add a User to the table, including complete the row creation process
var addUser = () => {
  var lastRow = document.getElementById("last");
  var username = lastRow.firstElementChild.firstElementChild.value;
  // console.log(username);
  var password = lastRow.children[1].firstElementChild.value;
  // console.log(password);

  if (authenticate(username, password)) return;

  createRow(Users._length, username, password, false, lastRow);
  Users[Users._length++] = { name: username, key: secure(password), teacher: false };
  Users._empty = false;
  localStorage.setItem("Users", JSON.stringify(Users));
  var userList = document.getElementById("user-list");
  userList.appendChild(createRow(Users._length, "new"));
  setupModify(lastRow);
  setupNew();
}

// Add the Event Listener that checks when to call the addUser function
var setupAdd = () => {
  var addEl = document.getElementById("add");
  setup(addEl, addUser);
}

// Replace the + button row with inputs, and call setupAdd
var newUser = () => {
  var lastRow = document.getElementById("last");
  lastRow.innerHTML = `<td><input type="text" id="username"></td><td><input type="password" id="password" autocomplete="new-password"></td><td><button class="btn" id="add">Add</button></td>`;
  setupAdd();
}

// setup calling newUser
var setupNew = () => {
  var newEl = document.getElementById("new-user");
  setup(newEl, newUser);
}

// load the table with either values from the Users object, or with it empty
var loadTable = () => {
  var userList = document.getElementById("user-list");
  if (!Users._empty) {
    var username, password = "";
    for (var i = 0; i < Users._length; i++) {
      username = Users[i].name;
      password = Users[i].key;
      var row = createRow(i, username, password, true)
      userList.appendChild(row);
      setupModify(row);
    }
  }
  userList.appendChild(createRow(Users._length, "new"));
  setupNew();
}
loadTable();