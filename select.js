var setRadio = (els) => {
  for (var i = 0; i < els.length; i++) {
    var input = document.getElementById(els[i].attributes.for.nodeValue);
    input.label = els[i];
    input.newlabels = els;
    input.onchange = (ev) => {
      for (var j = 0; j < ev.target.newlabels.length; j++) {
        ev.target.newlabels[j].parentElement.classList.remove("checked");
      }
      ev.target.label.parentElement.classList.add("checked");
    }
    //console.log(input.onchange);
  }
}

var allUnchecked = () => {
  var checkboxes = document.getElementsByName("checkboxes");
  for (var i = 0; i < checkboxes.length; i++) {
    //console.log(checkboxes[i].checked);
    if (checkboxes[i].checked) {
      return false;
    }
  }
  return true;
}

var setCheck = (els) => {
  for (var i = 0; i < els.length; i++) {
    var input = document.getElementById(els[i].attributes.for.nodeValue);
    input.label = els[i];
    input.newlabels = els;
    input.onchange = (ev) => {
      var i = ev.target;
      // console.log("change");
      // console.log(ev.target.checked);

      // if all inputs are not checked
      if (allUnchecked()) {
        i.checked = true;
        return;
      }
      i.checked ? i.label.parentElement.classList.add("checked") : i.label.parentElement.classList.remove("checked");
    }
    // console.log(input.onchange);
  }
}

setCheck(document.getElementById("categ").getElementsByClassName("select-btn"))
setRadio(document.getElementById("act-time").getElementsByClassName("select-btn"));
setRadio(document.getElementById("prob-time").getElementsByClassName("select-btn"));
setRadio(document.getElementById("voice").getElementsByClassName("select-btn"));

