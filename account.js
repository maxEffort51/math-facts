import { navbarRespond } from './navbar-respond.js';
import { updateUserIndexes, getUsers, getPassword, secure, findUsername, renameUserData } from './helper.js';
import cookies from './Cookies.js';

var Users = getUsers();

// fill the Username input with the current username
document.getElementById("username").value = Users._loggedin;

// On the Account page, change the current username to the username inputted in the change username field
var changeUsername = () => {
  var newName = document.getElementById("username").value;
  if (newName.trim() === Users._loggedin || newName.trim() === "") return;
  var i = findUsername(Users._loggedin);
  Users[i].name = newName;
  cookies.rename(Users._loggedin, newName);
  renameUserData(Users._loggedin, newName);
  Users._loggedin = newName;
  navbarRespond();
  localStorage.setItem("Users", JSON.stringify(Users));
};

// Change the logged in user's password from the stuff on the account page
var changePassword = () => {
  document.getElementById('old-pass').style.color = "#000000";
  document.getElementById('repeat-pass').style.color = "#000000";
  var oldPassword = document.getElementById("old-pass").value;
  var i = findUsername(Users._loggedin);
  var current = getPassword(`@59n&Ai4XGpzxTHg${Users[i].key}`);
  if (oldPassword !== current) {
    document.getElementById('old-pass').style.color = "#FF0000";
    return;
  }
  var newPassword = document.getElementById("password").value;
  var repeat = document.getElementById("repeat-pass").value;
  if (newPassword !== repeat) {
    document.getElementById('repeat-pass').style.color = "#FF0000";
    return;
  }
  Users[i].key = secure(`@59n&Ai4XGpzxTHg${newPassword}`);
  localStorage.setItem("Users", JSON.stringify(Users));
};

// Completely update everything
var saveChanges = (e) => {
  e.preventDefault();
  changeUsername();
  changePassword();
}

// Log out the user
var logOut = () => {
  cookies.delete(Users._loggedin);
  Users._loggedin = "";
  localStorage.setItem("Users", JSON.stringify(Users));
};

// Delete the user everywhere
var deleteUser = () => {
  var i = findUsername(Users._loggedin);
  delete Users[i];
  updateUserIndexes(i);
  localStorage.removeItem(`UserData:${Users._loggedin}`);
  logOut();
};

document.getElementById("save").addEventListener("click", saveChanges);
document.getElementById("logout").addEventListener("click", logOut);
document.getElementById("delete").addEventListener("click", deleteUser);