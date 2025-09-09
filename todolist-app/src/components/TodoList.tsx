import React from 'react';
import type { Todo } from '../types/todo';
import TodoItem from './TodoItem';
import styled from 'styled-components';

interface TodoListProps {
  todos: Todo[];
  onDelete: (id: number) => void;
  onToggle: (id: number) => void;
  onUpdate: (id: number, newText: string, newDueDate: string | null, newTags: string[]) => void;
}

const ListContainer = styled.div`
  background-color: ${({ theme }) => theme.cardBackground}; // Use theme.cardBackground
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05); // Keep shadow for now, can be themed later
`;

const Title = styled.h2`
  color: ${({ theme }) => theme.text}; // Use theme.text
  margin-bottom: 15px;
  text-align: center;
`;

const StyledList = styled.ul`
  padding: 0;
  list-style: none;
  li {
    border-bottom: 1px solid ${({ theme }) => theme.border}; // Use theme.border
  }
  li:last-child {
    border-bottom: none;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: ${({ theme }) => theme.emptyState}; // Use theme.emptyState
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
      {todos.length === 0 ? (
        <EmptyState>할 일을 추가해보세요</EmptyState>
      ) : (
        <StyledList>
          {sortedTodos.map(todo => (
            <TodoItem key={todo.id} todo={todo} onDelete={onDelete} onToggle={onToggle} onUpdate={onUpdate} />
          ))}
        </StyledList>
      )}
    </ListContainer>
  );
};

export default TodoList;
