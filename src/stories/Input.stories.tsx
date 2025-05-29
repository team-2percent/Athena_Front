import type { Meta, StoryObj } from "@storybook/nextjs"
import { Input, TextInput, NumberInput, PasswordInput, EmailInput } from "../components/common/Input"
import { z } from "zod"
import { useState } from "react"

const meta = {
  title: "Common/Input",
  component: Input,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

// 기본 Input 스토리
export const Default: Story = {
  args: {
    type: "text",
    value: "",
    onChange: () => {},
    placeholder: "기본 입력",
  },
  render: (args) => {
    const [value, setValue] = useState("")
    return <Input {...args} value={value} onChange={(e) => setValue(e.target.value)} />
  },
}

// TextInput 스토리 (minLength, maxLength)
export const TextInputWithValidation: Story = {
  args: {
    type: "text",
    value: "",
    onChange: () => {},
    placeholder: "제목을 입력하세요 (1-10자)",
    showCharCount: true,
    minLength: 1,
    maxLength: 10,
    designType: "outline",
  },
  render: (args) => {
    const [value, setValue] = useState("")
    return (
      <div className="space-y-4">
        <TextInput
          {...args}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </div>
    )
  },
}

// NumberInput 스토리 (minNumber, maxNumber)
export const NumberInputWithValidation: Story = {
  args: {
    type: "number",
    value: 1,
    onChange: () => {},
    placeholder: "0-1,000,000 사이의 숫자",
    minNumber: 1,
    maxNumber: 1000000,
    designType: "outline",
  },
  render: (args) => {
    const [value, setValue] = useState(args.value)
    return (
      <div className="space-y-4">
        <NumberInput
          {...args}
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
        />
      </div>
    )
  },
}

// PasswordInput 스토리 (minLength, maxLength)
export const PasswordInputWithValidation: Story = {
  args: {
    type: "password",
    value: "",
    onChange: () => {},
    placeholder: "비밀번호를 입력하세요",
    minLength: 8,
    maxLength: 20,
    designType: "underline",
  },
  render: (args) => {
    const [value, setValue] = useState("")
    return (
      <PasswordInput
        {...args}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    )
  },
}

// EmailInput 스토리 (maxLength)
export const EmailInputWithValidation: Story = {
  args: {
    type: "text",
    value: "",
    onChange: () => {},
    placeholder: "이메일을 입력하세요",
    maxLength: 50,
    designType: "underline",
  },
  render: (args) => {
    const [value, setValue] = useState("")
    return (
      <div className="space-y-4">
        <EmailInput
          {...args}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </div>
    )
  },
}