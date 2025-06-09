import { useState } from "react"
import Modal from "../../common/Modal"
import { PrimaryButton } from "../../common/Button"

interface ScheduleDetailsDialogProps {
  isOpen: boolean
  onClose: () => void
  details: string
  onSave: (details: string) => void
  scheduleIndex: number
}

export default function ScheduleDetailsDialog({ isOpen, onClose, details, onSave, scheduleIndex }: ScheduleDetailsDialogProps) {
  const [content, setContent] = useState(details || "")
  const [focusedField, setFocusedField] = useState<boolean>(false)

  const handleSave = () => {
    onSave(content)
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`일정 ${scheduleIndex + 1} 상세 내용`}
      size="lg"
      className="max-w-2xl"
      zIndex={100}
    >
      <div className="mb-6">
        <label
          htmlFor="schedule-details"
          className={`block text-sm mb-2 ${focusedField ? "text-secondary-color-dark" : "text-main-color"}`}
        >
          일정 상세 내용
        </label>
        <input
          id="schedule-details"
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="이 일정에 대한 상세 내용을 입력하세요"
          className={`w-full p-4 border rounded-xl ${focusedField ? "border-secondary-color-dark" : "border-gray-300"} focus:outline-none`}
          onFocus={() => setFocusedField(true)}
          onBlur={() => setFocusedField(false)}
        />
        <p className="text-sm text-gray-500 mt-2">* 간단하게 입력해주세요. 줄바꿈은 불가능합니다.</p>
      </div>
      <div className="flex justify-end">
        <PrimaryButton
          type="button"
          onClick={handleSave}
          className="bg-main-color text-white font-bold py-2 px-6 rounded-full"
        >
          저장
        </PrimaryButton>
      </div>
    </Modal>
  )
} 