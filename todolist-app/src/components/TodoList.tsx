import React from 'react';
import { DUMMY_TODOS } from '../data/todos';
import TodoItem from './TodoItem';

const TodoList = () => {
  // Create a mutable copy for sorting
  const sortedTodos = [...DUMMY_TODOS].sort((a, b) => {
    // Incomplete todos (false) come before completed todos (true)
    // So, if a is completed and b is not, a comes after b (return 1)
    // If a is not completed and b is completed, a comes before b (return -1)
    // If both have the same completed status, maintain original order (return 0)
    if (a.completed && !b.completed) {
      return 1;
    }
    if (!a.completed && b.completed) {
      return -1;
    }
    return 0;
  });

  return (
    <div>
      <h2>Todo List</h2>
      <ul>
        {sortedTodos.map(todo => (
          <TodoItem key={todo.id} todo={todo} />
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
