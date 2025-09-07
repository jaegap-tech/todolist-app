import AddTodoForm from './components/AddTodoForm';
import TodoList from './components/TodoList';
import './App.css';
import { useTodos } from './hooks/useTodos'; // Import useTodos

function App() {
  const { todos, addTodo, deleteTodo, toggleTodo, updateTodo } = useTodos(); // Use the custom hook

  return (
    <>
      <h1>Todo App</h1>
      <AddTodoForm onAddTodo={addTodo} /> {/* Pass addTodo as a prop */}
      <TodoList todos={todos} onDelete={deleteTodo} onToggle={toggleTodo} onUpdate={updateTodo} /> {/* Pass todos, deleteTodo, toggleTodo, and updateTodo as props */}
    </>
  );
}

export default App;
