// array for todo list
const todoList = [
  {
    id: 1,
    task: 'Learn HTML',
    completed: true,
  },
  {
    id: 2,
    task: 'Learn CSS',
    completed: true,
  },
  {
    id: 3,
    task: 'Learn JS',
    completed: false,
  },
  {
    id: 4,
    task: 'Learn TypeScript',
    completed: false,
  },
  {
    id: 5,
    task: 'Learn React',
    completed: false,
  },
];

const todoListElement = document.querySelector('ul');
const todoDialog = document.querySelector('dialog');
const addTodoButton = document.querySelector('.add-btn');
const addTodoForm = todoDialog.querySelector('form');
const todoInput = addTodoForm.querySelector('input');

function renderTodo(todo) {
  const listItem = document.createElement('li');
  const checkbox = document.createElement('input');
  const label = document.createElement('label');
  const deleteButton = document.createElement('button');

  checkbox.type = 'checkbox';
  checkbox.id = `todo-${todo.id}`;
  checkbox.checked = todo.completed;
  checkbox.addEventListener('change', () => {
    todo.completed = checkbox.checked;
    console.log(todoList);
  });

  label.htmlFor = checkbox.id;
  label.textContent = todo.task;

  deleteButton.type = 'button';
  deleteButton.textContent = 'Delete';
  deleteButton.addEventListener('click', () => {
    const todoIndex = todoList.findIndex(item => item.id === todo.id);
    todoList.splice(todoIndex, 1);
    todoListElement.removeChild(listItem);
    console.log(todoList);
  });

  listItem.append(checkbox, label, deleteButton);
  todoListElement.append(listItem);
}

todoList.forEach(renderTodo);

addTodoButton.addEventListener('click', () => {
  todoDialog.showModal();
});

addTodoForm.addEventListener('submit', event => {
  event.preventDefault();

  const todo = {
    id:
      todoList.reduce((largestId, item) => Math.max(largestId, item.id), 0) + 1,
    task: todoInput.value.trim(),
    completed: false,
  };

  todoList.push(todo);
  renderTodo(todo);
  console.log(todoList);
  addTodoForm.reset();
  todoDialog.close();
});
