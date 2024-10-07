// Create or access a table of users in local storage
// 

var generate = () => {
  // generate the Users object and put it in local storage; return the result
  var tempUsers = {
    _empty: true
  };
  localStorage.setItem("Users",JSON.stringify(tempUsers));
  return tempUsers;
}

var newUserEl = document.getElementById("new-user");
var Users = JSON.parse(localStorage.getItem("Users"));

if (Object.is(Users, null)) {
  Users = generate();
}

var newUser = () => {
  // create a new user, and wait for the input to be filled
  
}