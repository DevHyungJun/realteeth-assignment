import type { Meta, StoryObj } from "@storybook/react";
import {
  BackIcon,
  ClearIcon,
  LocationIcon,
  RefreshIcon,
  SearchIcon,
  StarIcon,
} from "./index";

const meta = {
  title: "Shared/UI/Icons",
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllIcons: Story = {
  render: () => {
    const iconStyle = "text-gray-800";
    return (
      <div className="grid grid-cols-3 gap-8 p-8">
        <div className="flex flex-col items-center gap-2">
          <BackIcon className={iconStyle} />
          <span className="text-sm font-medium">BackIcon</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <ClearIcon className={iconStyle} />
          <span className="text-sm font-medium">ClearIcon</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <LocationIcon className={iconStyle} />
          <span className="text-sm font-medium">LocationIcon</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <RefreshIcon className={iconStyle} />
          <span className="text-sm font-medium">RefreshIcon</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <SearchIcon className={iconStyle} />
          <span className="text-sm font-medium">SearchIcon</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <StarIcon className={iconStyle} />
          <span className="text-sm font-medium">StarIcon (Outline)</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <StarIcon className={iconStyle} filled />
          <span className="text-sm font-medium">StarIcon (Filled)</span>
        </div>
      </div>
    );
  },
};

export const BackIconStory: Story = {
  render: () => <BackIcon />,
};

export const ClearIconStory: Story = {
  render: () => <ClearIcon />,
};

export const LocationIconStory: Story = {
  render: () => <LocationIcon />,
};

export const RefreshIconStory: Story = {
  render: () => <RefreshIcon />,
};

export const SearchIconStory: Story = {
  render: () => <SearchIcon />,
};

export const StarIconOutline: Story = {
  render: () => <StarIcon />,
};

export const StarIconFilled: Story = {
  render: () => <StarIcon filled />,
};
