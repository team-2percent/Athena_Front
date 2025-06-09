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

// TextInput 스토리 (유효성 검증)
export const TextInputWithValidation: Story = {
  args: {
    type: "text",
    value: "",
    onChange: () => {},
    placeholder: "한글만 입력 가능 (2-10자)",
    designType: "outline-rect",
  },
  render: (args) => {
    const [value, setValue] = useState("")
    const [error, setError] = useState("")

    const schema = z.string()
      .min(2, "2자 이상 입력해주세요")
      .max(10, "10자 이내로 입력해주세요")
      .regex(/^[가-힣]+$/, "한글만 입력 가능합니다")

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value)
      try {
        schema.parse(e.target.value)
        setError("")
      } catch (error) {
        if (error instanceof z.ZodError) {
          setError(error.errors[0].message)
        }
      }
    }

    return (
      <div className="relative space-y-4">
        <TextInput
          {...args}
          value={value}
          onChange={handleChange}
          isError={!!error}
        />
        {error && (
          <p className="absolute mt-1 ml-1 text-xs text-red-500">
            {error}
          </p>
        )}
      </div>
    )
  },
}

// NumberInput 스토리 (유효성 검증)
export const NumberInputWithValidation: Story = {
  args: {
    type: "number",
    value: 0,
    onChange: () => {},
    placeholder: "0-100 사이의 숫자",
    designType: "outline-rect",
    isError: true,
  },
  render: (args) => {
    const [value, setValue] = useState("0")
    const [error, setError] = useState("")

    const schema = z.number()
      .min(0, "0 이상의 숫자를 입력해주세요")
      .max(100, "100 이하의 숫자를 입력해주세요")

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value)
      try {
        schema.parse(Number(e.target.value))
        setError("")
      } catch (error) {
        if (error instanceof z.ZodError) {
          setError(error.errors[0].message)
        }
      }
    }

    return (
      <div className="relative space-y-4">
        <NumberInput
          {...args}
          value={value}
          onChange={handleChange}
          isError={!!error}
        />
        {error && (
          <p className="absolute mt-1 ml-1 text-xs text-red-500">
            {error}
          </p>
        )}
      </div>
    )
  },
}

// PasswordInput 스토리 (유효성 검증)
export const PasswordInputWithValidation: Story = {
  args: {
    type: "password",
    value: "",
    onChange: () => {},
    placeholder: "비밀번호를 입력하세요",
    designType: "underline",
  },
  render: (args) => {
    const [value, setValue] = useState("")
    const [error, setError] = useState("")

    const schema = z.string()
      .min(8, "비밀번호는 8자 이상이어야 합니다")
      .regex(/[A-Z]/, "대문자를 포함해야 합니다")
      .regex(/[a-z]/, "소문자를 포함해야 합니다")
      .regex(/[0-9]/, "숫자를 포함해야 합니다")
      .regex(/[^A-Za-z0-9]/, "특수문자를 포함해야 합니다")

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value)
      try {
        schema.parse(e.target.value)
        setError("")
      } catch (error) {
        if (error instanceof z.ZodError) {
          setError(error.errors[0].message)
        }
      }
    }

    return (
      <div className="relative space-y-4">
        <PasswordInput
          {...args}
          value={value}
          onChange={handleChange}
          isError={!!error}
        />
        {error && (
          <p className="absolute mt-1 ml-1 text-xs text-red-500">
            {error}
          </p>
        )}
      </div>
    )
  },
}

// EmailInput 스토리 (유효성 검증)
export const EmailInputWithValidation: Story = {
  args: {
    type: "email",
    value: "",
    onChange: () => {},
    placeholder: "이메일을 입력하세요",
    designType: "underline",
  },
  render: (args) => {
    const [value, setValue] = useState("")
    const [error, setError] = useState("")

    const schema = z.string()
      .email("올바른 이메일 형식이 아닙니다")
      .max(50, "50자 이내로 입력해주세요")

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value)
      try {
        schema.parse(e.target.value)
        setError("")
      } catch (error) {
        if (error instanceof z.ZodError) {
          setError(error.errors[0].message)
        }
      }
    }

    return (
      <div className="relative space-y-4">
        <EmailInput
          {...args}
          value={value}
          onChange={handleChange}
          isError={!!error}
        />
        {error && (
          <p className="absolute mt-1 ml-1 text-xs text-red-500">
            {error}
          </p>
        )}
      </div>
    )
  },
}