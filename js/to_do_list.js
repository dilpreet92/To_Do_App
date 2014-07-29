function ToDoApp (elements) {
  this.upperLeftContainer = elements.upperLeftContainer;
  this.upperRightContainer = elements.upperRightContainer;
  this.toDoListElement = elements.toDoListElement;
  this.usersListElement = elements.usersListElement;
  this.createUserButton = elements.createUserButton;
  this.rightUpperAddName = elements.rightUpperAddName;
  this.createToDoButton = elements.createToDoButton;
  this.userCount = 0;
}

ToDoApp.prototype.addInputBox = function(currentId) {
  return ($("<input/>").attr("id", currentId));
};

ToDoApp.prototype.addButton = function(currentId, currentValue) {
  return ($("<button/>").text(currentValue).attr("id", currentId));
};

ToDoApp.prototype.addLabel = function(currentText, currentId) {
  return ($("<label/>").text(currentText).attr("id", currentId));
};

ToDoApp.prototype.addUserName = function() {
  this.rightUpperAddName.append(
                                 this.addLabel("Name:", "nameLabelId"),
                                 this.addInputBox("nameInputId"),
                                 this.addButton("addButtonID", "Add")
                                 );
};

ToDoApp.prototype.validate = function(currentName) {
  if(currentName.val()) {
    return true;
  }
  else {
    alert("Please Enter Something");
    return false;
  }
};

ToDoApp.prototype.addDropDown = function() {
  var users = this.usersListElement.find("li"),
      dropDownList = $("<select/>").attr("id", "dropDownItem");
  $.each(users, function(index, element) {
    dropDownList.append($("<option/>").text($(this).text()));
  });
  return (dropDownList);
};

ToDoApp.prototype.addToDo = function() {
  if(this.userCount) {
    this.upperLeftContainer.append(
                                 this.addLabel("To Do :", "toDoLabelId"),
                                 this.addInputBox("toDoInputId"),
                                 this.addDropDown(),
                                 this.addButton("saveButtonId", "Save")
                                 );
  }
  else {
    alert("Please Add Users");
  }
};

ToDoApp.prototype.addToUsersList = function(currentName) {
  var currentListItem = $("<li/>").attr("id", currentName.val()),
      counter = 0;
  currentListItem.text(currentName.val());
  var span = $("<span/>").text("("+counter+")").insertAfter(currentListItem);
  currentListItem.data("counter",counter);
  this.usersListElement.append(currentListItem, span);
};

ToDoApp.prototype.createCheckBox = function() {
  return ($("<input/>").attr("type", "checkbox").addClass("checkbox"));
}

ToDoApp.prototype.updateCounter = function(currentName,arithmeticOperation) {
  var currentListItem = this.usersListElement.find("#"+currentName+""),
      currentCounterElement = currentListItem.next("span"),
      counter = currentListItem.data("counter");
  if(arithmeticOperation == "+") {
    counter++;
  }
  else {
    counter--;
  }
  currentListItem.data("counter",counter);
  currentCounterElement.text("("+counter+")");
};

ToDoApp.prototype.addToDoList = function(currentName) {
  var currentListItem = $("<li/>"),
      dropDownValue = $("#dropDownItem :selected").text();
  currentListItem.append(this.createCheckBox);
  currentListItem.append($("<span>").text(currentName.val()+" assigned by " + (dropDownValue)));
  this.toDoListElement.append(currentListItem);
  currentListItem.data("currentName", dropDownValue);
  this.updateCounter(dropDownValue,"+");
};

ToDoApp.prototype.checkUniqueName = function(nameInputElement) {
  var returnValue = true;
  $.each(this.usersListElement.find("li") , function() {
    if($(this).text() == nameInputElement.val()) {
      alert("Please Enter Unique Name");
      returnValue = false;
    }
    else {
      returnValue = true;
    }
  });
  return returnValue;
};

ToDoApp.prototype.markText = function(currentCheckBoxElement) {
  var textElement = currentCheckBoxElement.next("span"),
      currentListItem = currentCheckBoxElement.parent("li"),
      currentName = currentListItem.data("currentName");
  if(currentCheckBoxElement.context.checked) {
    textElement.addClass("lineThrough");
    this.updateCounter(currentName,"-");
  }
  else {
    textElement.removeClass();
    this.updateCounter(currentName,"+");
  }
};

ToDoApp.prototype.bindEvents = function() {
  var _this = this;
  this.createUserButton.on("click",function() {
    _this.createUserButton.prop("disabled", true);
    _this.createToDoButton.prop("disabled", true);
    _this.addUserName();
  });

  this.rightUpperAddName.on("click", "#addButtonID", function() {
    var nameInputElement = $(this).prev(); 
    if(_this.validate(nameInputElement) & _this.checkUniqueName(nameInputElement)) {
      _this.addToUsersList(nameInputElement);
      _this.rightUpperAddName.empty();
      _this.userCount++;
      _this.createUserButton.prop("disabled", false);
      _this.createToDoButton.prop("disabled", false);
    }
  });

  this.createToDoButton.on("click", function() {
    _this.createUserButton.prop("disabled", true);
    _this.createToDoButton.prop("disabled", true);
    _this.addToDo();
  });

  this.upperLeftContainer.on("click","#saveButtonId",function() {
    var nameInputElement = $("#toDoInputId"); 
    if(_this.validate(nameInputElement)) {
      _this.addToDoList(nameInputElement);
      _this.upperLeftContainer.empty();
      _this.createUserButton.prop("disabled", false);
      _this.createToDoButton.prop("disabled", false);
    }
  });

  this.toDoListElement.on("click",".checkbox",function() {
    _this.markText($(this));
  });
};

$(document).ready(function() {
	var elements = {
    "upperLeftContainer" : $("#leftUpper"),
    "upperRightContainer" : $("#rightUpper"),
    "toDoListElement" : $("#toDoList"),
    "usersListElement" : $("#usersList"),
    "createUserButton" : $("#createUser"),
    "rightUpperAddName" : $("#rightUpperAddName"),
    "createToDoButton" : $("#createToDoButtonId")
   };
  var createToDoObj = new ToDoApp(elements);
  createToDoObj.bindEvents();
});