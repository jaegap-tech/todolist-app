import React, { useState } from 'react';
import type { Todo } from '../types/todo';

interface EditTodoFormProps {
  todo: Todo;
  onSave: (id: number, newText: string) => void; // Callback for saving
}

const EditTodoForm: React.FC<EditTodoFormProps> = ({ todo, onSave }) => {
  const [text, setText] = useState(todo.text);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    console.log('Updated Todo:', todo.id, text);
    onSave(todo.id, text); // Call the callback
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button type="submit">Save</button>
    </form>
  );
};

export default EditTodoForm;
