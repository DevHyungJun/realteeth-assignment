import type { CurrentWeatherResponse } from "../../../../shared/types";
import { InfoSection, InfoGridItem } from "../ui";
import { ADDITIONAL_INFO_ITEMS } from "../../WEATHER_DETAIL_CONFIG";

type AdditionalInfoSectionProps = {
  data: CurrentWeatherResponse;
};

const AdditionalInfoSection = ({ data }: AdditionalInfoSectionProps) => {
  return (
    <InfoSection title="추가 정보">
      <div className="grid grid-cols-2 gap-4">
        {ADDITIONAL_INFO_ITEMS.map((item) => {
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

export default AdditionalInfoSection;
