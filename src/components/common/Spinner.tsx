export default function Spinner({ message }: { message: string }) {
    return (
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-secondary-color border-t-main-color rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">{message}</p>
        </div>
    )
}