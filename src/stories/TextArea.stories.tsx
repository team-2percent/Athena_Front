import type { Meta, StoryObj } from "@storybook/nextjs"
import TextArea from "../components/common/TextArea"
import { useState } from "react"

const meta = {
  title: "Common/TextArea",
  component: TextArea,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof TextArea>

export default meta
type Story = StoryObj<typeof meta>

// 기본 TextArea 스토리
export const Default: Story = {
  args: {
    value: "",
    onChange: () => {},
    placeholder: "내용을 입력하세요",
  },
  render: (args) => {
    const [value, setValue] = useState("")
    return <TextArea {...args} value={value} onChange={(e) => setValue(e.target.value)} />
  },
}

// 글자 수 제한이 있는 TextArea 스토리
export const WithCharCount: Story = {
  args: {
    value: "",
    onChange: () => {},
    placeholder: "내용을 입력하세요 (최대 200자)",
    showCharCount: true,
    maxLength: 200,
    minLength: 10,
  },
  render: (args) => {
    const [value, setValue] = useState("")
    return <TextArea {...args} value={value} onChange={(e) => setValue(e.target.value)} />
  },
}

// 에러 상태의 TextArea 스토리
export const WithError: Story = {
  args: {
    value: "",
    onChange: () => {},
    placeholder: "에러 상태의 TextArea",
  },
  render: (args) => {
    const [value, setValue] = useState("")
    return <TextArea {...args} value={value} onChange={(e) => setValue(e.target.value)} />
  },
}
