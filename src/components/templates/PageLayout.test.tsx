import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import PageLayout from './PageLayout';

describe('PageLayout', () => {
  it('ヘッダーと子要素が正しくレンダリングされること', () => {
    const pageTitle = 'TODOリスト';
    const childrenText = 'ここにページコンテンツが入ります。';

    render(
      <PageLayout>
        <h1>{childrenText}</h1>
      </PageLayout>
    );

    expect(screen.getByText(pageTitle)).toBeInTheDocument();
    expect(screen.getByText(childrenText)).toBeInTheDocument();
  });
});