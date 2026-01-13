import type { CurrentWeatherResponse } from "../../../../shared/types";
import { InfoSection, InfoGridItem } from "../ui";
import { WIND_ITEMS } from "../../WEATHER_DETAIL_CONFIG";

interface WindSectionProps {
  data: CurrentWeatherResponse;
}

const WindSection = ({ data }: WindSectionProps) => {
  return (
    <InfoSection title="바람">
      <div className="grid grid-cols-2 gap-4">
        {WIND_ITEMS.map((item) => {
          const value = item.getValue(data);
          if (!value) return null;
          return (
            <InfoGridItem
              key={item.label}
              label={item.label}
              value={value}
              valueColor={item.valueColor}
              size={item.size}
            />
          );
        })}
      </div>
    </InfoSection>
  );
};

export default WindSection;
