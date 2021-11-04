import './App.css';
import { useState, useEffect, useCallback } from 'react';
import { getTodos } from './services/todoAPI';
import Form from './components/Form';
import Task from './components/Task';

function App() {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState();
  const [, updateState] = useState();
  const forceUpdate = useCallback(() => updateState({}), []);

  // A função de forçar o update foi encontrada em https://www.ti-enxame.com/pt/javascript/como-forcar-o-componente-renderizar-novamente-com-ganchos-no-react/808436281/
  // Pois o react não estava rendedizando o filho após funções de ordenação.

  function setTodosFromAPI() {
    // eslint-disable-next-line no-shadow
    getTodos().then((todos) => {
      setTodos(todos);
    });
  }

  useEffect(() => {
    setTodosFromAPI();
  }, []);

  const oneNegative = -1;

  function setTodosSortRecents() {
    const todosSorted = todos;
    const result = todosSorted.sort((a, b) => {
      if (a.date > b.date) {
        return oneNegative;
      }
      return true;
    });
    setTodos(result);
    forceUpdate();
  }

  function setTodosSortAz() {
    const todosSorted = todos;
    const result = todosSorted.sort((a, b) => {
      if (a.title < b.title) {
        return oneNegative;
      }
      return true;
    });
    setTodos(result);
    forceUpdate();
  }

  function setTodosSortZa() {
    const todosSorted = todos;
    const result = todosSorted.sort((a, b) => {
      if (a.title > b.title) {
        return oneNegative;
      }
      return true;
    });
    setTodos(result);
    forceUpdate();
  }

  const filteredTodos = filter
    ? todos.filter((todo) => todo.status === filter)
    : todos;

  return (
    <div className="App">
      <h1> Lista de Tarefas </h1>
      <div className="filters">
        <span>Status</span>
        <button
          type="button"
          data-testid="btn-tasks-all"
          onClick={ () => setFilter() }
        >
          Todas Tarefas
        </button>
        <button
          type="button"
          data-testid="btn-tasks-pending"
          onClick={ () => setFilter('pending') }
        >
          Pendentes
        </button>
        <button
          type="button"
          data-testid="btn-tasks-progress"
          onClick={ () => setFilter('progress') }
        >
          Em Andamento
        </button>
        <button
          type="button"
          data-testid="btn-tasks-completed"
          onClick={ () => setFilter('completed') }
        >
          Concluídas
        </button>
      </div>
      <div className="sorted">
        <span>Ordenação</span>
        <button
          type="button"
          data-testid="btn-order-date-crescent"
          onClick={ () => setTodosFromAPI() }
        >
          Data Descrescente
        </button>
        <button
          type="button"
          data-testid="btn-order-date-decrescent"
          onClick={ () => setTodosSortRecents() }
        >
          Data Crescente
        </button>
        <button
          type="button"
          data-testid="btn-order-az"
          onClick={ () => setTodosSortAz() }
        >
          A-Z
        </button>
        <button
          type="button"
          data-testid="btn-order-za"
          onClick={ () => setTodosSortZa() }
        >
          Z-A
        </button>
      </div>
      {filteredTodos.map((todo, index) => (
        <div key={ index }>
          {/* eslint-disable-next-line react/jsx-no-bind */}
          <Task task={ todo } getTodos={ setTodosFromAPI } />
        </div>
      ))}
      <br />
      <br />
      <br />
      {/* eslint-disable-next-line react/jsx-no-bind */}
      <Form getTodos={ setTodosFromAPI } />
    </div>
  );
}

export default App;
