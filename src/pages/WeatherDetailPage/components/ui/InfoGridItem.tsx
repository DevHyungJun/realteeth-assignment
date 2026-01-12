type InfoGridItemProps = {
  label: string;
  value: string | number;
  valueColor?: string;
  size?: "sm" | "md" | "lg" | "xl";
};

const InfoGridItem = ({
  label,
  value,
  valueColor = "text-gray-800",
  size = "lg",
}: InfoGridItemProps) => {
  const sizeClasses: Record<"sm" | "md" | "lg" | "xl", string> = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
    xl: "text-xl",
  };

  return (
    <div>
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className={`${sizeClasses[size]} font-semibold ${valueColor}`}>
        {value}
      </p>
    </div>
  );
};

export default InfoGridItem;

