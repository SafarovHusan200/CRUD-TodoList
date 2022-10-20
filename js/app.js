const formCreate = document.getElementById("form-create");
const formEdit = document.getElementById("form-edit");
const listGroupTodo = document.getElementById("list-group-todo");
const messageCreate = document.getElementById("message-create");
const time = document.getElementById("time");
const modal = document.getElementById("modal");
const overlay = document.getElementById("overlay");
/* time elements */
const fullDay = document.getElementById("full-day");
const hourEl = document.getElementById("hour");
const minuteEl = document.getElementById("minute");
const secondEl = document.getElementById("second");
const closeEl = document.getElementById("close");

let editItemId;

// check
let todos = JSON.parse(localStorage.getItem("list"))
  ? JSON.parse(localStorage.getItem("list"))
  : [];

if (todos.length) showTodos();

//   setTodos
function setTodos() {
  localStorage.setItem("list", JSON.stringify(todos));
}

// time
function getTime() {
  const now = new Date();
  const date = now.getDate() < 10 ? "0" + now.getDate() : now.getDate();
  const month =
    now.getMonth() + 1 < 10 ? "0" + (now.getMonth() + 1) : now.getMonth() + 1;
  const year = now.getFullYear();

  const hour = now.getHours() < 10 ? now.getHours() + 1 : now.getHours();

  const minute =
    now.getMinutes() < 10 ? "0" + now.getMinutes() : now.getMinutes();
  const second =
    now.getSeconds() < 10 ? "0" + now.getSeconds() : now.getSeconds();

  fullDay.textContent = `${date}.${month}.${year}`;
  hourEl.textContent = hour;
  minuteEl.textContent = minute;
  secondEl.textContent = second;

  return `${hour}:${minute} ${date}.${month}.${year}`;
}
setInterval(() => {
  getTime();
}, 100);

// show todos
function showTodos() {
  const todos = JSON.parse(localStorage.getItem("list"));

  listGroupTodo.innerHTML = "";
  todos.forEach((item, index) => {
    listGroupTodo.innerHTML += `
        <li 
            ondblclick=(setComplated(${index})) 
            class="list-group-item d-flex justify-content-between ${
              item.complated ? "complated" : ""
            }">
          ${item.text}
          <div class="todo-icons">
            <span class="opacity-50 me-2">${item.time}</span>
            <img onclick=(editTodo(${index})) src="img/edit.svg" alt="edit icon" width="25" height="25" />
            <img onclick=(deleteTodo(${index})) src="img/delete.svg" alt="delete icon" width="25" height="25" />
          </div>
        </li>
        `;
  });
}

// show error
function showMessage(where, message) {
  document.getElementById(`${where}`).textContent = message;

  setTimeout(() => {
    document.getElementById(`${where}`).textContent = "";
  }, 2500);
}

// get Todos

formCreate.addEventListener("submit", (e) => {
  e.preventDefault();

  const todoText = formCreate["input-create"].value.trim();
  formCreate.reset();

  if (todoText.length) {
    todos.push({ text: todoText, time: getTime(), complated: false });
    setTodos();
    showTodos();
  } else {
    showMessage("message-create", "Please, enter some todo...");
  }
});

// delete todo
function deleteTodo(id) {
  const deleteTodos = todos.filter((item, index) => {
    return id !== index;
  });

  todos = deleteTodos;
  setTodos();
  showTodos();
}

// setComplated
function setComplated(id) {
  const complatedTodos = todos.map((item, index) => {
    if (id == index) {
      return { ...item, complated: item.complated ? false : true };
    } else {
      return { ...item };
    }
  });

  todos = complatedTodos;
  setTodos();
  showTodos();
}

// edit Form
formEdit.addEventListener("submit", (e) => {
  e.preventDefault();

  const todoText = formEdit["input-edit"].value.trim();
  formEdit.reset();

  if (todoText.length) {
    todos.splice(editItemId, 1, {
      text: todoText,
      time: getTime(),
      complated: false,
    });
    setTodos();
    showTodos();
  } else {
    showMessage("message-edit", "Please, enter some todo...");
  }

  close();
});

// Edit Todos
function editTodo(id) {
  open();
  editItemId = id;
}

function open() {
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
}

function close() {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
}

closeEl.addEventListener("click", close);
overlay.addEventListener("click", close);

document.addEventListener("keydown", (e) => {
  if (e.key == "Escape") {
    close();
  }
});
