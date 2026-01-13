import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams, useNavigate } from "react-router-dom";
import { SuggestionsList, SearchInput } from "./components";
import { useSearchSuggestions } from "./hooks/useSearchSuggestions";
import { useKeyboardNavigation } from "./hooks/useKeyboardNavigation";

interface WeatherSearchProps {
  onSelectDistrict: (district: string) => void;
  onSearch: (district: string) => void;
  initialValue?: string | null;
}

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
  const [isFocused, setIsFocused] = useState(false);

  const { suggestions, selectedIndex, setSelectedIndex, resetSelection } =
    useSearchSuggestions(searchTerm);

  useEffect(() => {
    if (initialValue !== undefined) {
      setValue("searchTerm", initialValue || "");
    }
  }, [initialValue, setValue]);

  const handleSuggestionClick = (district: string) => {
    setValue("searchTerm", district);
    resetSelection();
    setIsFocused(false);
    onSelectDistrict(district);
  };

  const onSubmit = (data: FormData) => {
    const trimmedValue = data.searchTerm.trim();
    if (trimmedValue) {
      onSearch(trimmedValue);
      resetSelection();
      setIsFocused(false);
    }
  };

  const handleClear = () => {
    reset({ searchTerm: "" });
    resetSelection();
    setIsFocused(false);
  };

  const { handleKeyDown } = useKeyboardNavigation({
    suggestions,
    selectedIndex,
    onSelect: handleSuggestionClick,
    onIndexChange: setSelectedIndex,
  });

  return (
    <div className="relative w-full">
      <SearchInput
        register={register}
        searchTerm={searchTerm}
        hasQueryParam={hasQueryParam}
        onNavigateBack={() => navigate(-1)}
        onFocus={() => setIsFocused(true)}
        onKeyDown={handleKeyDown}
        onClear={handleClear}
        onSubmit={handleSubmit(onSubmit)}
      />

      {isFocused && suggestions.length > 0 && (
        <SuggestionsList
          suggestions={suggestions}
          selectedIndex={selectedIndex}
          onSelect={handleSuggestionClick}
        />
      )}
    </div>
  );
};

export default WeatherSearch;
