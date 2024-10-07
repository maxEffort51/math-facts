// Create or access a table of users in local storage
// 

var generate = () => {
  // generate the Users object and put it in local storage; return the result
  var tempUsers = {
    _empty: true
  };
  localStorage.setItem("Users", JSON.stringify(tempUsers));
  return tempUsers;
}
var Users = JSON.parse(localStorage.getItem("Users"));

if (Object.is(Users, null)) {
  Users = generate();
}

var addUser = () => {
  // get lastRow
  // turn inputs of lastRow into text, with password hidden by default
  // replace add button with: edit, teacher toggle, password toggle, and delete buttons
  // remove last id from lastRow
  // make a new row with last id, a copy of the row in the HTML
  // append the row to the end of the userList table
}

var setupAdd = () => {
  var addEl = document.getElementById("add");
  addEl.addEventListener("click", addUser);
}

var newUser = () => {
  // create a new user, and wait for the input to be filled
  // create a new row behind plus button, and increase plus button index
  var lastRow = document.getElementById("last");
  lastRow.firstElementChild.innerHTML = `<input type="text" id="username">`;
  lastRow.children[1].innerHTML = `<input type="password" id="password">`;
  lastRow.lastElementChild.innerHTML = `<button class="btn" id="add">Add</button>`;
}

var setupNew = () => {
  var newUserEl = document.getElementById("new-user");
  newUserEl.addEventListener("click", newUser);
}
setupNew();