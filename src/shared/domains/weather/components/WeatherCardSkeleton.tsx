interface WeatherCardSkeletonProps {
  count?: number;
}

const WeatherCardSkeleton = ({ count = 4 }: WeatherCardSkeletonProps) => {
  return (
    <div className="flex flex-col gap-4">
      {Array.from({ length: count }).map((_, skeletonIndex) => (
        <div
          key={skeletonIndex}
          className="bg-white rounded-lg shadow-lg p-4 animate-pulse"
        >
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <div className="w-12 h-12 bg-gray-300 rounded" />
              <div className="w-16 h-9 bg-gray-300 rounded" />
            </div>
            <div className="w-24 h-7 bg-gray-300 rounded" />
          </div>

          <div className="w-32 h-4 bg-gray-300 rounded mt-3 mb-3 ml-auto" />

          <div className="flex items-center gap-2 flex-wrap">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="flex items-center gap-1">
                <div className="flex items-center gap-1">
                  <div className="w-8 h-3 bg-gray-300 rounded" />
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
