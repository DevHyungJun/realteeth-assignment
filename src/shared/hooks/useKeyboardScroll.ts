import { useCallback, type RefObject } from "react";

type UseKeyboardScrollOptions = {
  scrollAmount?: number;
};

/**
 * 키보드로 스크롤 가능한 영역을 제어하는 커스텀 훅
 *
 * @param scrollContainerRef - 스크롤할 컨테이너의 ref
 * @param options - 옵션 객체
 * @param options.scrollAmount - 한 번에 스크롤할 픽셀 수 (기본값: 200)
 * @returns 키보드 이벤트 핸들러
 */
export const useKeyboardScroll = (
  scrollContainerRef: RefObject<HTMLDivElement | null>,
  options: UseKeyboardScrollOptions = {}
) => {
  const { scrollAmount = 200 } = options;

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (!scrollContainerRef.current) return;

      switch (e.key) {
        case "ArrowLeft":
          e.preventDefault();
          scrollContainerRef.current.scrollBy({
            left: -scrollAmount,
            behavior: "smooth",
          });
          break;
        case "ArrowRight":
          e.preventDefault();
          scrollContainerRef.current.scrollBy({
            left: scrollAmount,
            behavior: "smooth",
          });
          break;
        case "Home":
          e.preventDefault();
          scrollContainerRef.current.scrollTo({
            left: 0,
            behavior: "smooth",
          });
          break;
        case "End":
          e.preventDefault();
          scrollContainerRef.current.scrollTo({
            left: scrollContainerRef.current.scrollWidth,
            behavior: "smooth",
          });
          break;
      }
    },
    [scrollContainerRef, scrollAmount]
  );

  return { handleKeyDown };
};
