/* =======  STATE  ======= */
let todos = JSON.parse(localStorage.getItem("todos")) || [];

/* =======  DOM  ======= */
const taskInp = document.getElementById("taskInput");
const dateInp = document.getElementById("dateInput");
const addBtn = document.getElementById("addBtn");
const filterSel = document.getElementById("filterSel");
const delAllBtn = document.getElementById("delAllBtn");
const tbody = document.querySelector("#todoTable tbody");
const emptyMsg = document.getElementById("emptyMsg");

/* =======  INIT  ======= */
renderTable();

/* =======  EVENTS  ======= */
addBtn.addEventListener("click", addTodo);
delAllBtn.addEventListener("click", deleteAll);
filterSel.addEventListener("change", renderTable);

/* =======  CORE  ======= */
function addTodo() {
  const task = taskInp.value.trim();
  const date = dateInp.value;
  if (!task || !date) return alert("Please fill both fields");
  todos.push({ id: Date.now(), task, date, done: false });
  save();
  taskInp.value = "";
  dateInp.value = "";
  renderTable();
}

function toggleDone(id) {
  const t = todos.find((x) => x.id === id);
  if (t) t.done = !t.done;
  save();
  renderTable();
}

function deleteTodo(id) {
  todos = todos.filter((x) => x.id !== id);
  save();
  renderTable();
}

function deleteAll() {
  if (!todos.length) return;
  if (confirm("Delete all tasks?")) {
    todos = [];
    save();
    renderTable();
  }
}

function save() {
  localStorage.setItem("todos", JSON.stringify(todos));
}

function renderTable() {
  const filter = filterSel.value;
  const filtered = todos.filter((t) => {
    if (filter === "open") return !t.done;
    if (filter === "done") return t.done;
    return true;
  });

  tbody.innerHTML = "";
  emptyMsg.style.display = filtered.length ? "none" : "block";

  filtered.forEach((t) => {
    const tr = document.createElement("tr");

    const statusCls = t.done ? "done" : "open";
    const statusText = t.done ? "Done" : "Open";

    tr.innerHTML = `
      <td>${t.task}</td>
      <td>${t.date}</td>
      <td><span class="status-badge ${statusCls}">${statusText}</span></td>
      <td>
        <button onclick="toggleDone(${t.id})">Toggle</button>
        <button onclick="deleteTodo(${t.id})">Delete</button>
      </td>`;
    tbody.appendChild(tr);
  });
}
