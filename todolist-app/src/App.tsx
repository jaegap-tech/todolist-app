import AddTodoForm from './components/AddTodoForm';
import TodoList from './components/TodoList';
import { useTodos } from './hooks/useTodos';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';

function AppContent() {
  const { todos, addTodo, deleteTodo, updateTodoStatus, updateTodo } = useTodos();
  const { themeName, setTheme } = useTheme();

  const handleToggleTheme = () => {
    setTheme(themeName === 'light' ? 'dark' : 'light');
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen font-sans">
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-white">
            Todo App
          </h1>
          <button
            onClick={handleToggleTheme}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-colors duration-200"
          >
            Switch to {themeName === 'light' ? 'Dark' : 'Light'} Mode
          </button>
        </div>
        <AddTodoForm onAddTodo={addTodo} />
        <TodoList todos={todos} onDelete={deleteTodo} onUpdateStatus={updateTodoStatus} onUpdate={updateTodo} />
      </div>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;