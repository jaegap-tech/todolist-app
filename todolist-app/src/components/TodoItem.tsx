import React from 'react';
import type { Todo } from '../types/todo';

interface TodoItemProps {
  todo: Todo;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo }) => {
  return (
    <li>
      <input
        type="checkbox"
        checked={todo.completed}
        // onChange will be added in a later task
      />
      <span style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
        {todo.text}
      </span>
    </li>
  );
};

export default TodoItem;
