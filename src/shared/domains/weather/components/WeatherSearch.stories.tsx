import type { Meta, StoryObj } from "@storybook/react";
import { BrowserRouter } from "react-router-dom";
import WeatherSearch from "./WeatherSearch";

const meta = {
  title: "Domains/Weather/WeatherSearch",
  component: WeatherSearch,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <BrowserRouter>
        <div className="p-4 bg-gray-50 min-h-screen">
          <Story />
        </div>
      </BrowserRouter>
    ),
  ],
} satisfies Meta<typeof WeatherSearch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onSelectDistrict: (district) => {
      console.log("Selected district:", district);
    },
    onSearch: (district) => {
      console.log("Search:", district);
    },
    initialValue: null,
  },
};

export const WithInitialValue: Story = {
  args: {
    onSelectDistrict: (district) => {
      console.log("Selected district:", district);
    },
    onSearch: (district) => {
      console.log("Search:", district);
    },
    initialValue: "서울특별시",
  },
};

export const Empty: Story = {
  args: {
    onSelectDistrict: (district) => {
      console.log("Selected district:", district);
    },
    onSearch: (district) => {
      console.log("Search:", district);
    },
    initialValue: "",
  },
};
