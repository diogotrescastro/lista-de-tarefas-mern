export async function getTodos() {
  return fetch(`http://localhost:3000/todo/list`, {method: 'GET'})
    .then((result) => result.json())
    .then((data) => data);
}


export  async function addTodo(todo) {
  return fetch(`http://localhost:3000/todo/add`, {
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
    body: JSON.stringify({"title": "", "active": "true"})
  })
    .then((result) => result.json())
    .then((data) => true)
    .catch((err) => console.error("Error: ", err));;
}

export async function updateTodo(todo, setTodosFromAPI) {
  return fetch(`http://localhost:3000/todo/update`, {
    headers: { 'Content-Type': 'application/json' },
    method: 'PUT',
    body: JSON.stringify(todo)
  })
    .then(() => setTodosFromAPI())
    .catch((err) => console.error("Error: ", err));;
}

export async function deleteTodo(todo, setTodosFromAPI) {
  return fetch(`http://localhost:3000/todo/delete`, {
    headers: { 'Content-Type': 'application/json' },
    method: 'DELETE',
    body: JSON.stringify(todo)
  })
    .then(() => setTodosFromAPI())
    .catch((err) => console.error("Error: ", err));;
}