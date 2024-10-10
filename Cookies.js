import { getUserData } from './helper.js';

var Bake = function () { };

Bake.prototype.where = function (name) {
  var names = document.cookie.split('; ').map(value => value.substring(0, value.indexOf("=")));
  var i = -1;
  // Loops.for(names.length,(ind) => { ... }) - start?,stop,iterate?,callback
  for (var ind = 0; ind < names.length; ind++) {
    if (names[ind] === name) {
      i = ind;
    }
  }
  return i;
}
Bake.prototype.locate = function (name) {
  var names = document.cookie.split('; ').map(value => value.substring(0, value.indexOf("=")));
  var i = -1;
  // Loops.for(names.length,(ind) => { ... }) - start?,stop,iterate?,callback
  for (var ind = 0; ind < names.length; ind++) {
    if (names[ind] === name) {
      i = ind;
    }
  }
  return {
    name: name,
    value: i,
    not: () => i === -1,
    cookies: this,
  };
}
Bake.prototype.loggedIn = function (username) {
  var names = document.cookie.split('; ').map(value => value.substring(0, value.indexOf("=")));
  var values = document.cookie.split('; ').map(value => value.substring(value.indexOf("=") + 1));
  var l = this.locate(username);
  if (l.not()) return false;
  var i = l.value;
  return values[i] === "teacher" || values[i] === "student";
}
Bake.prototype.generateData = function (name,loggingIn) {
  var location = `UserData:${name}`;
  var newData = getUserData(name,loggingIn);
  if (!Object.is(localStorage.getItem("UserData"), null)) {
    localStorage.removeItem("UserData");
  }
  localStorage.setItem(location, JSON.stringify(newData));
  return this;
}
Bake.prototype.clear = function () {
  document.cookie.split(";").forEach(c => {
    var cNoSpace = c.replace(/^ +/, "");
    document.cookie = cNoSpace.replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
  });
  return this;
}
Bake.prototype.get = function (name) {
  var cookies = document.cookie.split('; ');
  var names = cookies.map(value => value.substring(0, value.indexOf("=")));
  var l = this.locate(name);
  if (l.not()) return null;
  var i = l.value;
  var newCookie = { key: names[i] };
  var cookieParts = cookies[i].trim().split(';');
  var partNames = cookieParts.map(value => value.substring(0, value.indexOf("=")));
  var partValues = cookieParts.map(value => value.substring(value.indexOf("=") + 1));
  for (var i = 0; i < cookieParts.length; i++) {
    if (partNames[i] === names[i]) {
      newCookie["value"] = partValues[i];
    } else if (partNames[i] === "expires") {
      newCookie["expires"] = new Date(partValues[i]);
    } else if (typeof partValues[i] === "undefined") {
      newCookie[partNames[i]] = true;
    } else {
      newCookie[partNames[i]] = partValues[i];
    }
  }
  newCookie.cookies = this;
  return newCookie;
}
Bake.prototype.string = function (obj) {
  // key, value, expires, etc.
  return `${obj.key}=${typeof obj.value !== "undefined" ? obj.value : ""}; expires=${typeof obj.expires !== "undefined" ? obj.expires : ""}; Secure`;
}
Bake.prototype.exists = function (name) {
  var names = document.cookie.split('; ').map(value => value.substring(0, value.indexOf("=")));
  var values = document.cookie.split('; ').map(value => value.substring(value.indexOf("=") + 1));
  for (var i = 0; i < names.length; i++) {
    if (names[i] === name) return true;
  }
  return false;
}
Bake.prototype.set = function (name, value) {
  document.cookie = `${name}=${value}`;
  return this;
}
Bake.prototype.create = function (name, value, daysExpire) {
  if (typeof expires === "undefined") {
    document.cookie = `${name}=${value}; Secure`;
  } else {
    var date;
    if (daysExpire instanceof Date && !isNaN(value.valueOf())) {
      date = daysExpire.toUTCString();
    } else {
      const days = new Date();
      days.setTime(sevenDays.getTime() + (daysExpire * 24 * 60 * 60 * 1000));
      date = days.toUTCString();
    }
    document.cookie = `${name}=${value}; expires=${date}; Secure`;
  }
  return this;
}
Bake.prototype.delete = function (name) {
  if (typeof name === "undefined") {
    localStorage.removeItem("UserData");
  } else {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC`;
  }
  return this;
}
Bake.prototype.if = function (bool, cookieFunc, ...parameters) {
  if (bool) this[cookieFunc](...parameters);
  return this;
}
Bake.prototype.rename = function (nOld, nNew) {
  var oldObj = this.get(nOld);
  this.delete(nOld);
  this.create(nNew, oldObj.value, oldObj.expire);
}

var cookies = new Bake();

export default cookies;