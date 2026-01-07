import { useLocation } from "react-router-dom";
import type { CurrentWeatherResponse } from "../../shared/types";
import InfoSection from "./components/InfoSection";
import InfoGridItem from "./components/InfoGridItem";
import WeatherDetailHeader from "./components/WeatherDetailHeader";
import {
  MAIN_GRID_ITEMS,
  WIND_ITEMS,
  PRECIPITATION_ITEMS,
  SUNRISE_SUNSET_ITEMS,
  ADDITIONAL_INFO_ITEMS,
} from "./WEATHER_DETAIL_CONFIG";
import EmptyDetail from "./components/EmptyDetail";

const WeatherDetailPage = () => {
  const location = useLocation();
  const data = location.state as CurrentWeatherResponse | null;

  if (!data) {
    return <EmptyDetail />;
  }

  const { weather, main, clouds, dt, timezone, name } = data;

  const weatherIcon = weather[0]?.icon;
  const weatherDescription = weather[0]?.description || "";

  return (
    <div className="min-h-[100dvh] bg-gray-50">
      <div className="px-4 py-8 max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <WeatherDetailHeader
            name={name}
            weatherIcon={weatherIcon}
            weatherDescription={weatherDescription}
            temperature={main.temp}
            timestamp={dt}
            timezone={timezone}
          />

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

          <InfoSection title="구름">
            <p className="text-lg font-semibold text-gray-800">{clouds.all}%</p>
          </InfoSection>

          {(data.rain || data.snow) && (
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
          )}

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
        </div>
      </div>
    </div>
  );
};

export default WeatherDetailPage;
