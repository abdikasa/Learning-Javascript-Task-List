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
}

loadEvents();


//Add Task To List
function addTask(e) {
    if (taskInput.value === "") {
        alert("Add a task")
    } else {

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

        taskList.value = "";

        //Prevents the page from redirecting.
    }
    e.preventDefault();
}
