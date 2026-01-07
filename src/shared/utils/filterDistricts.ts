import koreaDistricts from "../lib/korea_districts.json";

/**
 * 하이픈을 제거한 지역명을 반환합니다.
 */
function removeHyphen(district: string): string {
  return district.replace(/-/g, " ");
}

/**
 * 하이픈을 무시하고 검색어와 일치하는지 확인합니다.
 */
function matchesSearchTerm(district: string, searchTerm: string): boolean {
  const normalizedDistrict = removeHyphen(district).toLowerCase();
  const normalizedSearchTerm = searchTerm.trim().toLowerCase();
  return normalizedDistrict.includes(normalizedSearchTerm);
}

/**
 * 입력된 검색어와 일치하는 지역명 목록을 반환합니다.
 * 하이픈은 검색 시 무시되며, 결과는 하이픈을 공백으로 변환하여 표시합니다.
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

