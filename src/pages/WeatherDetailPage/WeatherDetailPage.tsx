import { useLocation } from "react-router-dom";
import type { CurrentWeatherResponse } from "../../shared/types";
import EmptyDetail from "./components/EmptyDetail";
import MainView from "./components/MainView";
import useBaseQuery from "../../shared/api/useBaseQuery";
import type { Forecast5DayResponse } from "../../shared/types";

const WeatherDetailPage = () => {
  const location = useLocation();
  const data = location.state as CurrentWeatherResponse;
  const { lat, lon } = data.coord;
  const { data: weather4Days } = useBaseQuery<Forecast5DayResponse>(
    ["weather", data.coord.lat, data.coord.lon],
    "/data/2.5/forecast",
    {
      params: {
        lat,
        lon,
      },
    }
  );

  console.log(weather4Days);

  return <>{data ? <MainView data={data} /> : <EmptyDetail />}</>;
};

export default WeatherDetailPage;
