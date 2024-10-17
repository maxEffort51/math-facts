import { updateUserIndexes, createRow, getUsers, renameUserData, repeatingUsername } from './helper.js';
import cookies from './Cookies.js';

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
  setup(row.querySelector('#delete'), deleteUser);
  setup(row.querySelector('.login'), loginUser);
}

var setupAdd = () => {
  var addEl = document.getElementById("add");
  setup(addEl, addUser);
}

var setupNew = () => {
  var newEl = document.getElementById("new-user");
  setup(newEl, newUser);
}

var authenticate = (username, index) => {
  if (username.trim() === "") {
    infoAlert.classList.remove("collapse");
    infoAlert.firstElementChild.innerText = "You didn't fill out the username!";
  } else if (repeatingUsername(username, index)) {
    infoAlert.classList.remove("collapse");
    infoAlert.firstElementChild.innerText = "Please choose a unique username.";
  } else if (username.length > 16) {
    infoAlert.classList.remove("collapse");
    infoAlert.firstElementChild.innerText = "Your username can't have more than 16 characters!";
  } else {
    if (!infoAlert.classList.contains("collapse")) {
      infoAlert.classList.add("collapse");
    }
    return false;
  }
  return true;
}

/* ------ DELETE USER ------ */

var deleteUser = (e) => {
  var row = e.target.parentElement.parentElement;
  var i = row.id;
  var username = row.firstElementChild.firstElementChild.innerText;
  if (Users._loggedin === username) {
    cookies.delete(username);
    Users._loggedin = "";
  }
  localStorage.removeItem(`UserData:${username}`); // clear user data
  delete Users[i]; // clear Users data
  row.remove();
  Users._length--;
  if (Users._length == 0) Users._empty = true;
  localStorage.setItem("Users", JSON.stringify(Users));
  updateUserIndexes(i);
  document.getElementById("user-list").innerHTML = "";
  loadTable();
  setupNew();
}

/* ------ SAVE USER ------ */

var saveUser = (e) => {
  var row = e.target.parentElement.parentElement;
  var i = row.id;
  var name = Users[i];
  var newName = row.firstElementChild.firstElementChild.value;
  if (authenticate(newName, i)) return;

  if (!(newName.trim() === name || newName.trim() === "")) {
    renameUserData(name, newName);
    if (Users._loggedin === name) {
      cookies.rename(name, newName);
      Users._loggedin = newName;
    }
  }
  Users[i] = newName;
  Users._empty = false;
  createRow(Users, i, row);
  localStorage.setItem("Users", JSON.stringify(Users));
  setupModify(row);
}

/* ------ EDIT USER ------ */

var editUser = (e) => {
  var row = e.target.parentElement.parentElement;
  var i = row.id;
  row.innerHTML = `<td><input type="text" id="username" value="${Users[i]}" autocomplete="username"></td><td style="text-align: right"><button class="btn" id="save">Save</button></td>`;
  setup(row.querySelector('#save'), saveUser);
}

/* ------ LOGIN USER ------ */

var loginUser = (e) => {
  var row = e.target.parentElement.parentElement;
  var i = row.id;
  var username = row.firstElementChild.firstElementChild.innerText;
  if (Users._loggedin === username && e.target.innerText === "Log Out") {
    // Log out
    Users._loggedin = "";
    localStorage.setItem("Users", JSON.stringify(Users));
    cookies.delete(username);
    e.target.innerText = "Log In";
  } else {
    Users._loggedin = username;
    localStorage.setItem("Users", JSON.stringify(Users));
    cookies.generateData(username, true).delete().create(username, "exists", 7);
    var loginBtns = document.getElementsByClassName("login");
    for (var i = 0; i < loginBtns.length; i++) {
      loginBtns[i].innerText = "Log In";
    }
    e.target.innerText = "Log Out";
  }
}

/* ------ ADD USER ------ */

var addUser = () => {
  var lastRow = document.getElementById("last");
  var username = lastRow.firstElementChild.firstElementChild.value;
  if (authenticate(username)) return;
  Users[Users._length++] = username;
  Users._empty = false;
  createRow(Users, Users._length - 1, lastRow);
  localStorage.setItem("Users", JSON.stringify(Users));
  var userList = document.getElementById("user-list");
  userList.appendChild(createRow("new"));
  setupModify(lastRow);
  setupNew();
}

/* ------ NEW USER ------ */

var newUser = () => {
  var lastRow = document.getElementById("last");
  lastRow.innerHTML = `<td><input type="text" id="username" autocomplete="username"></td><td style="text-align: right"><button class="btn" id="add">Add</button></td>`;
  setupAdd();
}

/* ------ LOAD TABLE ------ */

var loadTable = () => {
  Users = JSON.parse(localStorage.getItem("Users"));
  var userList = document.getElementById("user-list");
  if (!Users._empty) {
    for (var i = 0; i < Users._length; i++) {
      var row = createRow(Users, i);
      userList.appendChild(row);
      setupModify(row);
    }
  }
  userList.appendChild(createRow("new"));
  setupNew();
}

loadTable();

export { updateUserIndexes };