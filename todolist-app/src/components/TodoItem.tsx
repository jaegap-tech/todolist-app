import React from 'react';
import type { Todo } from '../types/todo';

interface TodoItemProps {
  todo: Todo;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo }) => {
  return (
    <li>
      {todo.text}
    </li>
  );
};

export default TodoItem;
