
///Define DOM Variables
let array = [];
const form = document.getElementById("task-form")
const taskList = document.querySelector(".collection")
const clearBtn = document.querySelector(".clear-tasks")
const filter = document.getElementById("filter")
const taskInput = document.getElementById("task")
const addBtn = document.querySelector(".add-btn");
const clearAllBtn = document.querySelector(".clear-tasks");


//Event Listeners
function loadEvents() {
    //Event that wil load the items stored in local storage (if any). Persistent after refresh.
    //DOMContentLoaded is called after the  DOM is loaded.
    document.addEventListener("DOMContentLoaded", getTasksFromLS)
    addBtn.addEventListener("click", addTask);
    filter.addEventListener("input", filterTasks);
    taskList.addEventListener("click", deleteTasks);
    clearAllBtn.addEventListener("click", clearAll);
}

loadEvents();

//Add Task To List
//Edit: Instead of adding the <li> elmement, I decided to only add the <li> content/value 
//Edit 2: Reset the input tag for tasks for every possible outcome, better user experience. 
//Edit 3: After adding LS fucntionality, line 94 had a problem, the variable array would never get updated till a task was deleted.
//Edit 3.1: In other words, if user didn't delete a task, the array would continue to populate even after refreshing the page.
//Edit 3.0-1 Fix: call the updatePosts() method when adding a task too.
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

        //Store in Local Storage
        storeInLocalStorage(li.textContent)
        //Prevents the page from redirecting.
    }
    taskInput.value = "";
    updatePosts();
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
//Edit: Used for loop toiterate through the LS key/values, when the x-icon is clicked, the condition checks whether the <li> textContent matches the specific index of the task key in the local storage.
//Edit 2: I tried removeItem(key), doesn't work since it's one key with an array of values. I learned we should instead use splice,  it will target the item we are trying to attempt to delete from the value pairs.
//Edit 3: Items must be set in order to see the above changes, so we use stringify when storing and when retreiving we convert it back to an object. 
//Edit 4: Realized after revising that array doesn't get updated, which leads to style errors hen trying to manipulate undefined variables. 

function deleteTasks(e) {
    let tasks;
    if (e.target.classList.contains("fa-remove")) {
        tasks = checkLocalStorage("tasks");
        e.target.parentElement.parentElement.remove();

        for (let i = 0; i < tasks.length; i++) {
            //    console.log(tasks[i].includes(e.target.parentElement.parentElement.textContent));
            if (tasks[i].includes(e.target.parentElement.parentElement.textContent)) {
                tasks.splice(i, 1);
                break;
            }
        }
        localStorage.setItem("tasks", JSON.stringify(tasks));
        updatePosts();
    }
}

//storeInLocalStorage()
//First check if there is already tasks in local storage. 
//if yes: tasks will be assigned to whatever is in LS, since all LS items are strings, we need to convert it back to an object.
//Otherwise, set tasks to an empty array.
//Lastly to set items we need to convert back to strings. "tasks" = key, tasks the variable is the value.

function storeInLocalStorage(task) {
    let tasks = checkLocalStorage("tasks");
    tasks.push(task);
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

//getTasksFromLS()
//Checks to see if our key "tasks" exist.
//Gets the tasks from LS after a refresh, aka persistence.
//Issues Arised Below w/fix
//Problem: When I refreshed the page and the text wouldn't appear but the <li> tag would.
//FIX 1: added task variable since forEach has two parameters we can use, the array item and the index (optional).
//Problem 2: When user refreshed the page, the updatePost() doesn't get called, whichmeans, filterTasks() doesn't get updated with the newest values.
//Fix 2: When DOM is loaded, we want updatePosts() to be called. Function is now called when adding, deleting and now when the page loads. 

function getTasksFromLS() {
    let tasks = checkLocalStorage("tasks");
    tasks.forEach(function (task) {
        const li = document.createElement('li');
        li.className = 'collection-item';
        li.appendChild(document.createTextNode(task));

        //create the link aka the x fa fa-remove button
        const link = document.createElement('a');
        link.className = `delete-item secondary-content`
        link.innerHTML = '<i class="fa fa-remove"></i>';
        li.appendChild(link)
        taskList.appendChild(li);
    })
    updatePosts();
}

//checkLocalStorage(key)
//Realized this portion of the code was repeated about 3 times.
//Used the variable key as the local passed parameter because I could pass whatever string I want to act as the key in the function. 
//Returns the array.

function checkLocalStorage(key) {
    let tasks;
    if (localStorage.getItem(key) === null) {
        tasks = [];
    } else {
        tasks = JSON.parse(localStorage.getItem(key));
    }
    return tasks;
}

//clearAll()
//Forgot to add a clear all function. 
//Really easy, just use the clear method. But of course I like to make things harder for myself.
//So we will use the Node's firstChild property, returns null if no children exist or it will return the first child.
//Fixed issue where the values would not persist, made the stupid mistake of deleting the ul.collection, instead this works easier, peformance is good too.
//Edit: If after using this button and you used the filter input box, you would be modifying undefined variables with the style tag.
//Edit fix: use updatePosts();

function clearAll() {
    let tasks = checkLocalStorage("tasks");
    while (taskList.firstChild) {
        taskList.firstChild.remove();
    }
    tasks.splice(0, tasks.length);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    updatePosts();
}

