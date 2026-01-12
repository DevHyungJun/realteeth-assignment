import { Helmet } from "react-helmet-async";
import type { CurrentWeatherResponse } from "../types";
import { getTemperature } from "../utils";

type WeatherDetailSEOProps = {
  data: CurrentWeatherResponse | null;
  district?: string;
  favoriteName?: string;
};

const WeatherDetailSEO = ({
  data,
  district,
  favoriteName,
}: WeatherDetailSEOProps) => {
  const displayName = favoriteName || district || data?.name || "날씨 정보";
  const temperature = data ? getTemperature(data.main.temp) : "";
  const weatherDescription = data?.weather[0]?.description || "";
  const pageTitle = data
    ? `${displayName} 날씨 - ${temperature}° ${weatherDescription}`
    : "날씨 상세 정보";
  const pageDescription = data
    ? `${displayName}의 현재 날씨: ${temperature}°, ${weatherDescription}. 최저 ${getTemperature(data.main.temp_min)}°, 최고 ${getTemperature(data.main.temp_max)}°. 습도 ${data.main.humidity}%, 풍속 ${data.wind.speed}m/s`
    : "날씨 상세 정보를 확인하세요.";

  return (
    <Helmet>
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      <meta
        name="keywords"
        content={`${displayName}, 날씨, 날씨 예보, ${weatherDescription}, 기상 정보`}
      />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:type" content="website" />
      <meta
        property="og:url"
        content={`https://realteeth-assignment.vercel.app/weather-detail`}
      />
      {data?.weather[0]?.icon && (
        <meta
          property="og:image"
          content={`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`}
        />
      )}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      {data?.weather[0]?.icon && (
        <meta
          name="twitter:image"
          content={`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`}
        />
      )}
    </Helmet>
  );
};

export default WeatherDetailSEO;
