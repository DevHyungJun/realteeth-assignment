import koreaDistricts from "../lib/korea_districts.json";

/**
 * 하이픈을 제거한 지역명을 반환합니다.
 */
function removeHyphen(district: string): string {
  return district.replace(/-/g, " ");
}

/**
 * 검색어가 지역명의 세그먼트(하이픈으로 구분된 부분)의 시작 부분과 일치하는지 확인합니다.
 * 예: "대구" 검색 시 "대구광역시", "대구광역시-중구"는 일치하지만 "부산광역시-해운대구"는 일치하지 않음
 */
function matchesSearchTerm(district: string, searchTerm: string): boolean {
  const normalizedSearchTerm = searchTerm.trim().toLowerCase();
  if (!normalizedSearchTerm) return false;

  // 하이픈으로 구분된 세그먼트들로 분리
  const segments = district.split("-");
  
  // 각 세그먼트의 시작 부분이 검색어와 일치하는지 확인
  for (const segment of segments) {
    const normalizedSegment = segment.toLowerCase();
    // 세그먼트가 검색어로 시작하는지 확인
    if (normalizedSegment.startsWith(normalizedSearchTerm)) {
      return true;
    }
    // 또는 세그먼트 전체가 검색어와 일치하는지 확인 (예: "대구" = "대구")
    if (normalizedSegment === normalizedSearchTerm) {
      return true;
    }
  }
  
  return false;
}

/**
 * 입력된 검색어와 일치하는 지역명 목록을 반환합니다.
 * 검색어는 지역명의 각 세그먼트(하이픈으로 구분된 부분)의 시작 부분과 일치해야 합니다.
 * 결과는 하이픈을 공백으로 변환하여 표시합니다.
 * @param searchTerm 검색어
 * @param limit 최대 반환 개수 (기본값: 10)
 * @returns 일치하는 지역명 배열 (하이픈이 공백으로 변환됨)
 */
export function filterDistricts(
  searchTerm: string,
  limit: number = 10
): string[] {
  if (!searchTerm.trim()) return [];

  return koreaDistricts
    .filter((district) => matchesSearchTerm(district, searchTerm))
    .map((district) => removeHyphen(district))
    .slice(0, limit);
}

