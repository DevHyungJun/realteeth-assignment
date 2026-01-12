import type { CurrentWeatherResponse } from "../../../../shared/types";
import { InfoGridItem } from "../ui";
import { MAIN_GRID_ITEMS } from "../../WEATHER_DETAIL_CONFIG";

type MainGridProps = {
  data: CurrentWeatherResponse;
};

const MainGrid = ({ data }: MainGridProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
      {MAIN_GRID_ITEMS.map((item) => {
        const value = item.getValue(data);
        if (!value) return null;
        return (
          <div key={item.label} className="bg-gray-50 rounded-lg p-4">
            <InfoGridItem
              label={item.label}
              value={value}
              valueColor={item.valueColor}
              size={item.size}
            />
          </div>
        );
      })}
    </div>
  );
};

export default MainGrid;
