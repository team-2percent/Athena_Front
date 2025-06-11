import type { Meta, StoryObj } from '@storybook/react';
import TopToast from '../components/common/TopToast';
import { Bell, AlertCircle } from 'lucide-react';

const meta: Meta<typeof TopToast> = {
  title: 'Common/TopToast',
  component: TopToast,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof TopToast>;

export const Default: Story = {
  args: {
    title: '알림',
    body: '새로운 메시지가 도착했습니다.',
    duration: 5000,
    onClose: () => console.log('Toast closed'),
  },
};

export const WithCustomIcon: Story = {
  args: {
    title: '경고',
    body: '주의가 필요한 알림입니다.',
    duration: 5000,
    onClose: () => console.log('Toast closed'),
    icon: <AlertCircle className="h-8 w-8 text-white" />,
  },
};

export const LongDuration: Story = {
  args: {
    title: '긴 알림',
    body: '이 알림은 10초 동안 표시됩니다.',
    duration: 10000,
    onClose: () => console.log('Toast closed'),
  },
};

export const CustomClassName: Story = {
  args: {
    title: '커스텀 스타일',
    body: '사용자 정의 클래스가 적용된 알림입니다.',
    duration: 5000,
    onClose: () => console.log('Toast closed'),
    className: 'bg-blue-500',
  },
};
