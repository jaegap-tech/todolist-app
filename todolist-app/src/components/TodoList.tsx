import React from 'react';
import type { Todo } from '../types/todo';
import TodoItem from './TodoItem';
import styled from 'styled-components';

interface TodoListProps {
  todos: Todo[];
  onDelete: (id: number) => void;
  onToggle: (id: number) => void;
  onUpdate: (id: number, newText: string) => void;
}

const ListContainer = styled.div`
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
`;

const Title = styled.h2`
  color: #333;
  margin-bottom: 15px;
  text-align: center;
`;

const StyledList = styled.ul`
  padding: 0;
  li:not(:first-child) { /* Apply border-top to all li except the first one */
    border-top: 1px solid #eee;
  }
`;

const TodoList: React.FC<TodoListProps> = ({ todos, onDelete, onToggle, onUpdate }) => {
  // Create a mutable copy for sorting
  const sortedTodos = [...todos].sort((a, b) => {
    if (a.completed && !b.completed) {
      return 1;
    }
    if (!a.completed && b.completed) {
      return -1;
    }
    return 0;
  });

  return (
    <ListContainer>
      <Title>Todo List</Title>
      <StyledList>
        {sortedTodos.map(todo => (
          <TodoItem key={todo.id} todo={todo} onDelete={onDelete} onToggle={onToggle} onUpdate={onUpdate} />
        ))}
      </StyledList>
    </ListContainer>
  );
};

export default TodoList;
