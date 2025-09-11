import React from 'react';
import type { Todo } from '../types/todo';
import TodoItem from './TodoItem';

interface TodoListProps {
  todos: Todo[];
  onDelete: (id: number) => void;
  onUpdateStatus: (id: number, status: 'todo' | 'inProgress' | 'blocked' | 'done') => void;
  onUpdate: (id: number, newText: string, newDueDate: string | null, newTags: string[]) => void;
  onToggleFlag: (id: number) => void;
}

const TodoList: React.FC<TodoListProps> = ({ todos, onDelete, onUpdateStatus, onUpdate, onToggleFlag }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md mt-6">
      <h2 className="text-2xl font-bold text-center mb-4 text-gray-800 dark:text-white">
        Todo List
      </h2>
      {todos.length === 0 ? (
        <div className="text-center py-10 px-5 text-gray-500 dark:text-gray-400">
          할 일을 추가해보세요
        </div>
      ) : (
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {todos.map(todo => (
            <TodoItem key={todo.id} todo={todo} onDelete={onDelete} onUpdateStatus={onUpdateStatus} onUpdate={onUpdate} onToggleFlag={onToggleFlag} />
          ))}
        </ul>
      )}
    </div>
  );
};

export default TodoList;