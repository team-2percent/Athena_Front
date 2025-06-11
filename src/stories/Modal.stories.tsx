import type { Meta, StoryObj } from "@storybook/react"
import Modal from "../components/common/Modal"

const meta: Meta<typeof Modal> = {
  title: "Common/Modal",
  component: Modal,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof Modal>

export const Default: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
    title: "기본 모달",
    children: <div>기본적인 모달 내용입니다.</div>,
  },
}

export const SmallContent: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
    title: "작은 내용",
    size: "sm",
    children: <div>매우 짧은 내용</div>,
  },
}

export const LargeContent: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
    title: "긴 내용",
    size: "lg",
    children: (
      <div className="space-y-4">
        <p>이것은 매우 긴 내용을 포함하는 모달입니다.</p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
          Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </p>
        <p>
          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
          Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </p>
      </div>
    ),
  },
}

export const FullSize: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
    title: "전체 크기 모달",
    size: "full",
    children: (
      <div className="h-[80vh] flex items-center justify-center">
        <p>전체 화면 크기의 모달입니다.</p>
      </div>
    ),
  },
}

export const WithoutTitle: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
    showCloseButton: true,
    children: <div>제목 없는 모달입니다.</div>,
  },
}

export const WithoutCloseButton: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
    title: "닫기 버튼 없음",
    showCloseButton: false,
    children: <div>닫기 버튼이 없는 모달입니다.</div>,
  },
}

export const CustomZIndex: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
    title: "커스텀 z-index",
    zIndex: 100,
    children: <div>z-index가 100으로 설정된 모달입니다.</div>,
  },
}
