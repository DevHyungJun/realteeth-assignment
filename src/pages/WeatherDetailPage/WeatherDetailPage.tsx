import { useLocation } from "react-router-dom";
import type { CurrentWeatherResponse } from "../../shared/types";
import EmptyDetail from "./components/EmptyDetail";
import MainView from "./components/MainView";
import useBaseQuery from "../../shared/api/useBaseQuery";
import type { Forecast5DayResponse } from "../../shared/types";

type WeatherDetailState = CurrentWeatherResponse & {
  district?: string;
  favoriteName?: string;
};

const WeatherDetailPage = () => {
  const location = useLocation();
  const state = location.state as WeatherDetailState | null;
  const data = state as CurrentWeatherResponse | null;
  const district = (state as WeatherDetailState)?.district;
  const favoriteName = (state as WeatherDetailState)?.favoriteName;

  if (!data) {
    return <EmptyDetail />;
  }

  const { lat, lon } = data.coord;
  const { data: weather5Days } = useBaseQuery<Forecast5DayResponse>(
    ["weather-forecast", data.coord.lat, data.coord.lon],
    "/data/2.5/forecast",
    {
      params: {
        lat,
        lon,
      },
    }
  );

  return (
    <>
      <MainView data={data} forecast5Days={weather5Days} district={district} favoriteName={favoriteName} />
    </>
  );
};

export default WeatherDetailPage;
