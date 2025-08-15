import type { Meta, StoryObj } from '@storybook/react-vite';
import PageLayout from './PageLayout';
import { Typography, Box } from '@mui/material';

const meta: Meta<typeof PageLayout> = {
  title: 'Templates/PageLayout',
  component: PageLayout,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// デフォルトのページレイアウト
export const Default: Story = {
  args: {
    children: (
      <Box sx={{ p: 2 }}>
        <Typography variant="h4">タスク一覧</Typography>
      </Box>
    ),
  },
};