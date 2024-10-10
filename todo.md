# TODO LIST

## ADD MULTIPLE USERS

- Add Account Page functionality
  - Make the user able to change their username, and modify all loose ends
  - Allow changing your password by entering the old and then the new twice
  - Log out & save changes button
  - Delete account button
- Clean up the Users Page table
  - When a username is changed, the details for logging in are also changed if needed
  - Images for the different modifier buttons
- Fix glitches and errors

## MAKE MY LIFE EASIER

- Put cookies object in its own file - DONE
  - Add expires(name), isSecure(name), value(name), and getAttr(name, attribute)
  - Add find({ secure: true, expires: new Date(), value: "3", ...}) -> returns the username
  - Add list() -> returns an array of all cookies, parsed in objects
- Make Loops helper object
  - same(func,params1,params2, ...) -> run the func each time, entering the parameters (if you enter an array of parameters, it would enter multiple)
  - repeat(callback, times) -> repeat a function a certain amount of times, inputting the index to the callback
  - for(start,stop,iterate,callback) -> you can return or iterate with this.return() and this.next()
  - through(object or array,callback,details) -> flexible for-in / for-of
  - until(variable: 'i', requirements "i = 3 or i < 3, & not i > 3", callback) -> requirements example means the same as: i <= 3 && !(i > 3)
  - create(funcName: "repeat",callback, ...parameters) -> generates a function out of the loop
- Make Storage helper object - with LocalStorage
  - set(name, value)
  - get(name) -> value
  - all() -> return a list of every element
  - exists(name),
  - equals(name,other),
  - isJson(name),
  - remove(name),
  - rename(name,newName),
  - contentsEqual(name,other),
  - item(name) -> returns StorageItem
  - if(name,"exists",callback) -> if(name,"exists & equals UserData",callback), it has to exist and be called UserData
- StorageItem - one item in Storage
  - set(value),
  - exists = true,
  - equals("UserData"),
  - contentsEqual("UserData"),
  - isJson(),
  - remove(),
  - if("equals UserData",callback),
  - renameAs(newName),
  - get(), -> returns the result
  - getName(), -> returns the name