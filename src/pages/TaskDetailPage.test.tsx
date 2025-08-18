import { render, screen, waitFor, act, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse } from 'msw';
import { server } from '../mocks/server';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import TaskDetailPage from './TaskDetailPage';
import { TasksDtoStatusEnum } from '../api';
import type { TasksDto } from '../api';
import TaskListPage from './TaskListPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const renderWithProviders = (ui: React.ReactElement, initialEntries: string[]) => {
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={initialEntries}>
        <Routes>
          <Route path="/tasks/:id" element={ui} />
          <Route path="/" element={<TaskListPage />} /> {/* ルートを追加 */}
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  );
};

describe('TaskDetailPage', () => {
  it('特定のタスクがAPIから取得され、フォームに正しく表示されること', async () => {
    //正常系レスポンスのモック
    const mockTask: TasksDto = {
      id: 1,
      title: 'テストタスク',
      description: '詳細なテスト',
      status: TasksDtoStatusEnum.Pending,
      dueDate: '2025-09-01',
    };
    server.use(
      http.get('http://localhost:8080/tasks/1', () => {
        return HttpResponse.json(mockTask);
      })
    );

    renderWithProviders(<TaskDetailPage />, ['/tasks/1']);

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByLabelText('タイトル')).toHaveValue('テストタスク');
      expect(screen.getByLabelText('説明')).toHaveValue('詳細なテスト');
    });
  });

  it('タスクが見つからないときにエラーメッセージが表示されること', async () => {
    //タスクが見つからないレスポンスのモック
    server.use(
      http.get('http://localhost:8080/tasks/999', () => {
        return HttpResponse.json({ message: 'Task not found' }, { status: 404 });
      })
    );

    renderWithProviders(<TaskDetailPage />, ['/tasks/999']);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('タスクの読み込みに失敗しました: 指定されたタスクIDは見つかりませんでした。');
    });
  });

  it('フォームが更新されたときにAPIが呼び出されること', async () => {
    //正常系レスポンスのモック
    const mockTask: TasksDto = {
      id: 1,
      title: 'テストタスク',
      description: '詳細なテスト',
      status: TasksDtoStatusEnum.Pending,
      dueDate: '2025-09-01',
    };
    server.use(
      http.get('http://localhost:8080/tasks/1', () => {
        return HttpResponse.json(mockTask);
      }),
      http.put('http://localhost:8080/tasks/1', async ({ request }) => {
        const updatedTask = (await request.json()) as TasksDto; 
                expect(updatedTask.title).toBe('更新済みタイトル');

        return HttpResponse.json({ ...mockTask, ...updatedTask });
    })
    );
    
    renderWithProviders(<TaskDetailPage />, ['/tasks/1']);

    await waitFor(() => {
      expect(screen.getByLabelText('タイトル')).toBeInTheDocument();
    });

    //フォームの値を更新
    const titleInput = screen.getByLabelText('タイトル');
    await act(async () => {
        fireEvent.change(titleInput, { target: { value: '更新済みタイトル' } });
        fireEvent.click(screen.getByRole('button', { name: '保存' }));
    });
  });
});