"use client"

import { useEffect, useState, useRef } from "react"
import Link from "next/link"
import { Percent, X, LogOut, User, UserLock, Menu } from "lucide-react"
import CouponModal from "./CouponModal"
import SearchBar from "./SearchBar"
import { useRouter } from 'next/navigation';
import LoginModal from "../login/LoginModal"
import SignupModal from "../login/SignUpModal"
import useAuthStore from "@/stores/auth"
import { usePathname } from 'next/navigation';
import { useApi } from "@/hooks/useApi";
import MenuTab from "../common/MenuTab"
import useToastStore from "@/stores/useToastStore";
import { GhostButton, GhostPrimaryButton } from "../common/Button"

const nameToPath: Record<string, string> = {
  "전체": "",
  "카테고리": "category",
  "신규": "new",
  "마감임박": "deadline",
}

const pathToName = Object.fromEntries(
  Object.entries(nameToPath).map(([k, v]) => [v, k])
) as Record<string, keyof typeof nameToPath>;

interface HeaderResponse {
  id: number
  nickname: string
  imageUrl: string
}

const Header = () => {
  const { isLoggedIn, role, logout, userId } = useAuthStore();
  const isAdmin = role === "ROLE_ADMIN";
  const { isLoading, apiCall } = useApi();
  const [user, setUser] = useState<{nickname: string, imageUrl: string} | null>(null);
  const [userLoadError, setUserLoadError] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [showCouponModal, setShowCouponModal] = useState(false)
  const [searchWord, setSearchWord] = useState("");
  const [showAuthMenu, setShowAuthMenu] = useState(false);
  const authMenuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const pathFirst = pathname.split("/")[1];
  const activeTab = pathToName[pathFirst]
  const showUnderline = (
    pathname === "/" ||
    pathname === "/category" ||
    pathname === "/new" ||
    pathname === "/deadline"
  );
  const { showToast } = useToastStore();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [sidebarAnim, setSidebarAnim] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (authMenuRef.current && !authMenuRef.current.contains(event.target as Node)) {
        setShowAuthMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (showMobileMenu) {
      setIsSidebarVisible(true);
      setTimeout(() => setSidebarAnim(true), 10);
    } else {
      setSidebarAnim(false);
    }
  }, [showMobileMenu]);

  const handleSidebarClose = () => setShowMobileMenu(false);
  const handleSidebarTransitionEnd = () => {
    if (!sidebarAnim) setIsSidebarVisible(false);
  };

  // 로그인 모달 열기 / 닫기
  const openLoginModal = () => {
    setShowLoginModal(true)
  }

  const closeLoginModal = () => {
    setShowLoginModal(false)
  }

  const openSignupModalInLoginModal = () => {
    setShowLoginModal(false)
    setShowSignupModal(true)
  }

  // 회원가입 모달 열기 / 닫기
  const openSignupModal = () => {
    setShowSignupModal(true)
  }

  const closeSignupModal = () => {
    setShowSignupModal(false)
  }

  const handleSearchChange = (word: string) => {
    setSearchWord(word)
  }

  const moveToSearchPage = (word: string) => {
    if (word) {
      router.push(`/search?query=${word}`);
    }
  }

  const handleTabClick = (tab: string) => {
    if (tab === "전체") router.push("/")
    else if (tab === "카테고리") router.push(`/category`)
    else if (tab === "신규") router.push("/new")
    else if (tab === "마감임박") router.push("/deadline")

    setSearchWord("")
  }

  const handleCouponClick = () => {
    setShowCouponModal(!showCouponModal)
  }

  const handleProfileClick = () => {
    setShowAuthMenu(!showAuthMenu)
  }

  // 유저 정보 조회
  const loadUserInfo = () => {
    setUserLoadError(false);
    apiCall<HeaderResponse>("/api/user/Header", "GET").then(({ data, error }) => {
      if (error) {
        setUserLoadError(true)
      } else if (data !== null) setUser({
        nickname: data.nickname,
        imageUrl: data.imageUrl,
      })
    })
  }

  // 로그아웃
  const handleLogout = () => {
    apiCall("/api/user/logout", "POST").then(() => {
      setShowAuthMenu(false)
      logout()
      router.push("/")
    })
  }

  const handleClickMyPage = () => {
    router.push("/my")
    setShowAuthMenu(false)
  }

  const handleTestToast = () => {
    showToast("테스트 알림", "이것은 토스트 테스트 메시지입니다.")
  }

  const notifications = [
    {
      id: 1,
      message: "가작가님의 새로운 작품이 공개되었습니다! 지금 바로 확인해보세요.",
      date: "2025-04-25",
      profileImage: "/abstract-profile.png",
    },
    {
      id: 2,
      message: "가작가님의 새로운 작품이 공개되었습니다! 지금 바로 확인해보세요.",
      date: "2025-04-25",
      profileImage: "/abstract-profile.png",
    },
    {
      id: 3,
      message: "가작가님의 새로운 작품이 공개되었습니다! 지금 바로 확인해보세요.",
      date: "2025-04-25",
      profileImage: "/abstract-profile.png",
    },
  ]

  useEffect(() => {
    if (isLoggedIn) loadUserInfo();
  }, [isLoggedIn])

  // 모달 뒷배경 스크롤 방지
  useEffect(() => {
    if (showLoginModal || showSignupModal || showCouponModal) {
      // 모달이 열릴 때 body 스크롤 방지
      document.body.style.overflow = "hidden"
    }

    return () => {
      // 모달이 닫힐 때 body 스크롤 복원
      document.body.style.overflow = ""
    }
  }, [showLoginModal, showSignupModal, showCouponModal])

  return (
    <header className="w-full bg-white shadow-[0_4px_4px_-2px_rgba(0,0,0,0.1)] z-5">
      {/* 모바일 헤더 (md 미만) */}
      <div className="flex items-center justify-between px-4 py-2 md:hidden">
        {/* 로고 */}
        <Link href="/" className="flex items-center" data-cy="logo-link">
            <div className="w-10 h-10 overflow-hidden">
              <img src="/src/athenna_logo.png" alt="Athenna 로고" className="h-10 w-auto object-cover" />
            </div>
        </Link>
        {/* 햄버거 메뉴 */}
        <button onClick={() => setShowMobileMenu(true)} aria-label="메뉴 열기">
          <Menu className="w-8 h-8 text-gray-700" />
        </button>
      </div>

      {/* 데스크톱 헤더 (md 이상) */}
      <div className="container mx-auto px-4 py-4 hidden md:block">
        {/* 상단 헤더 영역 */}
        <div className="flex items-center justify-between">
          {/* 로고와 검색창 */}
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center">
              <div className="w-10 h-10 overflow-hidden" data-cy="logo-link">
                <img src="/src/athenna_logo.png" alt="Athenna 로고" className="h-10 w-auto object-cover" />
              </div>
            </Link>
          </div>
          {/* 검색창 및 우측 아이콘 및 프로필 */}
          <div className="flex items-center space-x-6">
            <SearchBar
              isLogin={isLoggedIn}
              searchWord={searchWord}
              onSearchChange={handleSearchChange}
              onSearch={(word) => {
                setShowMobileMenu(false);
                moveToSearchPage(word);
              }}
            />
            {isLoggedIn ? (
              <>
                <GhostButton
                  className="w-fit h-fit p-2 rounded-full"
                  onClick={handleCouponClick}
                  dataCy="coupon-event-modal-button">
                  <Percent className="h-6 w-6 text-sub-gray" />
                </GhostButton>
                <div className="relative flex items-center space-x-3">
                  {!isLoading ? (
                    <span className="text-sm font-medium whitespace-nowrap" data-cy="user-nickname">{user?.nickname}</span>
                  ) : (
                    <div className="h-5 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                  )}
                  <div className="relative flex items-center" ref={authMenuRef}>
                    {isLoading ?
                    <div className="h-10 w-10 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" /> :
                    <button className="h-10 w-10 overflow-hidden rounded-full" onClick={handleProfileClick} data-cy="user-image-button">
                      <img
                        src={user?.imageUrl || "/placeholder/profile-placeholder.png"}
                        alt="프로필 이미지"
                        className="h-full w-full object-cover"
                        data-cy="user-image"
                      />
                    </button>
                    }
                    <div
                      className={`absolute right-0 top-12 bg-white shadow-md rounded-md px-4 py-2 flex flex-col gap-2 z-50 min-w-[220px] text-left transition-all duration-75 ease-out
                        ${showAuthMenu ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'}`}
                      style={{ transformOrigin: 'top right' }}
                      data-cy="user-menu"
                    >
                      <div className="text-xs text-gray-400 font-semibold my-2 pl-1">설정</div>
                      {isAdmin && (
                        <button
                          type="button"
                          onClick={() => router.push("/admin/approval")}
                          className="text-sm text-gray-500 hover:text-gray-700 whitespace-nowrap flex items-center gap-2 p-2 justify-start"
                          data-cy="adminpage-button"
                        >
                          <UserLock className="h-4 w-4" />
                          관리자페이지
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={handleClickMyPage}
                        className="text-sm text-gray-500 hover:text-gray-700 whitespace-nowrap flex items-center gap-2 p-2 justify-start"
                        data-cy="mypage-button"
                      >
                        <User className="h-4 w-4" />
                        마이페이지
                      </button>
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="text-sm text-gray-500 hover:text-gray-700 whitespace-nowrap flex items-center gap-2 p-2 justify-start"
                        data-cy="logout-button"
                      >
                        <LogOut className="h-4 w-4" />
                        로그아웃
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-main-color font-medium mr-auto flex items-center gap-1 whitespace-nowrap">
                <GhostPrimaryButton ariaLabel="로그인" onClick={openLoginModal} dataCy="open-login-modal-button" className="px-2 py-1">
                  로그인
                </GhostPrimaryButton>
                /
                <GhostPrimaryButton ariaLabel="회원가입" onClick={openSignupModal} dataCy="open-signup-modal-button" className="px-2 py-1">
                  회원가입
                </GhostPrimaryButton>
              </div>
            )}
          </div>
        </div>
        {/* 하단 네비게이션 탭 */}
        <div className="mt-4 flex justify-between items-center">
          <MenuTab
            tabs={["전체", "카테고리", "신규", "마감임박"]}
            activeTab={activeTab}
            onClickTab={handleTabClick}
            hideUnderline={!showUnderline}
          />
        </div>
      </div>

      {/* 모바일 메뉴 오버레이 */}
      {isSidebarVisible && (
        <div className="fixed inset-0 z-50 flex">
          {/* 오버레이 배경 */}
          <div className="absolute inset-0 bg-black/60" onClick={handleSidebarClose} />
          {/* 사이드 메뉴 (슬라이드 인/아웃 애니메이션 적용) */}
          <div
            className={`fixed left-0 top-0 h-full bg-white w-4/5 max-w-xs z-10 flex flex-col p-6 transition-transform duration-300 ${sidebarAnim ? 'translate-x-0' : '-translate-x-full'}`}
            onTransitionEnd={handleSidebarTransitionEnd}
          >
            {/* 닫기 버튼 */}
            <button className="mb-6 self-end" onClick={handleSidebarClose} aria-label="메뉴 닫기">
              <X className="w-8 h-8" />
            </button>
            {/* 검색창 */}
            <div className="mb-4 w-full">
              <SearchBar
                isLogin={isLoggedIn}
                searchWord={searchWord}
                onSearchChange={handleSearchChange}
                onSearch={(word) => {
                  setShowMobileMenu(false);
                  moveToSearchPage(word);
                }}
              />
            </div>
            {/* 네비게이션 탭 (가로 스크롤, 줄바꿈 방지) */}
            <div className="mb-6 overflow-x-auto whitespace-nowrap">
              <MenuTab
                tabs={["전체", "카테고리", "신규", "마감임박"]}
                activeTab={activeTab}
                onClickTab={(tab) => {
                  setShowMobileMenu(false);
                  handleTabClick(tab);
                }}
                hideUnderline={!showUnderline}
              />
            </div>
            {/* 메뉴 항목 */}
            <div className="flex flex-col gap-4 mt-4">
              {isLoggedIn ? (
                <>
                  <button type="button" className="flex items-center gap-2 text-gray-700" onClick={() => { setShowMobileMenu(false); handleCouponClick(); }}>
                    <Percent className="h-5 w-5" /> 쿠폰
                  </button>
                  <button type="button" className="flex items-center gap-2 text-gray-700" onClick={() => { setShowMobileMenu(false); handleClickMyPage(); }}>
                    <User className="h-5 w-5" /> 마이페이지
                  </button>
                  {isAdmin && (
                    <button type="button" className="flex items-center gap-2 text-gray-700" onClick={() => { setShowMobileMenu(false); router.push("/admin/approval"); }}>
                      <UserLock className="h-5 w-5" /> 관리자페이지
                    </button>
                  )}
                  <button type="button" className="flex items-center gap-2 text-gray-700" onClick={() => { setShowMobileMenu(false); handleLogout(); }}>
                    <LogOut className="h-5 w-5" /> 로그아웃
                  </button>
                </>
              ) : (
                <>
                  <button type="button" className="text-main-color font-medium" onClick={openLoginModal}>로그인</button>
                  <button type="button" className="text-main-color font-medium" onClick={openSignupModal}>회원가입</button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
      {/* 모달들 */}
      <CouponModal isOpen={showCouponModal} onClose={() => setShowCouponModal(false)} />
      <LoginModal isOpen={showLoginModal} onClose={closeLoginModal} moveToSignupModal={openSignupModalInLoginModal} />
      <SignupModal isOpen={showSignupModal} onClose={closeSignupModal} />
    </header>
  )
}

export default Header
