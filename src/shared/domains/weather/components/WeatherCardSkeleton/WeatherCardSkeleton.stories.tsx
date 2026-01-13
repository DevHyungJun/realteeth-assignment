import type { Meta, StoryObj } from "@storybook/react";
import WeatherCardSkeleton from "./WeatherCardSkeleton";

const meta = {
  title: "Domains/Weather/WeatherCardSkeleton",
  component: WeatherCardSkeleton,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof WeatherCardSkeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Single: Story = {
  args: {
    count: 1,
  },
};

export const Multiple: Story = {
  args: {
    count: 3,
  },
};

export const Many: Story = {
  args: {
    count: 6,
  },
};
