import { checkRestricted, getPassword, secure, createRow, getUsers, getUserData, cookies } from './helper.js';
import { redirectUser } from './redirect.js';

var Users = getUsers();

var infoAlert = document.getElementById("process-info");

// Prevent the form from submitting when an input submits
document.getElementsByTagName('form')[0].addEventListener("submit", (e) => { e.preventDefault(); });

/* ------ SETUP ------ */

var setup = (el, todo) => {
  el.addEventListener("click", todo);
};

var setupModify = (row) => {
  setup(row.querySelector('#edit'), editUser);
  setup(row.querySelector('#teacher'), teacherUser);
  setup(row.querySelector('#delete'), deleteUser);
  setup(row.querySelector('#login'), loginUser);
}

var setupAdd = () => {
  var addEl = document.getElementById("add");
  setup(addEl, addUser);
}

var setupNew = () => {
  var newEl = document.getElementById("new-user");
  setup(newEl, newUser);
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
  } else if (typeof index === "number" && repeatingUsername(username, index)) {
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

/* ------ DELETE USER ------ */

var deleteUser = (e) => {
  var row = e.target.parentElement.parentElement;
  var i = row.id;
  var username = row.firstElementChild.firstElementChild.value;
  if (Users._loggedin === username) {
    Users._loggedin = "";
    checkRestricted();
  }
  delete Users[i];
  row.remove();
  Users._length--;
  if (Users._length == 0) Users._empty = true;

  Object.keys(Users).forEach(key => {
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

/* ------ TOGGLE TEACHER ATTRIBUTE ------ */

var teacherUser = (e) => {
  var row = e.target.parentElement.parentElement;
  var i = row.id;
  if (Users[i].teacher) {
    Users[i].teacher = false;
    if (cookies.loggedIn(Users[i].name)) {
      cookies.changeValue(Users[i].name, "student");
    }
    checkRestricted();
    e.target.innerText = "Student";
    row.classList.remove('table-success');
  } else {
    Users[i].teacher = true;
    if (cookies.loggedIn(Users[i].name)) {
      cookies.changeValue(Users[i].name, "teacher");
    }
    Users._restricted = true;
    e.target.innerText = "Teacher";
    if (!row.classList.contains('table-success')) {
      row.classList.add('table-success');
    }
  }
  localStorage.setItem("Users", JSON.stringify(Users));
}

/* ------ SAVE USER ------ */

var saveUser = (e) => {
  var row = e.target.parentElement.parentElement;
  var i = row.id;
  var username = row.firstElementChild.firstElementChild.value;
  var password = row.children[1].firstElementChild.value;
  if (authenticate(username, password, i)) return;
  Users[i] = { name: username, key: secure(`@59n&Ai4XGpzxTHg${password}`), teacher: Users[i].teacher };
  Users._empty = false;
  createRow("@59n&Ai4XGpzxTHg", Users, i, false, row);
  localStorage.setItem("Users", JSON.stringify(Users));
  setupModify(row);
}

/* ------ EDIT USER ------ */

var editUser = (e) => {
  var row = e.target.parentElement.parentElement;
  var i = row.id;
  row.innerHTML = `<td><input type="text" id="username" value="${Users[i].name}" autocomplete="username"></td><td><input type="password" id="password" autocomplete="new-password" value="${getPassword(`@59n&Ai4XGpzxTHg${Users[i].key}`)}"></td><td><button class="btn" id="save">Save</button></td>`;
  setup(row.querySelector('#save'), saveUser);
}

/* ------ LOGIN USER ------ */

var loginUser = (e) => {
  var row = e.target.parentElement.parentElement;
  var i = row.id;
  var username = row.firstElementChild.firstElementChild.innerText;
  if (Users._loggedin === username && e.target.innerText === "User") {
    redirectUser("account");
  } else {
    cookies.generateData(username).delete().if(Users._loggedin !== "", "delete", Users._loggedin).create(username, Users[i].teacher ? "teacher" : "student", 7);
    Users._loggedin = username;
    localStorage.setItem("Users", JSON.stringify(Users));
    e.target.innerText = "User";
  }
}

/* ------ ADD USER ------ */

var addUser = () => {
  var lastRow = document.getElementById("last");
  var username = lastRow.firstElementChild.firstElementChild.value;
  var password = lastRow.children[1].firstElementChild.value;
  if (authenticate(username, password)) return;
  Users[Users._length++] = { name: username, key: secure(`@59n&Ai4XGpzxTHg${password}`), teacher: false };
  Users._empty = false;
  createRow("@59n&Ai4XGpzxTHg", Users, Users._length - 1, true, lastRow);
  localStorage.setItem("Users", JSON.stringify(Users));
  var userList = document.getElementById("user-list");
  userList.appendChild(createRow("@59n&Ai4XGpzxTHg", "new"));
  setupModify(lastRow);
  setupNew();
}

/* ------ NEW USER ------ */

var newUser = () => {
  var lastRow = document.getElementById("last");
  lastRow.innerHTML = `<td><input type="text" id="username" autocomplete="username"></td><td><input type="password" id="password" autocomplete="new-password"></td><td><button class="btn" id="add">Add</button></td>`;
  setupAdd();
}

/* ------ LOAD TABLE ------ */

var loadTable = () => {
  var userList = document.getElementById("user-list");
  if (!Users._empty) {
    var username, password = "";
    for (var i = 0; i < Users._length; i++) {
      username = Users[i].name;
      password = Users[i].key;
      var row = createRow("@59n&Ai4XGpzxTHg", Users, i, true);
      if (Users[i].teacher) row.classList.add('table-success');
      userList.appendChild(row);
      setupModify(row);
    }
  }
  userList.appendChild(createRow("@59n&Ai4XGpzxTHg", "new"));
  setupNew();
}

loadTable();