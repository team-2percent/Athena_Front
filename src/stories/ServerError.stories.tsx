import type { Meta, StoryObj } from '@storybook/react';
import ServerErrorComponent from '../components/common/ServerErrorComponent';

const meta: Meta<typeof ServerErrorComponent> = {
  title: 'Common/ServerError',
  component: ServerErrorComponent,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ServerErrorComponent>;

export const Default: Story = {
  args: {
    message: '서버 연결에 실패했습니다.',
    onRetry: () => console.log('Retry clicked'),
  },
};

export const CustomMessage: Story = {
  args: {
    message: '데이터를 불러오는 중 오류가 발생했습니다.',
    onRetry: () => console.log('Retry clicked'),
  },
};
