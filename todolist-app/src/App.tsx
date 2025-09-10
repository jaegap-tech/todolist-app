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

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const Title = styled.h1`
  margin-bottom: 0;
`;

const ThemeToggleButton = styled.button`
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
  const { todos, addTodo, deleteTodo, updateTodoStatus, updateTodo } = useTodos(); // Use the custom hook
  const { themeName, setTheme } = useTheme(); // Use the useTheme hook

  const handleToggleTheme = () => {
    setTheme(themeName === 'light' ? 'dark' : 'light');
  };

  return (
    <AppContainer>
      <HeaderContainer>
        <Title>Todo App</Title>
        <ThemeToggleButton onClick={handleToggleTheme}>
          Switch to {themeName === 'light' ? 'Dark' : 'Light'} Mode
        </ThemeToggleButton>
      </HeaderContainer>
      <AddTodoForm onAddTodo={addTodo} /> {/* Pass addTodo as a prop */}
      <TodoList todos={todos} onDelete={deleteTodo} onUpdateStatus={updateTodoStatus} onUpdate={updateTodo} /> {/* Pass todos, deleteTodo, updateTodoStatus, and updateTodo as props */}
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
