interface WeatherCardSkeletonProps {
  count?: number;
}

const WeatherCardSkeleton = ({ count = 1 }: WeatherCardSkeletonProps) => {
  return (
    <div className="flex flex-col gap-4">
      {Array.from({ length: count }).map((_, skeletonIndex) => (
        <div
          key={skeletonIndex}
          className="bg-white rounded-lg shadow-lg p-4 animate-pulse relative"
        >
          {/* FavoriteButton 스켈레톤 (오른쪽 상단) */}
          <div className="absolute top-4 right-4 w-5 h-5 bg-gray-300 rounded" />

          {/* 메인 컨텐츠 영역 */}
          <div className="flex items-center gap-3">
            {/* 아이콘과 온도 */}
            <div className="flex items-center gap-1">
              <div className="w-12 h-12 bg-gray-300 rounded" />
              <div className="w-16 h-9 sm:w-20 sm:h-10 bg-gray-300 rounded" />
            </div>
            {/* 제목 영역 */}
            <div className="flex-1 min-w-0">
              <div className="inline-block">
                <div className="w-32 sm:w-40 h-6 sm:h-7 bg-gray-300 rounded" />
              </div>
            </div>
          </div>

          {/* 날씨 설명 (separate 위치) */}
          <div className="w-24 h-4 bg-gray-300 rounded ml-auto mb-3 mt-2" />

          {/* 하단 정보 아이템들 */}
          <div className="flex items-center gap-2 flex-wrap">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="flex items-center gap-1">
                <div className="flex items-center gap-1">
                  <div className="w-10 h-4 bg-gray-300 rounded" />
                </div>
                {index !== 4 && <div className="w-px h-4 bg-gray-300" />}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default WeatherCardSkeleton;
