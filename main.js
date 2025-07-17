const form = document.getElementById("todo-form");
const listContainer = document.getElementById("todo-list");
const listContainerCompleted = document.getElementById("completed-todo");
const filterSelect = document.getElementById("priority-filter");
const filterSelectCompleted = document.getElementById(
  "completed-priority-filter"
);

// Array to hold todos
const todos = [];

// Create TODO
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const title = document.getElementById("title").value;
  const dueAt = formatIndonesianDateTimeFromInput(
    document.getElementById("due-at").value
  );
  const priority = document.getElementById("priority").value;
  const todo = {
    id: Date.now().toString(),
    title,
    dueAt,
    priority,
    isCompleted: false,
  };

  todos.push(todo);
  alert("Todo created successfully!");
  renderTodos();
  renderCompletedTodos();
  form.reset();
});

// Show todos
function renderTodos(filterPriority = "All") {
  listContainer.innerHTML = "";

  const unfinishedTodos = todos.filter((todo) => {
    const isUnfinished = !todo.isCompleted;
    const isPriorityMatch =
      filterPriority === "All" || todo.priority === filterPriority;
    return isUnfinished && isPriorityMatch;
  });

  unfinishedTodos.forEach((todo) => {
    const wrapper = document.createElement("div");
    wrapper.className = "todo-item";

    wrapper.innerHTML = `
      <div class="info">
        <p class="title">${todo.title}</p>
        <p class="due-at">${todo.dueAt}</p>
      </div>
      <div class="action">
        <p class="priority">${todo.priority}</p>
        <input 
          type="checkbox" 
          name="isDone"
          onchange="toggleComplete('${todo.id}')"
        />
      </div>
    `;

    listContainer.appendChild(wrapper);
  });
}

function toggleComplete(id) {
  const index = todos.findIndex((todo) => todo.id === id);

  todos[index].isCompleted = true;
  renderTodos();
  renderCompletedTodos();
}

function renderCompletedTodos(filterPriority = "All") {
  listContainerCompleted.innerHTML = "";

  const finishedTodos = todos.filter((todo) => {
    const isFinished = todo.isCompleted;
    const isPriorityMatch =
      filterPriority === "All" || todo.priority === filterPriority;
    return isFinished && isPriorityMatch;
  });

  const fragment = document.createDocumentFragment();

  finishedTodos.forEach((todo) => {
    const wrapper = document.createElement("div");
    wrapper.className = "todo-item-completed";

    wrapper.innerHTML = `
      <div class="info">
        <p class="title">${todo.title}</p>
        <p class="due-at">${todo.dueAt}</p>
      </div>
      <div class="action">
        <p class="priority">${todo.priority}</p>
        <button class="remove">Delete</button>
      </div>
    `;

    // Delete button handler
    const deleteButton = wrapper.querySelector(".remove");
    deleteButton.addEventListener("click", () => {
      const index = todos.findIndex((t) => t.id === todo.id);
      todos.splice(index, 1);
      renderCompletedTodos(filterPriority);
    });

    fragment.appendChild(wrapper);
  });

  listContainerCompleted.appendChild(fragment);
}

filterSelect.addEventListener("change", () => {
  const selected = filterSelect.value;
  renderTodos(selected);
});

filterSelectCompleted.addEventListener("change", () => {
  const selected = filterSelectCompleted.value;
  renderCompletedTodos(selected);
});

document.querySelector(".delete-all").addEventListener("click", (e) => {
  if (confirm("Hapus semua todo yang sudah selesai?")) {
    for (let i = todos.length - 1; i >= 0; i--) {
      if (todos[i].isCompleted) {
        todos.splice(i, 1);
      }
    }
    renderTodos();
    renderCompletedTodos();
  }
});

function formatIndonesianDateTimeFromInput(inputValue) {
  const [datePart, timePart] = inputValue.split("T");
  const [year, month, day] = datePart.split("-").map(Number);
  const [hour, minute] = timePart.split(":").map(Number);

  const date = new Date(year, month - 1, day, hour, minute);

  const options = {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  };

  return date.toLocaleString("id-ID", options) + " WIB";
}
