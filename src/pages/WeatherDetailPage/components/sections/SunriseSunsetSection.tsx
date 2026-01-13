import type { CurrentWeatherResponse } from "../../../../shared/types";
import { InfoSection, InfoGridItem } from "../ui";
import { SUNRISE_SUNSET_ITEMS } from "../../WEATHER_DETAIL_CONFIG";

interface SunriseSunsetSectionProps {
  data: CurrentWeatherResponse;
}

const SunriseSunsetSection = ({ data }: SunriseSunsetSectionProps) => {
  return (
    <InfoSection title="일출/일몰">
      <div className="grid grid-cols-2 gap-4">
        {SUNRISE_SUNSET_ITEMS.map((item) => {
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

export default SunriseSunsetSection;
