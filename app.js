
///Define DOM Variables
let array = [];
const form = document.getElementById("task-form")
const taskList = document.querySelector(".collection")
const clearBtn = document.querySelector(".clear-tasks")
const filter = document.getElementById("filter")
const taskInput = document.getElementById("task")
const addBtn = document.querySelector(".add-btn");

//Event Listeners
function loadEvents() {
    addBtn.addEventListener("click", addTask);
    filter.addEventListener("input", filterTasks);
    taskList.addEventListener("click", deleteTasks);
}

loadEvents();

//Add Task To List
//Edit: Instead of adding the <li> elmement, I decided to only add the <li> content/value 
//Edit 2: Reset the input tag for tasks for every possible outcome, better user experience. 
function addTask(e) {
    if (taskInput.value === "") {
        alert("Add a task")
    }
    else if (alreadyExists(taskInput.value)) {
        alert("Already a task")
    }
    else {
        //Create Li element, add class, append text (the content user types). 
        const li = document.createElement('li');
        li.className = 'collection-item';
        li.appendChild(document.createTextNode(taskInput.value));

        //create the link aka the x fa fa-remove button
        const link = document.createElement('a');
        link.className = `delete-item secondary-content`
        link.innerHTML = '<i class="fa fa-remove"></i>';

        li.appendChild(link)
        taskList.appendChild(li);
        array.push(li.textContent);
        //Prevents the page from redirecting.
    }
    taskInput.value = "";
    e.preventDefault();
}

//updatePosts()
//I needed a way to reset the array and update the tasks after a task 'gets' deleted.
//Functions resets array, parses through the task list, and adds the content to the array.

function updatePosts() {
    array = [];
    for (let count = 0; count < taskList.children.length; count++) {
        array[count] = taskList.children[count].textContent.toLowerCase();
    }
}

//alreadyExists(passed)
//Prevents the same item being added to the task list, alert is raised if the same item is attempted to be added.  
//Edit: Fixed major problem where since array is fixed, even when task is deleted, it still returns true. Changed to variable length with the DOM selector.


function alreadyExists(passed) {
    for (let count = 0; count < taskList.children.length; count++) {
        if (taskList.children[count].textContent.toLowerCase() === passed.toLowerCase()) {
            return true;
        }
    }
}

//Filters Tasks: Thought Process
//First, I learned about the map function to return a new array if stored.
//Used includes() to check if any of the added tasks have the filtered inputs.
//Found out that includes() actually returns true/false than the actual values, so I used forEach; parsed through the last array.
//Finally, the ul.collection contains an HTML collection, used children to get the <li> items and used the style property to display the items if the filtered text matches the tasks.

function filterTasks() {
    let filteredBoolean = array.map(function (tasks) {
        return tasks.toLowerCase().includes(filter.value.toLowerCase());
    })

    let filteredTasks = filteredBoolean.forEach(function (tasks, index) {
        if (tasks === false) {
            taskList.children[index].style.display = "none";
        }
        else {
            taskList.children[index].style.display = "block";
        }
    })
}

//deleteTasks()
//The event listener is on the ul > <li> tags.
//Learned contains is only in classList, use includes for strings
//This will target the x icon (<i>), target the parent element (<a>), finally, target the parent of that <li> and then remove it.
//Edit: Added the updatePosts(), will update tasks after something is deleted.

function deleteTasks(e) {
    if (e.target.classList.contains("fa-remove")) {
        e.target.parentElement.parentElement.remove();
    }
    updatePosts();
}
