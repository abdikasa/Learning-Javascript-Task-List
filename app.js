let array = [];

///Define DOM Variables

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
    taskList.addEventListener("click", deleteStuffs);
}

loadEvents();

//Add Task To List
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
        array.push(li);
        taskInput.value = "";
        //Prevents the page from redirecting.
        e.preventDefault();
    }
    e.preventDefault();
}

//alreadyExists(passed)
//Prevents the same item being added to the task list, alert is raised if the same item is attempted to be added.  

function alreadyExists(passed) {
    for (let count = 0; count < array.length; count++) {
        if (array[count].textContent.toLowerCase() === passed.toLowerCase()) {
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
        return tasks.textContent.toLowerCase().includes(filter.value.toLowerCase())
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


function deleteStuffs(e) {
    if (e.target.classList.contains("fa-remove")) {
        e.target.parentElement.parentElement.remove();
    }
}

