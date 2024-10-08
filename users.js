// Create or access a table of users in local storage
// 

var generate = () => {
  // generate the Users object and put it in local storage; return the result
  var tempUsers = {
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

var infoAlert = document.getElementById("process-info");

var secure = (password) => {
  // reverse the letters
  // make all lowercase letters capitalized and vice versa
  // make numbers from 0 to 9 map opposite: 9 -> 0, 8 -> 1, 7 -> 2, 6 -> 3, 5 -> 4, 4 -> 5, ...
  // generate a random number from 1 to 26 and use Caeser Cipher on the letters, then add the number in the 5th spot
  // "Vanilla364" -> "463allinaV" -> "463ALLINAv" -> "536ALLINAv" -> 3: "536D3OOLQDy"
  var newPassword = password;
  var shift = Math.abs(Math.ceil(Math.random() * 25));
  var shifted = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
  for (var i = 0; i < password.length; i++) {
    newPassword[i] = password[password.length - 1 - i];

    const char = newPassword.charAt(i);
    if (char === char.toUpperCase()) {
      newPassword[i] = shifted[(i + shift) % 26].toLowerCase();
    } else if (char === char.toLowerCase()) {
      newPassword[i] = shifted[(i + shift) % 26].toUpperCase();
    }
    if (char >= '0' && char <= '9') {
      var nums = [9, 8, 7, 6, 5, 4, 3, 2, 1, 0];
      newPassword[i] = nums[parseInt(char)];
    }
  }
  console.log(newPassword);
  return newPassword;
}

var createRow = (username, password, row) => {
  if (typeof row === "undefined") row = document.createElement("tr");
  if (typeof password === "undefined" && typeof username === "string" && username === "new") {
    row.id = "last";
    row.innerHTML = `<td><button id="new-user" class="btn">+</button></td><td></td><td></td>`;
  } else {
    row.innerHTML = `<td><span>${username}</span></td><td><span>${password}</span></td><td><button class="btn" id="edit">#</button><button class="btn" id="teacher">$</button><button class="btn" id="delete">X</button></td>`;
    row.id = "";
  }
  return row;
}

var addUser = () => {
  // get lastRow
  // turn inputs of lastRow into text
  // replace add button with: edit, teacher toggle, password toggle, and delete buttons
  // remove last id from lastRow
  // make a new row with last id, a copy of the row in the HTML
  // append the row to the end of the userList table
  var lastRow = document.getElementById("last");
  var username = lastRow.firstElementChild.firstElementChild.value;
  console.log(username);
  var password = lastRow.children[1].firstElementChild.value;
  console.log(password);
  if (username.trim() === "" || password.trim() === "") {
    infoAlert.classList.remove("collapse");
    return;
  } else {
    if (!infoAlert.classList.contains("collapse")) {
      infoAlert.classList.add("collapse");
    }
  }
  createRow(username, password, lastRow);
  Users[++Users._length] = { name: username, key: secure(password) };
  localStorage.setItem("Users", JSON.stringify(Users));
  var userList = document.getElementById("user-list");
  userList.appendChild(createRow("new"));
  setupNew();
}

var setupAdd = () => {
  var addEl = document.getElementById("add");
  addEl.addEventListener("click", addUser);
}

var newUser = () => {
  // create a new user, and wait for the input to be filled
  // create a new row behind plus button, and increase plus button index
  var lastRow = document.getElementById("last");
  lastRow.innerHTML = `<form>
  <td><input type="text" id="username"></td><td><input type="password" id="password"></td><td><button class="btn" id="add">Add</button></td>
  </form>`;
  setupAdd();
}

var setupNew = () => {
  var newUserEl = document.getElementById("new-user");
  newUserEl.addEventListener("click", newUser);
}
setupNew();

var loadList = () => {
  if (Users._empty) return;
  var userList = document.getElementById("user-list");
  var username, password = "";
  for (var i = 0; i < Users._length; i++) {
    username = Users[i].name;
    password = Users[i].key;
    userList.appendChild(createRow(username, password));
  }
  userList.appendChild(createRow("new"));
}
loadList();