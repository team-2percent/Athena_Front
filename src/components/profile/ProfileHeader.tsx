import ServerErrorComponent from "../common/ServerErrorComponent"

interface ProfileHeaderProps {
  nickname: string
  profileImage: string
  buttons?: React.ReactNode
  isLoading?: boolean
  error?: boolean
  onRetry?: (() => void) | (() => Promise<void>)
}

export default function ProfileHeader({ nickname, profileImage, buttons, isLoading, error, onRetry }: ProfileHeaderProps) {
  if (error) {
    return <ServerErrorComponent message="프로필 정보를 불러오는 중 오류가 발생했습니다." onRetry={onRetry as () => void} />
  }

  return (
    <div className="flex flex-col md:flex-row md:justify-between md:items-start items-center mx-auto mb-12 md:h-36 gap-4 md:gap-0" data-cy="profile-header">
      <div className="flex flex-col md:flex-row items-center md:items-start">
        {/* 프로필 이미지 */}
        <div className={`w-24 h-24 md:w-36 md:h-36 rounded-full bg-gray-200 overflow-hidden md:mr-8 mb-4 md:mb-0 flex-shrink-0 ${isLoading ? 'animate-pulse' : ''}`} data-cy="profile-image">
          {!isLoading && (
            <img
              src={profileImage || "/placeholder/profile-placeholder.png"}
              alt="프로필 이미지"
              className="w-full h-full object-cover"
            />
          )}
        </div>

        {/* 프로필 텍스트 정보 */}
        <div className="flex flex-col justify-center items-center md:items-start h-auto md:h-36">
          {isLoading ? (
            <div className="h-8 md:h-10 w-32 md:w-48 bg-gray-200 rounded animate-pulse" />
          ) : (
            <h1 className="text-xl md:text-3xl font-bold mb-2 md:mb-4" data-cy="profile-nickname">{nickname}</h1>
          )}
        </div>
      </div>

      {/* 팔로우 / 프로필 편집 + 거래 내역 보기 버튼 */}
      <div className="flex flex-col justify-center items-center h-auto md:h-full w-full md:w-auto">
        {isLoading ? (
          <div className="h-10 w-24 md:w-32 bg-gray-200 rounded animate-pulse" />
        ) : (
          buttons
        )}
      </div>
    </div>
  )
}
