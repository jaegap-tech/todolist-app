import React from 'react';
import { DUMMY_TODOS } from '../data/todos';
import TodoItem from './TodoItem';

const TodoList = () => {
  return (
    <div>
      <h2>Todo List</h2>
      <ul>
        {DUMMY_TODOS.map(todo => (
          <TodoItem key={todo.id} todo={todo} />
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
