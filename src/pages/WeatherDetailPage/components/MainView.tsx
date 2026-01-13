import type {
  CurrentWeatherResponse,
  Forecast5DayResponse,
} from "../../../shared/types";
import WeatherDetailHeader from "./WeatherDetailHeader";
import { Weather5Days, HourlyForecast } from "../../../shared/domains/weather";
import {
  MainGrid,
  WindSection,
  CloudsSection,
  PrecipitationSection,
  SunriseSunsetSection,
  AdditionalInfoSection,
} from "./sections";

interface MainViewProps {
  data: CurrentWeatherResponse;
  forecast5Days?: Forecast5DayResponse;
  district?: string;
  favoriteName?: string;
}

const MainView = ({
  data,
  forecast5Days,
  district,
  favoriteName,
}: MainViewProps) => {
  const { weather, main, clouds, dt, timezone, name } = data;

  const weatherIcon = weather[0]?.icon;
  const weatherDescription = weather[0]?.description || "";

  const displayName = district || name;

  return (
    <div className="min-h-[100dvh] bg-gray-50">
      <div className="sm:px-4 sm:py-8 px-3 py-5 max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-3 sm:p-6">
          <WeatherDetailHeader
            name={displayName}
            weatherIcon={weatherIcon}
            weatherDescription={weatherDescription}
            temperature={main.temp}
            timestamp={dt}
            timezone={timezone}
            data={data}
            district={district}
            favoriteName={favoriteName}
          />

          <MainGrid data={data} />

          <WindSection data={data} />

          <CloudsSection cloudsPercentage={clouds.all} />

          <PrecipitationSection data={data} />

          <SunriseSunsetSection data={data} />

          <AdditionalInfoSection data={data} />

          <HourlyForecast forecastData={forecast5Days} timezone={timezone} />

          <Weather5Days forecastData={forecast5Days} />
        </div>
      </div>
    </div>
  );
};

export default MainView;
