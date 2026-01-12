import { useState, useRef, useEffect, type KeyboardEvent } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams, useNavigate } from "react-router-dom";
import { filterDistricts } from "../../../utils";
import { BackIcon, SearchIcon, ClearIcon } from "../../../ui/Icons";

type WeatherSearchProps = {
  onSelectDistrict: (district: string) => void;
  onSearch: (district: string) => void;
  initialValue?: string | null;
};

type FormData = {
  searchTerm: string;
};

const WeatherSearch = ({
  onSelectDistrict,
  onSearch,
  initialValue,
}: WeatherSearchProps) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const hasQueryParam = !!searchParams.get("q");

  const { register, handleSubmit, watch, setValue, reset } = useForm<FormData>({
    defaultValues: {
      searchTerm: initialValue || "",
    },
  });

  const searchTerm = watch("searchTerm");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // 초기값이 변경되면 form 값 업데이트
  useEffect(() => {
    if (initialValue !== undefined) {
      setValue("searchTerm", initialValue || "");
    }
  }, [initialValue, setValue]);

  // searchTerm 변경 시 suggestions 업데이트
  useEffect(() => {
    if (searchTerm.trim()) {
      const filtered = filterDistricts(searchTerm, 10);
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
    setSelectedIndex(-1);
  }, [searchTerm]);

  const handleSuggestionClick = (district: string) => {
    setValue("searchTerm", district);
    setSuggestions([]);
    setIsFocused(false);
    onSelectDistrict(district);
  };

  const onSubmit = (data: FormData) => {
    const trimmedValue = data.searchTerm.trim();
    if (trimmedValue) {
      onSearch(trimmedValue);
      setSuggestions([]);
      setIsFocused(false);
    }
  };

  const handleClear = () => {
    reset({ searchTerm: "" });
    setSuggestions([]);
    setIsFocused(false);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
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
        onSubmit={handleSubmit(onSubmit)}
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
        <div className="relative flex-1">
          <input
            {...register("searchTerm")}
            type="text"
            onFocus={() => setIsFocused(true)}
            onKeyDown={handleKeyDown}
            placeholder="지역명을 입력하세요 (도, 시, 구, 동..)"
            className="w-full px-4 py-2 pr-20 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-10 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="지우기"
            >
              <ClearIcon className="w-4 h-4" />
            </button>
          )}
          <button
            type="submit"
            disabled={!searchTerm.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-blue-600 hover:text-blue-700 disabled:text-gray-300 disabled:cursor-not-allowed transition-colors"
            aria-label="검색"
          >
            <SearchIcon />
          </button>
        </div>
      </form>

      {isFocused && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute z-10 left-[2.5rem] right-2 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto"
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
