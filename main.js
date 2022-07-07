const projectListWrapper = document.querySelector(".projectListWrapper");
const taskListWrapper = document.querySelector(".taskListWrapper");
const projectUnorderedList = document.querySelector(".projectList");
const projectInput = document.querySelector("#addProjectInput");
const projectBtn = document.querySelector(".projectBtn");
const taskInput = document.querySelector("#taskInput");
const taskList = document.querySelector(".taskList");
const taskBtn = document.querySelector(".taskBtn");
const projectList = document.querySelector(".projectList");
const clearTasksBtn = document.querySelector(".clearTasks");
const deleteBtn = document.querySelector(".deleteProject");
const Local_Storage_Project_Key = "projectList";
const h2 = document.querySelector("h2");

let projects =
  JSON.parse(localStorage.getItem(Local_Storage_Project_Key)) || [];

let selectedProjectId = localStorage.getItem("selectedProjectId");

//saves project and selectedProjectID to local storage
function save() {
  localStorage.setItem(Local_Storage_Project_Key, JSON.stringify(projects));
  localStorage.setItem("selectedProjectId", selectedProjectId);
}

//event Listeners for buttons
clearTasksBtn.addEventListener("click", clearCompletedTasks);
deleteBtn.addEventListener("click", deleteProject);
projectBtn.addEventListener("click", addProject);
taskBtn.addEventListener("click", addTask);

//adds a new projects to the list
function addProject() {
  if (projectInput.value === null || projectInput.value === "") return;

  const projectName = createProject(projectInput.value); // creates an object with name of the project and its corresponding tasks

  projects.push(projectName);
  projectInput.value = "";
  save();
  projectList.innerText = "";
  renderProjects();
}

//renders all projects to display
function renderProjects() {
  projects.forEach((project) => {
    const projectListItem = document.createElement("li");
    projectListItem.classList.add("projectName");
    projectListItem.innerText = project.name;
    projectListItem.setAttribute("id", project.id); //sets li ID to object ID
    if (project.id === selectedProjectId) {
      projectListItem.classList.add("active");
    }
    projectUnorderedList.append(projectListItem);
  });
}

projectListWrapper.addEventListener("click", (e) => {
  if (e.target.classList.contains("projectName")) {
    selectedProjectId = e.target.id;
    h2.innerText = e.target.innerText;
    projectList.innerText = "";
    renderProjects();
    taskList.innerHTML = "";
    taskListWrapper.style.display = "block";
    save();
    renderTasks(); //renders tasks from selected project's tasks array
    renderTaskCount();
  }
});

//renders tasks to DOM as well as selected project's task array
function addTask() {
  if (taskInput.value === null || taskInput.value === "") return;
  const selectedProject = projects.find(
    (project) => project.id === selectedProjectId
  );
  const taskName = createTask(taskInput.value);
  selectedProject.tasks.push(taskName);
  taskInput.value = "";
  taskList.innerText = "";

  renderTasks();
  renderTaskCount();
  save();
}

//renders tasks to DOM
function renderTasks() {
  const selectedProject = projects.find(
    (project) => project.id === selectedProjectId
  );
  selectedProject.tasks.forEach((task) => {
    const div = document.createElement("div");
    div.classList.add("tasks");
    const input = document.createElement("input");
    input.type = "checkbox";
    input.checked = task.completed;
    input.id = task.id;
    const label = document.createElement("label");
    label.htmlFor = task.id;
    label.innerText = task.name;
    div.append(input, label);
    taskList.append(div);
  });
}

function createProject(name) {
  return {
    id: Date.now().toString(),
    name,
    tasks: [],
  };
}

function createTask(name) {
  return {
    id: Date.now().toString(),
    name,
    completed: false, //false value indicate the task is not complete.
  };
}

projectInput.onkeydown = (e) => {
  if (e.keyCode === 13) {
    e.preventDefault();
    addProject();
  }
};

taskInput.onkeydown = (e) => {
  if (e.keyCode === 13) {
    e.preventDefault();
    addTask();
  }
};

//checks whether the task is completed or not to get
taskListWrapper.addEventListener("click", (e) => {
  if (e.target.tagName.toLowerCase() === "input") {
    let selectedTaskId = e.target.id;
    console.log(selectedTaskId);
    const selectedProject = projects.find(
      (project) => project.id === selectedProjectId
    );
    const completedTask = selectedProject.tasks.find(
      (task) => task.id === selectedTaskId
    );
    completedTask.completed = e.target.checked; //if checked is true, the task is complete

    console.log(e.target.checked);
    renderTaskCount();
    save();
  }
});

//finds incomplete task count
function renderTaskCount() {
  const selectedProject = projects.find(
    (project) => project.id === selectedProjectId
  );
  const incompleteTaskCount = selectedProject.tasks.filter(
    (tasks) => tasks.completed === false
  ).length; //finds tasks that are not complete for the selected project
  const string = incompleteTaskCount === 1 ? "task" : "tasks";
  const p = document.querySelector("p");
  p.innerHTML = `${incompleteTaskCount} ${string} remaining! `;
}

//removes only the completed tasks
function clearCompletedTasks() {
  const selectedProject = projects.find(
    (project) => project.id === selectedProjectId
  );
  selectedProject.tasks = selectedProject.tasks.filter(
    (task) => task.completed === false
  );
  taskList.innerHTML = "";

  save();
  renderTasks();
}

function deleteProject() {
  const indexOfObject = projects.findIndex((project) => {
    return project.id === selectedProjectId;
  });

  if (indexOfObject === -1) return;
  console.log(indexOfObject);

  projects.splice(indexOfObject, 1);

  taskListWrapper.style.display = "none";

  save();
  projectList.innerText = "";
  renderProjects();
}

renderProjects();


const li = document.getElementsByClassName('projectName');
Array.from(li).forEach(element => element.classList.remove('active')); //removes the highlighted text after page reload

