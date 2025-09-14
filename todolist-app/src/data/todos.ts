import type { Todo } from '../types/todo';

export const DUMMY_TODOS: Todo[] = [
  { id: 1, text: 'React 공부하기', status: 'done', dueDate: null, tags: [], flagged: false },
  { id: 2, text: 'TypeScript 공부하기', status: 'todo', dueDate: null, tags: [], flagged: false },
  { id: 3, text: 'Gemini CLI 사용해보기', status: 'todo', dueDate: null, tags: [], flagged: false },
];
