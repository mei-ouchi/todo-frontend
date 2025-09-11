import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import TaskCard from './TaskCard';
import { TasksDtoStatusEnum } from '../../api';

//`isOverdue`のロジックが現在の時間に基づいて動くため、テストの安定性を保つために日付をモック化
const mockDate = new Date('2025-08-15T10:00:00Z');
vi.useFakeTimers();
vi.setSystemTime(mockDate);

describe('TaskCard', () => {
  it('未完了のタスクが正しくレンダリングされること', () => {
    const task = {
      id: 1,
      title: '未完了タスク',
      description: 'テスト',
      status: TasksDtoStatusEnum.Pending,
      dueDate: '2025-08-20',
    };
    render(<TaskCard task={task} onComplete={() => {}} onDelete={() => {}} onEdit={() => {}} />);

    //タイトルと説明が表示されているか
    expect(screen.getByText('未完了タスク')).toBeInTheDocument();
    expect(screen.getByText('テスト')).toBeInTheDocument();
    //完了ボタンが表示されているか
    expect(screen.getByLabelText('complete')).toBeInTheDocument();
    //完了済みタスクのスタイルが適用されていないか
    expect(screen.getByText('未完了タスク')).not.toHaveStyle('text-decoration: line-through');
  });

  it('完了済みのタスクが正しくレンダリングされること', () => {
    const task = {
      id: 2,
      title: '完了済みタスク',
      description: 'テスト',
      status: TasksDtoStatusEnum.Completed,
      dueDate: '2025-08-10',
    };
    render(<TaskCard task={task} onComplete={() => {}} onDelete={() => {}} onEdit={() => {}} />);

    //タイトルが打ち消し線付きで表示されているか
    expect(screen.getByText('完了済みタスク')).toHaveStyle('text-decoration: line-through');
    //完了ボタンが非表示になっているか
    expect(screen.queryByLabelText('complete')).toBeNull();
  });

  it('期限切れのタスクが正しくレンダリングされること', () => {
    const task = {
      id: 3,
      title: '期限切れタスク',
      description: 'テスト',
      status: TasksDtoStatusEnum.Pending,
      dueDate: '2025-08-10',
    };
    render(<TaskCard task={task} onComplete={() => {}} onDelete={() => {}} onEdit={() => {}} />);

    //期限切れのスタイル(オレンジ色の枠線)が適用されているか
    const cardElement = screen.getByText('期限切れタスク').closest('.MuiCard-root');
    expect(cardElement).toHaveStyle('border: 1px solid orange');
  });

  it('完了ボタンをクリックしたときにonCompleteが呼び出されること', () => {
    const onCompleteMock = vi.fn();
    const task = {
      id: 1,
      title: '未完了タスク',
      status: TasksDtoStatusEnum.Pending,
      dueDate: '2025-08-20',
    };
    render(<TaskCard task={task} onComplete={onCompleteMock} onDelete={() => {}} onEdit={() => {}} />);

    const completeButton = screen.getByLabelText('complete');
    fireEvent.click(completeButton);

    expect(onCompleteMock).toHaveBeenCalledWith(1);
  });
});