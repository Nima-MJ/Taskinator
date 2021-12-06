var tasksInProgressEl = document.querySelector("#tasks-in-progress");
var tasksCompletedEl = document.querySelector("#tasks-completed");
var taskIdCounter = 0;
var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do");
var pageContentEl = document.querySelector("#page-content");
var tasks = [];

var taskFormHandler = function(event){
    event.preventDefault(); //stops page from refreshing
    var taskNameInput = document.querySelector("input[name='task-name']" ).value;
    var taskTypeInput = document.querySelector("select[name='task-type']").value;

    // check if input valuesare empty strings
    if (!taskNameInput || !taskTypeInput){
        alert("You need to fill out the task form!");
        return false;
    }
    formEl.reset();
    var isEdit = formEl.hasAttribute("data-task-id");

    if (isEdit){
        var taskId = formEl.getAttribute("data-task-id");
        completeEditTask(taskNameInput, taskTypeInput, taskId);
    }else{
        //package up data as an object
        var taskDataObj = {
        name: taskNameInput,
        type: taskTypeInput,
        status: "to do"
        };
        createTaskEl(taskDataObj);
    }

}
var createTaskEl = function(taskDataObj){

    // create list item
    var listItemEl = document.createElement("li");
    listItemEl.className = "task-item";

    //add task id as a custome attribute
    listItemEl.setAttribute("data-task-id", taskIdCounter);

    //create div to hold task info and add to list item
    var taskInfoEl = document.createElement("div");

    //give it a class name
    taskInfoEl.className = "task-info";
    //add html content to div

    taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" + taskDataObj.type + "</span>";
    listItemEl.appendChild(taskInfoEl);
    var taskActionsEl = createTaskActions(taskIdCounter);
    listItemEl.appendChild(taskActionsEl);
    
    //check the status of the task
    if (taskDataObj.status === "to do"){
        listItemEl.querySelector("select[name='status-change']").selectedIndex = 0;
        tasksToDoEl.appendChild(listItemEl);
    }else if (taskDataObj.status === "in progress"){
        listItemEl.querySelector("select[name='status-change']").selectedIndex = 1;
        tasksInProgressEl.appendChild(listItemEl);
    }else if (taskDataObj.status === "completed"){
        listItemEl.querySelector("select[name='status-change']").selectedIndex = 2;
        tasksCompletedEl.appendChild(listItemEl);
    }else{
        tasksToDoEl.appendChild(listItemEl);
    }
   
    taskDataObj.id = taskIdCounter;
    tasks.push(taskDataObj);
    saveTasks();
    //increase task counter for next unique id
    taskIdCounter++;
}
var createTaskActions = function(taskId){
    var actionContainerEl = document.createElement("div");
    actionContainerEl.className = "task-actions";

    // create edit button 
    var editButtonEl = document.createElement("button");
    editButtonEl.textContent = "edit";
    editButtonEl.className = "btn edit-btn";
    editButtonEl.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(editButtonEl);

    //create delete button
    var deleteButtonEl = document.createElement("button");
    deleteButtonEl.textContent = "delete";
    deleteButtonEl.className = "btn delete-btn";
    deleteButtonEl.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(deleteButtonEl);

    //create dropdown select element
    var statusSelectEl = document.createElement("select");
    statusSelectEl.className = "select-status";
    statusSelectEl.setAttribute("data-task-id", taskId);
    statusSelectEl.setAttribute("name", "status-change");
    actionContainerEl.appendChild(statusSelectEl); //add it to the actionContainerEl Div
    var statusChoices = ["To Do", "In Progress", "Completed"];
    for (var i = 0; i < statusChoices.length; i++){

        //create option element
        var statusOptionEl = document.createElement("option");
        statusOptionEl.textContent = statusChoices[i];
        statusOptionEl.setAttribute("value", statusChoices[i]);

        //append to select
        statusSelectEl.appendChild(statusOptionEl);
    }
    return actionContainerEl;
}

formEl.addEventListener("submit", taskFormHandler);

var taskButtonHandler = function(event){
    //get target element from event 
    var targetEl = event.target; //event.target allows you to read where the user clicks

    if (targetEl.matches(".edit-btn")){
        var taskId = targetEl.getAttribute("data-task-id");
        editTask(taskId);
    }
    else if (targetEl.matches(".delete-btn")){
        console.log("you clicked a delete button!")
        var taskId = event.target.getAttribute("data-task-id");
        deleteTask(taskId);
    }

};
var taskStatusChangeHandler = function(event){
    //get the task item's id
    var taskId = event.target.getAttribute("data-task-id"); //event.target is the element that triggered the event 

    //get currently selected option's value and convert to lowercase
    var statusValue = event.target.value.toLowerCase();

    //find the parent task item element based on the id
    var taskSelected = document.querySelector(".task-item[data-task-id='"+ taskId + "']" );

    if (statusValue === "to do"){
        tasksToDoEl.appendChild(taskSelected);
    }
    else if (statusValue === "in progress"){
        tasksInProgressEl.appendChild(taskSelected);
    }else if(statusValue === "completed"){
        tasksCompletedEl.appendChild(taskSelected);
    }
    //update tasks's in the tasks array 
    for (var i = 0; i < tasks.length; i++){
        if (tasks[i].id === parseInt(taskId)){
            tasks[i].status = statusValue;
        }
    }
    saveTasks();
};

var deleteTask = function(taskId){
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
    taskSelected.remove();

    // create new array to hold updated lit of tasks 
    var updatedTaskArr = [];

    //loop through current tasks
    for (var i = 0;  i < tasks.length; i++){
        //if tasks[i].id doesn't match the value of taskId, lets keep that taks 
        if(tasks[i].id !== parseInt(taskId)){
            updatedTaskArr.push(tasks[i]);
        }
    }
    //reassign tasks array to be the same as updatedTasArr
    tasks = updatedTaskArr;
    saveTasks();
};
var editTask = function (taskId){
    //get task list item element 
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
    //get content from task name and type 
    var taskName = taskSelected.querySelector("h3.task-name").textContent;

    var taskType = taskSelected.querySelector("span.task-type").textContent;
    document.querySelector("input[name='task-name']").value = taskName;
    document.querySelector("select[name='task-type']").value = taskType;
    document.querySelector("#save-task").textContent= "Save Task";
    formEl.setAttribute("data-task-id", taskId);
};
var completeEditTask = function(taskName,taskType,taskId){
    var taskSelected = document.querySelector(".task-item[data-task-id='"+ taskId +"']");

    //set new values
    taskSelected.querySelector("h3.task-name").textContent = taskName;
    taskSelected.querySelector("span.task-type").textContent = taskType;
    //loop through tasks array and task object with new content
    for (var i = 0; i < tasks.length; i++){
        if (tasks[i].id === parseInt(taskId)){
            tasks[i].name = taskName;
            tasks[i].type = taskType;
        }
    }
    alert("Task Updated");
    formEl.removeAttribute("data-task-id");
    document.querySelector("#save-task").textContent = "Add Task";
    saveTasks();
}
var saveTasks = function(){
    localStorage.setItem("tasks", JSON.stringify(tasks));
};
//gets task items from localStorage

var loadTasks = function(){
    var savedTasks = localStorage.getItem("tasks");
    if (!savedTasks){
        return false;
    }
    savedTasks = JSON.parse(savedTasks);
    //loop through savedTasks array 
    for(var i=0; i<savedTasks.length; i++){
        createTaskEl(savedTasks[i]);
    }
};
pageContentEl.addEventListener("click", taskButtonHandler);
pageContentEl.addEventListener("change", taskStatusChangeHandler);
loadTasks();
