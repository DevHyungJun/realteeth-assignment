import { useState, useEffect } from "react";
import { filterDistricts } from "../../../../../utils";

export const useSearchSuggestions = (searchTerm: string) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  useEffect(() => {
    if (searchTerm.trim()) {
      const filtered = filterDistricts(searchTerm, 10);
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
    setSelectedIndex(-1);
  }, [searchTerm]);

  const resetSelection = () => {
    setSelectedIndex(-1);
  };

  return {
    suggestions,
    selectedIndex,
    setSelectedIndex,
    resetSelection,
  };
};
