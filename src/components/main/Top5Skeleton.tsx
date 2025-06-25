export default function Top5Skeleton() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-12" data-cy="category-top5-skeleton">
      <div className="flex items-center mb-8">
        <h2 className="text-2xl font-bold">
          BEST <span className="text-main-color">TOP 5</span> <span className="text-2xl">🏆</span>
        </h2>
      </div>
      <div className="flex justify-between mb-8">
        <div className="flex flex-wrap gap-2">
          {[0,1,2].map(i => (
            <div key={i} className="px-4 py-2 rounded-full bg-gray-200 animate-pulse w-20 h-8" />
          ))}
        </div>
        <div className="px-4 py-2 rounded bg-gray-200 animate-pulse w-32 h-8" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 1등 (큰 카드) */}
        <div className="flex flex-col items-start animate-pulse w-full">
          <div className="w-full aspect-square bg-gray-200 rounded-lg" />
        </div>
        {/* 2~5등 (2x2 그리드) */}
        <div className="grid grid-cols-2 grid-rows-2 gap-4">
          {[0,1,2,3].map(i => (
            <div key={i} className="flex flex-col items-start animate-pulse w-full">
              <div className="w-full aspect-square bg-gray-200 rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 