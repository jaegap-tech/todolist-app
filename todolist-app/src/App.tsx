import AddTodoForm from './components/AddTodoForm';
import TodoList from './components/TodoList';
import './App.css';
import { useTodos } from './hooks/useTodos'; // Import useTodos
import { ThemeProvider, useTheme } from './contexts/ThemeContext'; // Import ThemeProvider and useTheme
import styled from 'styled-components'; // Import styled-components
import type { ThemeName } from './styles/themes'; // Import ThemeName as a type

const AppContainer = styled.div`
  background-color: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
  min-height: 100vh;
  padding: 20px;
`;

const ThemeToggleButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  padding: 10px 15px;
  background-color: ${({ theme }) => theme.primary};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background-color: ${({ theme }) => theme.primaryHover};
  }
`;

function AppContent() { // Renamed App to AppContent to use useTheme hook
  const { todos, addTodo, deleteTodo, toggleTodo, updateTodo } = useTodos(); // Use the custom hook
  const { themeName, setTheme } = useTheme(); // Use the useTheme hook

  const handleToggleTheme = () => {
    setTheme(themeName === 'light' ? 'dark' : 'light');
  };

  return (
    <AppContainer>
      <ThemeToggleButton onClick={handleToggleTheme}>
        Switch to {themeName === 'light' ? 'Dark' : 'Light'} Mode
      </ThemeToggleButton>
      <h1>Todo App</h1>
      <AddTodoForm onAddTodo={addTodo} /> {/* Pass addTodo as a prop */}
      <TodoList todos={todos} onDelete={deleteTodo} onToggle={toggleTodo} onUpdate={updateTodo} /> {/* Pass todos, deleteTodo, toggleTodo, and updateTodo as props */}
    </AppContainer>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent /> {/* Render AppContent inside ThemeProvider */}
    </ThemeProvider>
  );
}

export default App;