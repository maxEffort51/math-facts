import { getUserData } from './helper.js';

// Make the tabs in the Progress page work
var changeGrid = (to, arrFrom, iFrom) => {
  var all = document.getElementsByClassName('grid');
  for (var i = 0; i < all.length; i++) {
    if (all[i].id === to && !all[i].classList.contains('show')) {
      all[i].classList.add('show');
    } else if (all[i].id !== to) {
      all[i].classList.remove("show");
    }
    arrFrom[i].classList.remove('active');
  }
  arrFrom[iFrom].classList.add('active');
}

var a = document.getElementsByClassName('tab');
a[0].onclick = () => changeGrid('+', a, 0);
a[1].onclick = () => changeGrid('-', a, 1);
a[2].onclick = () => changeGrid('*', a, 2);
a[3].onclick = () => changeGrid('/', a, 3);

// Generate all items for a certain grid on the Progress page
var generateGrid = (to) => {
  var userArr;
  var UserData = getUserData();
  switch (to) {
    case "+":
      userArr = Object.entries(UserData.add);
      break;
    case "-":
      userArr = Object.entries(UserData.sub);
      break;
    case "*":
      userArr = Object.entries(UserData.mult);
      break;
    case "/":
      userArr = Object.entries(UserData.div);
      break;
    default:
      console.log('generateGrid was not inputted a valid id');
      return;
  }
  var grid = document.getElementById(to).querySelector('table');
  var rows = grid.querySelectorAll('tr');
  var rowLen = rows.length - 1;
  for (var i = 1; i <= rowLen; i++) {
    // first row, i = 1
    for (var j = 0; j < rowLen; j++) {
      // first row, first column (0 + 0), i = 1 & j = 0
      var p = rows[j + 1].querySelectorAll('td')[i - 1];
      p.innerText = userArr[(i - 1) * rowLen + j][0];
      p.classList.add(userArr[(i - 1) * rowLen + j][1])
    }
  }
};

export { generateGrid };