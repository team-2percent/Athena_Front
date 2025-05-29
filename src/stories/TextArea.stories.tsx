import type { Meta, StoryObj } from "@storybook/nextjs"
import TextArea from "../components/common/TextArea"
import { useState } from "react"
import { z } from "zod"

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
  },
  render: (args) => {
    const [value, setValue] = useState("")
    const [error, setError] = useState("")

    const schema = z.string()
      .min(10, "10자 이상 입력해주세요")
      .max(200, "200자 이내로 입력해주세요")

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = e.target.value
      if (newValue.length > 200) return
      
      setValue(newValue)
      try {
        schema.parse(newValue)
        setError("")
      } catch (error) {
        if (error instanceof z.ZodError) {
          setError(error.errors[0].message)
        }
      }
    }

    return (
      <div className="relative space-y-4">
        <TextArea
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
        <p className="text-xs text-gray-500">현재 글자 수: {value.length}/200</p>
      </div>
    )
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
    const [error, setError] = useState("")

    const schema = z.string()
      .min(1, "내용을 입력해주세요")
      .regex(/^[가-힣\s]+$/, "한글만 입력 가능합니다")

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
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
        <TextArea
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
