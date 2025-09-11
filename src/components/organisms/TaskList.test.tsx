import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import TaskList from './TaskList';
import { TasksDtoStatusEnum } from '../../api';
import type { TasksDto } from '../../api';

describe('TaskList', () => {
  // 複数のタスクがある場合のテスト
  it('複数のタスクが正しく表示されること', () => {
    const tasks: TasksDto[] = [
      {
        id: 1,
        title: 'タスク1',
        description: '説明1',
        status: TasksDtoStatusEnum.Pending,
        dueDate: '2025-08-20',
      },
      {
        id: 2,
        title: 'タスク2',
        description: '説明2',
        status: TasksDtoStatusEnum.Completed,
        dueDate: '2025-08-15',
      },
    ];

    render(<TaskList tasks={tasks} onComplete={() => {}} onDelete={() => {}} onEdit={() => {}} />);

    // すべてのタスクのタイトルが表示されていることを確認
    expect(screen.getByText('タスク1')).toBeInTheDocument();
    expect(screen.getByText('タスク2')).toBeInTheDocument();
    // すべてのタスクの完了ボタンが表示されていることを確認
    expect(screen.getAllByLabelText('complete').length).toBe(1);
    // すべてのタスクの編集・削除ボタンが表示されていることを確認
    expect(screen.getAllByLabelText('edit').length).toBe(2);
    expect(screen.getAllByLabelText('delete').length).toBe(2);
  });

  // タスクが一つもない場合のテスト
  it('タスクがない場合にメッセージが表示されること', () => {
    const tasks: TasksDto[] = [];

    render(<TaskList tasks={tasks} onComplete={() => {}} onDelete={() => {}} onEdit={() => {}} />);

    // 「タスクはありません」というメッセージが表示されていることを確認
    expect(screen.getByText('タスクはありません')).toBeInTheDocument();
  });
  
  // onCompleteイベントが正しく伝播することのテスト
  it('タスクの完了ボタンをクリックしたときにonCompleteが呼び出されること', () => {
    const onCompleteMock = vi.fn();
    const tasks: TasksDto[] = [
      {
        id: 1,
        title: 'タスク1',
        status: TasksDtoStatusEnum.Pending,
        dueDate: '2025-08-20',
      },
    ];

    render(<TaskList tasks={tasks} onComplete={onCompleteMock} onDelete={() => {}} onEdit={() => {}} />);
    
    // 完了ボタンをクリック
    const completeButton = screen.getByLabelText('complete');
    fireEvent.click(completeButton);

    // モック関数が正しいIDで呼び出されたことを確認
    expect(onCompleteMock).toHaveBeenCalledWith(1);
  });
});