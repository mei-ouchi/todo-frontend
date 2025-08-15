import type { Meta, StoryObj } from '@storybook/react-vite';
import Button from './Button';

//メタデータ(コンポーネントの基本情報)
const meta: Meta<typeof Button> = {
  title: 'Atoms/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    variant: { control: 'select', options: ['contained', 'outlined', 'text'] },
    color: { control: 'select', options: ['primary', 'secondary', 'error'] },
    disabled: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

//デフォルトのボタン
export const Default: Story = {
  args: {
    label: 'ボタン',
    variant: 'contained',
    color: 'primary',
  },
};

//別な状態のボタン(無効なボタン)
export const Disabled: Story = {
  args: {
    label: '無効なボタン',
    variant: 'contained',
    disabled: true,
  },
};