function User (currentUserName) {
  this.name = currentUserName;
  this.toDos = []; 
}

User.prototype.getActiveToDo = function() {
  var count = 0;
  for(var i = 0; i < this.toDos.length ; i++) {
    if(!this.toDos[i].completed) {
      count ++;
    }
  }
  return count;
};



