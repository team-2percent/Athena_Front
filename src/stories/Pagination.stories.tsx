import type { Meta, StoryObj } from "@storybook/react"
import Pagination from "@/components/common/Pagination"

const meta: Meta<typeof Pagination> = {
  title: "Common/Pagination",
  component: Pagination,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof Pagination>

export const Default: Story = {
  args: {
    totalPages: 10,
    currentPage: 0,
    onPageChange: (page) => console.log("페이지 변경:", page),
  },
}

export const FewPages: Story = {
  args: {
    totalPages: 3,
    currentPage: 0,
    onPageChange: (page) => console.log("페이지 변경:", page),
  },
}

export const MiddlePage: Story = {
  args: {
    totalPages: 10,
    currentPage: 4,
    onPageChange: (page) => console.log("페이지 변경:", page),
  },
}

export const LastPage: Story = {
  args: {
    totalPages: 10,
    currentPage: 9,
    onPageChange: (page) => console.log("페이지 변경:", page),
  },
}

export const LargePageCount: Story = {
  args: {
    totalPages: 10000,
    currentPage: 4999,
    onPageChange: (page) => console.log("페이지 변경:", page),
  },
}

export const LargePageCountStart: Story = {
  args: {
    totalPages: 10000,
    currentPage: 0,
    onPageChange: (page) => console.log("페이지 변경:", page),
  },
}

export const LargePageCountEnd: Story = {
  args: {
    totalPages: 10000,
    currentPage: 9999,
    onPageChange: (page) => console.log("페이지 변경:", page),
  },
}
