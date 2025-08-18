import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse } from 'msw';
import { server } from '../mocks/server';
import TaskListPage from './TaskListPage';
import { BrowserRouter } from 'react-router-dom';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{ui}</BrowserRouter>
    </QueryClientProvider>
  );
};

describe('TaskListPage', () => {
  it('タスク一覧がAPIから取得され、正しく表示されること', async () => {
    renderWithProviders(<TaskListPage />);

    expect(screen.getByRole('progressbar')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('モックタスク1')).toBeInTheDocument();
      expect(screen.getByText('モックタスク2')).toBeInTheDocument();
    });
  });

  it('API呼び出しが失敗したときにエラーメッセージが表示されること', async () => {
    server.use(
      http.get('http://localhost:8080/tasks', () => {
        return HttpResponse.json({ message: 'サーバーエラー' }, { status: 500 });
      })
    );
    renderWithProviders(<TaskListPage />);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('タスクの読み込みに失敗しました: Request failed with status code 500');
    });
  });
});