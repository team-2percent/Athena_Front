"use client"
import ServerErrorComponent from "./ServerErrorComponent"

export default function ErrorRetryWrapper({ message }: { message: string }) {
  return (
    <ServerErrorComponent
      message={message}
      onRetry={() => window.location.reload()}
    />
  )
} 