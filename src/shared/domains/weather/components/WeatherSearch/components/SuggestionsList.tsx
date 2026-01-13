import { useRef, useEffect } from "react";

type SuggestionsListProps = {
  suggestions: string[];
  selectedIndex: number;
  onSelect: (district: string) => void;
};

const SuggestionsList = ({
  suggestions,
  selectedIndex,
  onSelect,
}: SuggestionsListProps) => {
  const suggestionsRef = useRef<HTMLDivElement>(null);

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
    <div
      ref={suggestionsRef}
      className="absolute z-10 left-[2.5rem] right-2 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto"
    >
      {suggestions.map((district, index) => (
        <button
          key={district}
          type="button"
          onClick={() => onSelect(district)}
          className={`w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors ${
            index === selectedIndex ? "bg-blue-50" : ""
          }`}
        >
          {district}
        </button>
      ))}
    </div>
  );
};

export default SuggestionsList;
