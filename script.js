const mockTasks = [
  {
    id: 1,
    title: "Complete Assignment",
    description: "Complete the JavaScript assignment",
    dueDate: "2026-10-24",
    priority: "high",
  },
  {
    id: 2,
    title: "Learn JavaScript",
    description: "Practice variables and data types",
    dueDate: "2026-10-25",
    priority: "medium",
  },
];

let tasks = [...mockTasks];

let updateId = null;
const taskForm = document.getElementById("taskForm");
const titleInput = document.getElementById("title");
const descriptionInput = document.getElementById("description");
const dueDateInput = document.getElementById("dueDate");
const priorityInput = document.getElementById("priority");
const taskList = document.getElementById("taskList");
const searchInput = document.getElementById("searchInput");
const priorityFilter = document.getElementById("priorityFilter");
const submitBtn = document.getElementById("submitBtn");
const cancelBtn = document.getElementById("cancelBtn");
const formHeading = document.getElementById("formHeading");

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function showTask() {
  taskList.innerHTML = "";

  const searchValue = searchInput.value.toLowerCase();
  const filterValue = priorityFilter.value;

  const filteredTasks = tasks.filter(function (task) {
    const matchesSearch =
      task.title.toLowerCase().includes(searchValue) ||
      task.description.toLowerCase().includes(searchValue);

    const matchesPriority =
      filterValue === "all" || task.priority === filterValue;

    return matchesSearch && matchesPriority;
  });

  if (filteredTasks.length === 0) {
    taskList.innerHTML = `
      <tr>
        <td colspan="6" class="text-center">No tasks found!</td>
      </tr>
    `;
    return;
  }

  filteredTasks.forEach(function (task, index) {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${escapeHTML(task.title)}</td>
      <td>${escapeHTML(task.description)}</td>
      <td>
        <span class="badge ${
          task.priority === "high"
            ? "bg-danger"
            : task.priority === "medium"
              ? "bg-warning text-dark"
              : "bg-success"
        }">
          ${task.priority.toUpperCase()}
        </span>
      </td>
      <td>${escapeHTML(task.dueDate)}</td>
      <td>
        <button type="button" class="btn btn-sm btn-primary edit-btn">
          Edit
        </button>
        <button type="button" class="btn btn-sm btn-danger delete-btn">
          Delete
        </button>
      </td>
    `;

    row.querySelector(".edit-btn").addEventListener("click", function () {
      editTask(task.id);
    });

    row.querySelector(".delete-btn").addEventListener("click", function () {
      deleteTask(task.id);
    });

    taskList.appendChild(row);
  });
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, function (char) {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };

    return entities[char];
  });
}

taskForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const title = titleInput.value.trim();
  const description = descriptionInput.value.trim();
  const dueDate = dueDateInput.value;
  const priority = priorityInput.value;

  if (title === "" || dueDate === "") {
    alert("Please enter task title and due date!");
    return;
  }

  if (updateId === null) {
    const newTask = {
      id: Date.now(),
      title: title,
      description: description,
      dueDate: dueDate,
      priority: priority,
    };

    tasks.push(newTask);
  } else {
    tasks = tasks.map(function (task) {
      if (task.id === updateId) {
        return {
          ...task,
          title: title,
          description: description,
          dueDate: dueDate,
          priority: priority,
        };
      }

      return task;
    });
  }

  saveTasks();
  resetForm();
  showTask();
});

function editTask(id) {
  const task = tasks.find(function (item) {
    return item.id === id;
  });

  if (!task) return;

  titleInput.value = task.title;
  descriptionInput.value = task.description;
  dueDateInput.value = task.dueDate;
  priorityInput.value = task.priority;

  updateId = id;

  submitBtn.textContent = "Update Task";
  formHeading.textContent = "Edit Task";
  cancelBtn.hidden = false;

  titleInput.focus();
}

function deleteTask(id) {
  if (confirm("Are you sure you want to delete this task?")) {
    tasks = tasks.filter(function (task) {
      return task.id !== id;
    });

    if (updateId === id) {
      resetForm();
    }

    saveTasks();
    showTask();
  }
}

function resetForm() {
  taskForm.reset();

  updateId = null;
  submitBtn.textContent = "Add Task";
  formHeading.textContent = "Add New Task";
  cancelBtn.hidden = true;
}

cancelBtn.addEventListener("click", resetForm);

searchInput.addEventListener("input", showTask);

priorityFilter.addEventListener("change", showTask);

showTask();
