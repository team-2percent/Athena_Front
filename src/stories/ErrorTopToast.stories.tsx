import type { Meta, StoryObj } from '@storybook/react'
import ErrorTopToast from '../components/common/ErrorTopToast'

const meta: Meta<typeof ErrorTopToast> = {
    title: 'Common/ErrorTopToast',
    component: ErrorTopToast,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof ErrorTopToast>

export const Default: Story = {
    args: {
        title: '에러 발생',
        body: '작업 중 오류가 발생했습니다.',
        duration: 5000,
    },
}

export const LongMessage: Story = {
    args: {
        title: '시스템 오류',
        body: '서버와의 통신 중 예기치 않은 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.',
        duration: 5000,
    },
}

export const ShortDuration: Story = {
    args: {
        title: '빠른 알림',
        body: '작업이 완료되었습니다.',
        duration: 2000,
    },
}
