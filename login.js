import { getUsers, findUsername, cookies, getPassword } from './helper.js';
import { redirectUser } from './redirect.js';

var infoAlert = document.getElementById("process-info");

var authenticateLogin = (name, key, i) => {
  var Users = getUsers();
  // if i = -1, the username doesn't exist
  // if key doesn't match up with Users[i].key, the user inserted the incorrect password
  if (i === -1) {
    infoAlert.classList.remove("collapse");
    infoAlert.firstElementChild.innerText = "The username you entered doesn't exist!";
    return false;
  } else if (key !== getPassword(`@59n&Ai4XGpzxTHg${Users[i].key}`)) {
    infoAlert.classList.remove("collapse");
    infoAlert.firstElementChild.innerText = "You entered the wrong password!";
    return false;
  } else {
    if (!infoAlert.classList.contains("collapse")) {
      infoAlert.classList.add("collapse");
    }
  }
  return true;
}


var checkLogin = (e) => {
  e.preventDefault();
  var username = document.getElementById("username").value;
  var password = document.getElementById("password").value;
  console.log(`User ${username} with ${password}?`);
  var i = findUsername(username);
  if (!authenticateLogin(username, password, i)) return;
  var Users = getUsers();
  if (!(Users[i].name === username && getPassword(`@59n&Ai4XGpzxTHg${Users[i].key}`) === password)) return;
  Users._loggedin = username;
  if (Object.is(cookies.get(username), null)) cookies.create(username, password, 7);
  redirectUser("index");
}

document.getElementById("login").addEventListener("click", checkLogin);