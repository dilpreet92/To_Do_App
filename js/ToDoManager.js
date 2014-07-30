function ToDoApp (elements) {
  this.addToDoContainer = elements.addToDoContainer;
  this.toDoListElement = elements.toDoListElement;
  this.usersListElement = elements.usersListElement;
  this.createUserButton = elements.createUserButton;
  this.userAddSection = elements.userAddSection;
  this.createToDoButton = elements.createToDoButton;
  this.nameInputElement = elements.nameInputElement
  this.addNameButton = elements.addNameButton;
  this.toDoInputElement = elements.toDoInputElement;
  this.saveToDoButton = elements.saveToDoButton;
  this.dropDownListElement = elements.dropDownListElement;
  this.users = [];
}

ToDoApp.prototype.init = function() {
  this.addToDoContainer.css("visibility", "hidden");
  this.userAddSection.css("visibility", "hidden");
  this.bindEvents();
};

ToDoApp.prototype.addUserName = function(currentUserName) {
  var userObj = new User(currentUserName);
  this.users.push(userObj);
  this.addToUsersList(userObj);
  this.addToDropDownList(userObj); 
};

ToDoApp.prototype.addToDropDownList = function(currentUserObject) {
  var currentOption = $("<option/>").text(currentUserObject.name);
  this.dropDownListElement.append(currentOption);
};

ToDoApp.prototype.addToUsersList = function(currentUserObject) {
  var currentListItem = $("<li/>").data("dataitem", currentUserObject.name);
  currentListItem.text(currentUserObject.name);
  var counterTrack = $("<span/>").text("("+currentUserObject.toDos.length+")").insertAfter(currentListItem);
  this.usersListElement.append(currentListItem, counterTrack);
};

ToDoApp.prototype.addToDo = function() {
  var toDoObj = new ToDoList(this.toDoInputElement.val(), this.dropDownListElement[0].value); 
  this.addToDoList(toDoObj);
  this.updateUserToDo(toDoObj, "+");
};

ToDoApp.prototype.updateUserToDo = function(currentToDoObject, arithmeticOperation) {
  var index = 0;
  for(var i = 0; i < this.users.length; i++) {
    if(this.users[i].name == currentToDoObject.user) {
      index = i;
      break;
    }
  }
  if(arithmeticOperation == "+") {
    this.users[index].toDos.push(currentToDoObject.description);
  } 
  else {
    this.users[index].toDos.splice(this.users[index].toDos.indexOf(currentToDoObject.description), 1);
  }
  this.updateCounter(this.users[index]);
};

ToDoApp.prototype.addToDoList = function(currentToDoObject) {
  var currentListItem = $("<li/>"),
      checkboxElement = $("<input/>").attr("type", "checkbox").addClass("checkbox");
  currentListItem.append(checkboxElement);
  currentListItem.append($("<span/>").text(currentToDoObject.description + " assigned by " + currentToDoObject.user));
  checkboxElement.data("user", currentToDoObject);  
  this.toDoListElement.append(currentListItem);
};

ToDoApp.prototype.updateCounter = function(currentUserObject) {
  $.each(this.usersListElement.find("li"), function(index,element) {
    if($(this).text() == currentUserObject.name) {
      var currentCounterElement = $(this).next("span");
      currentCounterElement.text("("+currentUserObject.toDos.length+")");
    }
  });
};

ToDoApp.prototype.markText = function(currentCheckBoxElement) {
  var textElement = currentCheckBoxElement.next("span");
      toDoObject = currentCheckBoxElement.data("user");
  if(currentCheckBoxElement.context.checked) {
    textElement.addClass("lineThrough");
    this.updateUserToDo(toDoObject, "-");
  }
  else {
    textElement.removeClass();
    this.updateUserToDo(toDoObject, "+");
  }
};

ToDoApp.prototype.checkUniqueName = function(nameInputElement) {
  var returnValue = true,
      _this = this;
  if (!nameInputElement) {
    alert("Please Enter Name");
    returnValue = false;
  }
  else {
    $.each(this.usersListElement.find("li") , function() {
      if($(this).text() == nameInputElement) {
        alert("Please Enter Unique Name");
        returnValue = false;
      }
      else {
        returnValue = true;
      }
    });
  }
  return returnValue;
};

ToDoApp.prototype.bindEvents = function() {
  var _this = this;
  this.createUserButton.on("click",function() {
    _this.userAddSection.css("visibility", "visible");
    _this.createToDoButton.prop("disabled", true);
  });

  this.addNameButton.on("click", function() {
    if(_this.checkUniqueName(_this.nameInputElement.val())) {
      _this.addUserName(_this.nameInputElement.val());
      _this.userAddSection.css("visibility", "hidden");
      _this.createToDoButton.prop("disabled", false);
      _this.nameInputElement.val("");
    }
  });

  this.createToDoButton.on("click", function() {
    if(_this.users.length) {
      _this.addToDoContainer.css("visibility", "visible");
      _this.createUserButton.prop("disabled", true);
    }
    else {
      alert("Please Add Users First");
    }  
  });

  this.saveToDoButton.on("click",function() {
    if(_this.toDoInputElement.val()) {
      _this.addToDo();
      _this.addToDoContainer.css("visibility", "hidden");
      _this.createUserButton.prop("disabled", false); 
      _this.toDoInputElement.val(""); 
    }
    else {
      alert("Please Enter Something");
    }    
  });

  this.toDoListElement.on("click",".checkbox",function() {
    _this.markText($(this));
  });
};

$(document).ready(function() {
	var elements = {
    "addToDoContainer" : $("#leftUpper"),
    "toDoListElement"  : $("#toDoList"),
    "usersListElement" : $("#usersList"),
    "createUserButton" : $("#createUser"),
    "userAddSection"   : $("#userAddSection"),
    "createToDoButton" : $("#createToDoButtonId"),
    "addNameButton"    : $("#addName"),
    "saveToDoButton"   : $("#saveToDo"),
    "dropDownListElement" : $("#dropDownList"),
    "nameInputElement" : $("#nameInputId"),
    "toDoInputElement" : $("#toDoItem")
   };
  var createToDoObj = new ToDoApp(elements);
  createToDoObj.init();
});