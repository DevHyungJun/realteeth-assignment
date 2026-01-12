import { Helmet } from "react-helmet-async";

const MainPageSEO = () => {
  return (
    <Helmet>
      <title>날씨 정보 조회 - 실시간 날씨 및 예보</title>
      <meta
        name="description"
        content="OpenWeatherMap API와 VWorld API를 활용한 실시간 날씨 정보 조회 서비스. 현재 위치 기반 날씨 조회, 지역 검색, 즐겨찾기 기능을 제공합니다."
      />
      <meta
        name="keywords"
        content="날씨, 날씨 예보, 실시간 날씨, 기상 정보, 날씨 앱, Weather, Weather Forecast"
      />
      <meta property="og:title" content="날씨 정보 조회 - 실시간 날씨 및 예보" />
      <meta
        property="og:description"
        content="OpenWeatherMap API와 VWorld API를 활용한 실시간 날씨 정보 조회 서비스"
      />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://realteeth-assignment.vercel.app/" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="날씨 정보 조회 - 실시간 날씨 및 예보" />
      <meta
        name="twitter:description"
        content="OpenWeatherMap API와 VWorld API를 활용한 실시간 날씨 정보 조회 서비스"
      />
    </Helmet>
  );
};

export default MainPageSEO;
