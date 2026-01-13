import WeatherInfoItem from "./WeatherInfoItem";
import type { Main, Wind } from "../../../../../types";

interface WeatherCardInfoProps {
  items: Array<{
    label: string;
    valueColor?: string;
    getValue: (main: Main, wind: Wind) => string;
  }>;
  main: Main;
  wind: Wind;
  variant: "full" | "compact";
}

const WeatherCardInfo = ({
  items,
  main,
  wind,
  variant,
}: WeatherCardInfoProps) => {
  return (
    <div
      className={`flex items-center gap-2 flex-wrap ${
        variant === "compact" && "text-sm mt-3"
      }`}
    >
      {items.map((item, index) => (
        <WeatherInfoItem
          key={item.label}
          label={item.label}
          value={item.getValue(main, wind)}
          valueColor={item.valueColor}
          showDivider={index !== items.length - 1}
        />
      ))}
    </div>
  );
};

export default WeatherCardInfo;
