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
}

ToDoApp.prototype.init = function() {
  this.addToDoContainer.css("visibility", "hidden");
  this.userAddSection.css("visibility", "hidden");
  this.bindEvents();
};

ToDoApp.prototype.addUserName = function(currentUserName) {
  var userObj = new User(currentUserName);
  this.addToUsersList(userObj);
  this.addToDropDownList(userObj); 
};

ToDoApp.prototype.addToDropDownList = function(currentUserObject) {
  var currentOption = $("<option/>").text(currentUserObject.name).data('user', currentUserObject);
  this.dropDownListElement.append(currentOption);
};

ToDoApp.prototype.addToUsersList = function(currentUserObject) {
  var currentListItem = $("<li/>");
  currentListItem.text(currentUserObject.name);
  var counterTrack = $("<span/>").text("("+currentUserObject.toDos.length+")")
                                 .insertAfter(currentListItem);
  this.usersListElement.append(currentListItem, counterTrack);
};

ToDoApp.prototype.addToDo = function() {
  var toDoObj = new ToDoList(this.toDoInputElement.val(), this.dropDownListElement.find("option:selected").data('user')); 
  this.addToDoList(toDoObj);
  toDoObj.userObject.toDos.push(toDoObj);
  this.incrementUserToDo(toDoObj);
};

ToDoApp.prototype.incrementUserToDo = function(currentToDoObject) { 
    currentToDoObject.completed = false;
    this.updateCounter(currentToDoObject);
};

ToDoApp.prototype.decrementUserToDo = function(currentToDoObject) {
  currentToDoObject.completed = true;
  this.updateCounter(currentToDoObject);
};

ToDoApp.prototype.addToDoList = function(currentToDoObject) {
  var currentListItem = $("<li/>"),
      checkboxElement = $("<input/>").attr("type", "checkbox").addClass("checkbox");
  currentListItem.append(checkboxElement);
  currentListItem.append($("<span/>").text(currentToDoObject.description + " assigned by " + currentToDoObject.userObject.name));
  checkboxElement.data("toDoListObject", currentToDoObject);  
  this.toDoListElement.append(currentListItem);
};


ToDoApp.prototype.updateCounter = function(currentToDoObject) {
  $.each(this.usersListElement.find("li"), function(index,element) {
    if($(this).text() == currentToDoObject.userObject.name) {
      var currentCounterElement = $(this).next("span");
      currentCounterElement.text("("+currentToDoObject.userObject.getActiveToDo()+")");
    }
  });
};

ToDoApp.prototype.markText = function(currentCheckBoxElement) {
  var textElement = currentCheckBoxElement.next("span");
      toDoObject = currentCheckBoxElement.data("toDoListObject");
  if(currentCheckBoxElement.context.checked) {
    textElement.addClass("lineThrough");
    this.decrementUserToDo(toDoObject);
  }
  else {
    textElement.removeClass();
    this.incrementUserToDo(toDoObject);
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
      _this.addToDoContainer.css("visibility", "visible");
      _this.createUserButton.prop("disabled", true);  
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