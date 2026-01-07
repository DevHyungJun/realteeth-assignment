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
 * "대구광역시 동구" 검색 시 "대구광역시-동구"는 일치
 */
function matchesSearchTerm(district: string, searchTerm: string): boolean {
  const normalizedSearchTerm = searchTerm.trim().toLowerCase();
  if (!normalizedSearchTerm) return false;

  // 하이픈으로 구분된 세그먼트들로 분리
  const segments = district.split("-").map((s) => s.toLowerCase());

  // 검색어를 공백으로 분리 (여러 단어 검색 지원)
  const searchParts = normalizedSearchTerm
    .split(/\s+/)
    .filter((part) => part.length > 0);

  // 검색어가 하나인 경우: 기존 로직 (각 세그먼트의 시작 부분 확인)
  if (searchParts.length === 1) {
    const searchPart = searchParts[0];
    for (const segment of segments) {
      if (segment.startsWith(searchPart) || segment === searchPart) {
        return true;
      }
    }
    return false;
  }

  // 검색어가 여러 개인 경우: 순서대로 세그먼트와 매칭
  // 예: "대구광역시 동구" -> ["대구광역시", "동구"]
  // "대구광역시-동구" -> ["대구광역시", "동구"]와 매칭
  let searchIndex = 0;
  for (
    let i = 0;
    i < segments.length && searchIndex < searchParts.length;
    i++
  ) {
    const segment = segments[i];
    const searchPart = searchParts[searchIndex];

    // 세그먼트가 검색어 부분으로 시작하면 다음 검색어로 이동
    if (segment.startsWith(searchPart)) {
      searchIndex++;
    }
  }

  // 모든 검색어 부분이 매칭되었는지 확인
  return searchIndex === searchParts.length;
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
