import { Tooltip, InfoIcon } from "../../../../shared/ui";

interface InfoGridItemProps {
  label: string;
  value: string | number;
  valueColor?: string;
  size?: "sm" | "md" | "lg" | "xl";
  tooltip?: string;
}

const InfoGridItem = ({
  label,
  value,
  valueColor = "text-gray-800",
  size = "lg",
  tooltip,
}: InfoGridItemProps) => {
  const sizeClasses: Record<"sm" | "md" | "lg" | "xl", string> = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
    xl: "text-xl",
  };

  const unitMatch = String(value).match(/\s+(hPa)$/);
  const hasHpaUnit = unitMatch !== null;
  const valueWithoutUnit = hasHpaUnit
    ? String(value).replace(/\s+hPa$/, "")
    : String(value);
  const unit = hasHpaUnit ? "hPa" : null;

  return (
    <div>
      <p className="text-xs text-gray-500 mb-1">
        {tooltip ? (
          <Tooltip content={tooltip} position="top">
            <span className="inline-flex items-center gap-1">
              {label}
              <InfoIcon className="h-3.5 w-3.5 text-gray-400 hover:text-gray-600 transition-colors cursor-help" />
            </span>
          </Tooltip>
        ) : (
          label
        )}
      </p>
      <p className={`${sizeClasses[size]} font-semibold ${valueColor}`}>
        {valueWithoutUnit === "KR" ? "한국" : valueWithoutUnit}
        {unit && <> {unit}</>}
      </p>
    </div>
  );
};

export default InfoGridItem;
