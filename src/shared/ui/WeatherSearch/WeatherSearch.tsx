import { useState, useRef, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { filterDistricts } from "../../utils/filterDistricts";
import BackIcon from "../Icons/BackIcon";
import SearchIcon from "../Icons/SearchIcon";

type WeatherSearchProps = {
  onSelectDistrict: (district: string) => void;
  onSearch: (district: string) => void;
  initialValue?: string | null;
};

const WeatherSearch = ({
  onSelectDistrict,
  onSearch,
  initialValue,
}: WeatherSearchProps) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const hasQueryParam = !!searchParams.get("q");

  const [searchTerm, setSearchTerm] = useState(initialValue || "");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (searchTerm.trim()) {
      const filtered = filterDistricts(searchTerm, 10);
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
    setSelectedIndex(-1);
  }, [searchTerm]);

  // 초기값이 변경되면 input 값 업데이트
  useEffect(() => {
    if (initialValue !== undefined && initialValue !== searchTerm) {
      setSearchTerm(initialValue || "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialValue]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleInputFocus = () => {
    setIsFocused(true);
  };

  const handleInputBlur = () => {
    // 클릭 이벤트가 먼저 처리되도록 약간의 지연
    setTimeout(() => {
      setIsFocused(false);
    }, 200);
  };

  const handleSuggestionClick = (district: string) => {
    setSearchTerm(district);
    setSuggestions([]);
    setIsFocused(false);
    onSelectDistrict(district);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onSearch(searchTerm.trim());
      setSuggestions([]);
      setIsFocused(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (suggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === "Enter" && selectedIndex >= 0) {
      e.preventDefault();
      handleSuggestionClick(suggestions[selectedIndex]);
    }
  };

  useEffect(() => {
    if (selectedIndex >= 0 && suggestionsRef.current) {
      const selectedElement = suggestionsRef.current.children[
        selectedIndex
      ] as HTMLElement;
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: "nearest" });
      }
    }
  }, [selectedIndex, suggestions.length]);

  return (
    <div className="relative w-full">
      <form
        onSubmit={handleSubmit}
        className="relative flex items-center gap-2"
      >
        <button
          type="button"
          onClick={() => navigate(-1)}
          disabled={!hasQueryParam}
          className="flex-shrink-0 w-10 h-10 flex items-center justify-center text-gray-600 hover:text-gray-800 disabled:text-gray-300 disabled:cursor-not-allowed transition-colors"
          aria-label="뒤로가기"
        >
          <BackIcon />
        </button>
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          onKeyDown={handleKeyDown}
          placeholder="지역명을 입력하세요 (예: 서울, 부산)"
          className="flex-1 px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button
          type="submit"
          disabled={!searchTerm.trim()}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-blue-600 hover:text-blue-700 disabled:text-gray-300 disabled:cursor-not-allowed transition-colors"
          aria-label="검색"
        >
          <SearchIcon />
        </button>
      </form>

      {isFocused && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto"
        >
          {suggestions.map((district, index) => (
            <button
              key={district}
              type="button"
              onClick={() => handleSuggestionClick(district)}
              className={`w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors ${
                index === selectedIndex ? "bg-blue-50" : ""
              }`}
            >
              {district}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default WeatherSearch;
