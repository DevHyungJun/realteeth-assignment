import { useLocation } from "react-router-dom";
import EmptyDetail from "./components/EmptyDetail";
import MainView from "./components/MainView";

const WeatherDetailPage = () => {
  const location = useLocation();
  const data = location.state;

  return <>{data ? <MainView data={data} /> : <EmptyDetail />}</>;
};

export default WeatherDetailPage;
