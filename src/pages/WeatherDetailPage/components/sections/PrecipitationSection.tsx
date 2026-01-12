import type { CurrentWeatherResponse } from "../../../../shared/types";
import { InfoSection, InfoGridItem } from "../ui";
import { PRECIPITATION_ITEMS } from "../../WEATHER_DETAIL_CONFIG";

type PrecipitationSectionProps = {
  data: CurrentWeatherResponse;
};

const PrecipitationSection = ({ data }: PrecipitationSectionProps) => {
  if (!data.rain && !data.snow) {
    return null;
  }

  return (
    <InfoSection title="강수량">
      <div className="grid grid-cols-2 gap-4">
        {PRECIPITATION_ITEMS.map((item) => {
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

export default PrecipitationSection;
