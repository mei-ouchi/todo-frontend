import { http, HttpResponse } from 'msw';
import { TasksDtoStatusEnum } from '../api';
import type { TasksDto } from '../api';

const tasks: TasksDto[] = [
  {
    id: 1,
    title: 'モックタスク1',
    description: 'モックデータの説明',
    status: TasksDtoStatusEnum.Pending,
    dueDate: '2025-10-01',
  },
  {
    id: 2,
    title: 'モックタスク2',
    description: '完了済みモック',
    status: TasksDtoStatusEnum.Completed,
    dueDate: '2025-09-15',
  },
];

export const handlers = [
  //タスク一覧を取得するAPIのモック
  http.get('http://localhost:8080/tasks', () => {
    return HttpResponse.json(tasks);
  }),
  //特定のタスクを取得するAPIのモック
  http.get('http://localhost:8080/tasks/:id', ({ params }) => {
    const { id } = params;
    const task = tasks.find((t) => t.id === Number(id));
    if (task) {
      return HttpResponse.json(task);
    } else {
      return HttpResponse.json({ message: 'Task not found' }, { status: 404 });
    }
  }),
];