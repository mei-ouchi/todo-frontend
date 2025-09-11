import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import TextField from './TextField';

describe('TextField', () => {
  it('ラベルが正しくレンダリングされること', () => {
    const labelText = 'タスクのタイトル';
    render(<TextField label={labelText} />);
    
    // ラベルのテキストが画面に表示されていることを確認
    expect(screen.getByLabelText(labelText)).toBeInTheDocument();
  });

  it('値を入力できること', () => {
    const labelText = 'タスクの説明';
    render(<TextField label={labelText} />);
    const inputElement = screen.getByLabelText(labelText);
    
    // 入力した値が反映されることを確認
    fireEvent.change(inputElement, { target: { value: '新しい説明' } });
    expect(inputElement).toHaveValue('新しい説明');
  });

  it('helperTextがエラー状態で正しく表示されること', () => {
    const helperText = 'このフィールドは必須です';
    render(<TextField label="タイトル" error helperText={helperText} />);
    
    // helperTextが画面に表示されていることを確認
    expect(screen.getByText(helperText)).toBeInTheDocument();
  });

  it('disabledプロパティが設定されたときに無効化されること', () => {
    render(<TextField label="無効なフィールド" disabled />);
    const inputElement = screen.getByLabelText('無効なフィールド');
    
    // フィールドが無効化されていることを確認
    expect(inputElement).toBeDisabled();
  });
});