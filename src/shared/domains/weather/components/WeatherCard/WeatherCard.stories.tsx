import type { Meta, StoryObj } from "@storybook/react";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastProvider } from "../../../../context/ToastContext";
import WeatherCard from "./WeatherCard";
import type { CurrentWeatherResponse } from "../../../../types";

// Storybook용 QueryClient (캐시 비활성화)
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

// Mock 데이터
const mockWeatherData: CurrentWeatherResponse = {
  coord: {
    lon: 126.9779,
    lat: 37.566,
  },
  weather: [
    {
      id: 800,
      main: "Clear",
      description: "맑음",
      icon: "01d",
    },
  ],
  base: "stations",
  main: {
    temp: 22.5,
    feels_like: 21.8,
    temp_min: 18.0,
    temp_max: 26.0,
    pressure: 1013,
    humidity: 65,
  },
  visibility: 10000,
  wind: {
    speed: 3.5,
    deg: 180,
    gust: 5.2,
  },
  clouds: {
    all: 0,
  },
  dt: Math.floor(Date.now() / 1000),
  sys: {
    type: 1,
    id: 8105,
    country: "KR",
    sunrise: Math.floor(Date.now() / 1000) - 36000,
    sunset: Math.floor(Date.now() / 1000) + 36000,
  },
  timezone: 32400,
  id: 1835848,
  name: "Seoul",
  cod: 200,
};

const meta = {
  title: "Domains/Weather/WeatherCard",
  component: WeatherCard,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <ToastProvider>
            <Story />
          </ToastProvider>
        </BrowserRouter>
      </QueryClientProvider>
    ),
  ],
} satisfies Meta<typeof WeatherCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Full: Story = {
  args: {
    data: mockWeatherData,
    displayAddress: "서울특별시",
    variant: "full",
  },
};

export const Compact: Story = {
  args: {
    data: mockWeatherData,
    displayAddress: "서울특별시",
    variant: "compact",
  },
};

export const WithCustomName: Story = {
  args: {
    data: mockWeatherData,
    displayAddress: "서울특별시",
    displayName: "우리집",
    displayDistrict: "서울특별시 강남구",
    variant: "full",
  },
};

export const EditableName: Story = {
  args: {
    data: mockWeatherData,
    displayAddress: "서울특별시",
    editableName: true,
    onNameChange: (newName) => {
      console.log("Name changed to:", newName);
    },
    variant: "full",
  },
};

export const WeatherDescriptionBelow: Story = {
  args: {
    data: mockWeatherData,
    displayAddress: "서울특별시",
    weatherDescriptionPosition: "below",
    variant: "full",
  },
};

export const RainyWeather: Story = {
  args: {
    data: {
      ...mockWeatherData,
      weather: [
        {
          id: 500,
          main: "Rain",
          description: "가벼운 비",
          icon: "10d",
        },
      ],
      rain: {
        "1h": 2.5,
        "3h": 5.0,
      },
      main: {
        ...mockWeatherData.main,
        temp: 15.0,
        temp_min: 12.0,
        temp_max: 18.0,
      },
    },
    displayAddress: "서울특별시",
    variant: "full",
  },
};

export const SnowyWeather: Story = {
  args: {
    data: {
      ...mockWeatherData,
      weather: [
        {
          id: 600,
          main: "Snow",
          description: "눈",
          icon: "13d",
        },
      ],
      snow: {
        "1h": 1.0,
        "3h": 2.5,
      },
      main: {
        ...mockWeatherData.main,
        temp: -5.0,
        temp_min: -8.0,
        temp_max: -2.0,
      },
    },
    displayAddress: "서울특별시",
    variant: "full",
  },
};
