import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Button from './Button';

describe('Button', () => {
  it('ラベルが正しくレンダリングされること', () => {
    const labelText = 'クリックしてください';
    render(<Button label={labelText} />);
    
    // ラベルのテキストが画面に表示されていることを確認
    expect(screen.getByText(labelText)).toBeInTheDocument();
  });

  it('ボタンをクリックしたときにonClickが呼び出されること', () => {
    const onClickMock = vi.fn();
    render(<Button label="テストボタン" onClick={onClickMock} />);
    
    // ボタン要素を取得し、クリックイベントを発火
    const buttonElement = screen.getByRole('button', { name: 'テストボタン' });
    fireEvent.click(buttonElement);
    
    // onClickモック関数が1回呼び出されたことを確認
    expect(onClickMock).toHaveBeenCalledTimes(1);
  });

  it('disabledプロパティが設定されたときにボタンが無効化されること', () => {
    const onClickMock = vi.fn();
    render(<Button label="無効なボタン" onClick={onClickMock} disabled />);
    
    // ボタン要素を取得
    const buttonElement = screen.getByRole('button', { name: '無効なボタン' });
    
    // ボタンが無効化されていることを確認
    expect(buttonElement).toBeDisabled();
    
    // 無効化されたボタンをクリックしてもonClickが呼び出されないことを確認
    fireEvent.click(buttonElement);
    expect(onClickMock).not.toHaveBeenCalled();
  });
});