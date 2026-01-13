import type { KeyboardEvent } from "react";
import type { UseFormRegister } from "react-hook-form";
import { BackIcon, SearchIcon, ClearIcon } from "../../../../../ui/Icons";

type FormData = {
  searchTerm: string;
};

interface SearchInputProps {
  register: UseFormRegister<FormData>;
  searchTerm: string;
  hasQueryParam: boolean;
  onNavigateBack: () => void;
  onFocus: () => void;
  onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
  onClear: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

const SearchInput = ({
  register,
  searchTerm,
  hasQueryParam,
  onNavigateBack,
  onFocus,
  onKeyDown,
  onClear,
  onSubmit,
}: SearchInputProps) => {
  return (
    <form
      onSubmit={onSubmit}
      className="relative flex items-center gap-2"
    >
      <button
        type="button"
        onClick={onNavigateBack}
        disabled={!hasQueryParam}
        className="flex-shrink-0 w-10 h-10 flex items-center justify-center text-gray-600 hover:text-gray-800 disabled:text-gray-300 disabled:cursor-not-allowed transition-colors"
        aria-label="뒤로가기"
      >
        <BackIcon />
      </button>
      <div className="relative flex-1">
        <input
          {...register("searchTerm", { maxLength: 25 })}
          type="text"
          maxLength={25}
          onFocus={onFocus}
          onKeyDown={onKeyDown}
          placeholder="지역명을 입력하세요 (도, 시, 구, 동..)"
          className="w-full px-4 py-2 pr-20 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {searchTerm && (
          <button
            type="button"
            onClick={onClear}
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
  );
};

export default SearchInput;
