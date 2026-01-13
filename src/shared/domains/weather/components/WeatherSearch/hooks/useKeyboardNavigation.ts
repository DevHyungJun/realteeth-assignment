import type { KeyboardEvent } from "react";

type UseKeyboardNavigationParams = {
  suggestions: string[];
  selectedIndex: number;
  onSelect: (district: string) => void;
  onIndexChange: (index: number) => void;
};

export const useKeyboardNavigation = ({
  suggestions,
  selectedIndex,
  onSelect,
  onIndexChange,
}: UseKeyboardNavigationParams) => {
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (suggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      onIndexChange(
        selectedIndex < suggestions.length - 1 ? selectedIndex + 1 : selectedIndex
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      onIndexChange(selectedIndex > 0 ? selectedIndex - 1 : -1);
    } else if (e.key === "Enter" && selectedIndex >= 0) {
      e.preventDefault();
      onSelect(suggestions[selectedIndex]);
    }
  };

  return { handleKeyDown };
};
