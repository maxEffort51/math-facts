var changeGrid = (to, arrFrom, iFrom) => {
  ////console.log('changing to ' + to);
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

var generateGrid = (to) => {
  var userArr;
  var UserData = JSON.parse(localStorage.getItem('UserData'));

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
  //console.log(rows);

  //console.log(userArr);

  var rowLen = rows.length - 1;

  for (var i = 1; i <= rowLen; i++) {
    // first row, i = 1
    for (var j = 0; j < rowLen; j++) {
      // first row, first column (0 + 0), i = 1 & j = 0. Confusing.
      var p = rows[j + 1].querySelectorAll('td')[i - 1];
      //console.log(p);

      // console.log(i - 1);
      // console.log(j);
      //console.log((i - 1) * rowLen + j);
      //console.log(p);
      //console.log(userArr[(i - 1) * rowLen + j]);

      p.innerText = userArr[(i - 1) * rowLen + j][0];

      p.classList.add(userArr[(i - 1) * rowLen + j][1])

      //console.log(p);
    }
  }
};