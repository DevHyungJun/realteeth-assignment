import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import type { KeyboardEvent } from "react";

type UseFavoriteNameEditParams = {
  initialName: string;
  onNameChange?: (newName: string) => void;
};

export const useFavoriteNameEdit = ({
  initialName,
  onNameChange,
}: UseFavoriteNameEditParams) => {
  const [isEditing, setIsEditing] = useState(false);
  const { register, setValue, getValues, reset } = useForm<{
    favoriteName: string;
  }>({
    defaultValues: {
      favoriteName: initialName,
    },
  });

  useEffect(() => {
    if (!isEditing) {
      setValue("favoriteName", initialName);
    }
  }, [initialName, isEditing, setValue]);

  const handleNameBlur = () => {
    const trimmedValue = getValues("favoriteName").trim();
    if (trimmedValue && trimmedValue !== initialName && onNameChange) {
      onNameChange(trimmedValue);
    } else {
      reset({ favoriteName: initialName });
    }
    setIsEditing(false);
  };

  const handleNameKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.currentTarget.blur();
    } else if (e.key === "Escape") {
      reset({ favoriteName: initialName });
      setIsEditing(false);
    }
  };

  const startEditing = () => {
    setIsEditing(true);
  };

  return {
    isEditing,
    register,
    handleNameBlur,
    handleNameKeyDown,
    startEditing,
  };
};
