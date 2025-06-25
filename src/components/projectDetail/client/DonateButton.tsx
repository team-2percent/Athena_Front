"use client"

import { PrimaryButton } from "../../common/Button"

interface DonateButtonProps {
  canDonate: boolean
}

const DonateButton = ({ canDonate }: DonateButtonProps) => {
  const handleDonate = () => {
    const event = new CustomEvent("toggleDonateDock")
    window.dispatchEvent(event)
  }
  return canDonate ? (
    <PrimaryButton
      className="w-full md:w-2/3 rounded-xl bg-main-color px-4 md:px-8 py-3 md:py-4 text-base md:text-xl font-bold text-white hover:bg-secondary-color-dark"
      onClick={handleDonate}
    >
      후원하기
    </PrimaryButton>
  ) : (
    <PrimaryButton
      className="w-full md:w-2/3 rounded-xl px-4 md:px-8 py-3 md:py-4 text-base md:text-xl font-bold"
      disabled
      data-cy="donate-disabled"
    >
      후원 불가
    </PrimaryButton>
  )
}

export default DonateButton 