import koreaDistricts from "../lib/korea_districts.json";

/**
 * 입력된 검색어와 일치하는 지역명 목록을 반환합니다.
 * @param searchTerm 검색어
 * @param limit 최대 반환 개수 (기본값: 10)
 * @returns 일치하는 지역명 배열
 */
export function filterDistricts(
  searchTerm: string,
  limit: number = 10
): string[] {
  if (!searchTerm.trim()) return [];

  const normalizedSearchTerm = searchTerm.trim().toLowerCase();

  return koreaDistricts
    .filter((district) =>
      district.toLowerCase().includes(normalizedSearchTerm)
    )
    .slice(0, limit);
}

