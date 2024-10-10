// username
// old-pass
// password (new one)
// repeat-pass
// Save Changes: #save
// Log Out: #logout
// Delete Account: #delete

import { getUsers, getPassword, secure, findUsername, renameUserData } from './helper.js';
import { updateUserIndexes } from './userControl.js';
import cookies from './Cookies.js';

var Users = getUsers();

document.getElementById("username").value = Users._loggedin; // fill the Username input with the current username

var changeUsername = () => {
  // new username
  var newName = document.getElementById("username").value;
  if (newName.trim() === Users._loggedin || newName.trim() === "") return;
  var i = findUsername(Users._loggedin);
  Users[i].name = newName;
  cookies.rename(Users._loggedin, newName);
  renameUserData(Users._loggedin, newName);
  Users._loggedin = newName;
  localStorage.setItem("Users", JSON.stringify(Users));
};

var changePassword = () => {
  document.getElementById('old-pass').style.color = "#FFFFFF";
  document.getElementById('repeat-pass').style.color = "#FFFFFF";
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

var saveChanges = (e) => {
  e.preventDefault();
  changeUsername();
  changePassword();
}

var logOut = () => {
  cookies.delete(Users._loggedin);
  Users._loggedin = "";
  localStorage.setItem("Users", JSON.stringify(Users));
};

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