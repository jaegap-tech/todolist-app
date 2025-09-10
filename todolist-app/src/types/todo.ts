export interface Todo {
  id: number;
  text: string;
  status: 'todo' | 'inProgress' | 'blocked' | 'done';
  dueDate: string | null;
  tags: string[];
}
