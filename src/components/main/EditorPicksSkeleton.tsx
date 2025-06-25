export default function EditorPicksSkeleton() {
  return (
    <div className="w-full max-w-7xl mx-auto py-12" data-cy="pro-carousel-skeleton">
        <div className="flex flex-col lg:flex-row items-start lg:items-center">
          
          {/* Title */}
          <h2 className="text-left font-bold mb-8 lg:mb-0 lg:min-w-[300px] pl-4 text-base sm:text-lg md:text-xl lg:text-3xl">
            <span className="block lg:hidden">
              에디터가 <span className="text-main-color">엄선한</span> 프로젝트를 확인해보세요
            </span>
            <span className="hidden lg:block">
              에디터가<br />
              <span className="text-main-color">엄선한</span> 프로젝트를<br />
              확인해보세요
            </span>
          </h2>

          {/* Carousel Container */}
          <div className="relative flex-1 w-full min-w-[min(100vw,900px)] overflow-hidden">
            <div className="pointer-events-none absolute left-0 top-0 h-full w-60 bg-gradient-to-r from-white to-transparent z-4" />
            <div className="pointer-events-none absolute right-0 top-0 h-full w-60 bg-gradient-to-l from-white to-transparent z-4" />
            <div className="flex w-fit gap-6">
              {[0,1,2,3,4,5].map(i => (
                <div
                  key={i}
                  className="flex flex-col items-start animate-pulse"
                  style={{ minWidth: '220px', width: 220, transform: 'scale(0.92)' }}
                >
                  <div className="w-full aspect-square bg-gray-200 rounded-lg mb-3" />
                  <div className="h-3 w-1/3 bg-gray-100 rounded mb-2" />
                  <div className="h-3 w-full bg-gray-200 rounded mb-3" />
                  <div className="h-6 w-full bg-gray-100 rounded mb-2" />
                  <div className="h-3 w-1/4 bg-gray-200 rounded mb-2" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
  )
}