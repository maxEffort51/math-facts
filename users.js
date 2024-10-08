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
  // "Vanilla364" -> "463allinaV" -> "463ALLINAv" -> "536ALLINAv" -> 3: "536D3OOLQDy"
  var newPassword = "";
  var shift = Math.abs(Math.ceil(Math.random() * 25));
  var shifted = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
  var nums = [9, 8, 7, 6, 5, 4, 3, 2, 1, 0];
  // console.log(`Password ${password} shifted by ${shift}, length: ${password.length}`);
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
  newPassword = newPassword.slice(0, 5 % password.length) + `${shift}.` + newPassword.slice(5 % password.length);
  return newPassword;
}

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

var createRow = (username, password, secure, row) => {
  if (typeof secure === "boolean" && secure) password = _getPassword(password);
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
  createRow(username, password, false, lastRow);
  Users[Users._length++] = { name: username, key: secure(password) };
  Users._empty = false;
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
  lastRow.innerHTML = `<td><input type="text" id="username"></td><td><input type="password" id="password" autocomplete="new-password"></td><td><button class="btn" id="add">Add</button></td>`;
  setupAdd();
}

var setupNew = () => {
  var newUserEl = document.getElementById("new-user");
  newUserEl.addEventListener("click", newUser);
}

var loadTable = () => {
  var userList = document.getElementById("user-list");
  if (!Users._empty) {
    var username, password = "";
    for (var i = 0; i < Users._length; i++) {
      username = Users[i].name;
      password = Users[i].key;
      userList.appendChild(createRow(username, password, true));
    }
  }
  userList.appendChild(createRow("new"));
  setupNew();
}
loadTable();