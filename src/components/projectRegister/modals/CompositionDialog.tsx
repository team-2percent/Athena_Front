import { useState } from "react"
import Modal from "../../common/Modal"
import { PrimaryButton } from "../../common/Button"
import { Plus, Trash2 } from "lucide-react"
import TextArea from "@/components/common/TextArea"

interface CompositionItem {
  id: number
  content: string
}

interface CompositionDialogProps {
  isOpen: boolean
  onClose: () => void
  composition: CompositionItem[]
  onSave: (composition: CompositionItem[]) => void
}

export default function CompositionDialog({ isOpen, onClose, composition, onSave }: CompositionDialogProps) {
  const [items, setItems] = useState<CompositionItem[]>(composition || [])
  const [focusedField, setFocusedField] = useState<string | null>(null)

  const addItem = () => {
    const newId = items.length > 0 ? Math.max(...items.map((item) => item.id)) + 1 : 1
    setItems([...items, { id: newId, content: "" }])
  }
  const removeItem = (id: number) => {
    setItems(items.filter((item) => item.id !== id))
  }
  const updateItem = (id: number, content: string) => {
    setItems(items.map((item) => (item.id === id ? { ...item, content } : item)))
  }
  const handleSave = () => {
    onSave(items)
    onClose()
  }
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="구성 항목 설정"
      size="lg"
      className="max-w-2xl"
      zIndex={100}
    >
      <div className="space-y-2 max-h-[60vh] overflow-y-auto">
        {items.map((item) => (
          <div key={item.id} className="space-y-1">
            <label
              htmlFor={`item-content-${item.id}`}
              className={`text-sm ${focusedField === `item-content-${item.id}` ? "text-secondary-color-dark" : "text-main-color"}`}
            >
              구성 세부 내용 (100자 이하)
            </label>
            <div className="flex flex-row items-center gap-4">
              <TextArea
                value={item.content}
                onChange={(e) => {
                  if (e.target.value.length <= 100) {
                    updateItem(item.id, e.target.value)
                  }
                }}
                placeholder="구성 세부 내용을 입력하세요"
                className="h-24 mt-2 w-full p-2 border-b border-gray-300 focus:outline-none text-lg"
              />
              <button
                type="button"
                onClick={() => removeItem(item.id)}
                className="p-2 text-gray-400 hover:text-red-500 transition-colors flex items-center justify-center"
                aria-label="항목 삭제"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        ))}
        {/* 항목 추가 버튼 */}
        <div
          className="border border-dashed border-gray-300 rounded-xl p-3 flex items-center justify-center cursor-pointer hover:bg-gray-50 h-14"
          onClick={addItem}
        >
          <div className="flex items-center text-gray-500">
            <Plus className="w-5 h-5 mr-2" />
            <span className="text-sm font-medium">구성 항목 추가</span>
          </div>
        </div>
      </div>
      <div className="mt-6 flex justify-end">
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