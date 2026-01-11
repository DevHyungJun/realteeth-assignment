import type { Meta, StoryObj } from "@storybook/react";
import { ToastProvider, useToast } from "../../context/ToastContext";
import Toast from "./Toast";

// Toast 컴포넌트를 ToastProvider로 감싸는 래퍼
const ToastWrapper = () => {
  return (
    <ToastProvider>
      <Toast />
      <ToastControls />
    </ToastProvider>
  );
};

// 토스트를 표시할 수 있는 컨트롤 컴포넌트
const ToastControls = () => {
  const { showToast } = useToast();

  return (
    <div className="p-4 space-y-2">
      <h2 className="text-lg font-semibold mb-4">Toast Examples</h2>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => showToast("성공적으로 처리되었습니다.", "success")}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Success Toast
        </button>
        <button
          onClick={() => showToast("오류가 발생했습니다.", "error")}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Error Toast
        </button>
        <button
          onClick={() => showToast("경고 메시지입니다.", "warning")}
          className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
        >
          Warning Toast
        </button>
        <button
          onClick={() => showToast("정보 메시지입니다.", "info")}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Info Toast
        </button>
      </div>
    </div>
  );
};

const meta = {
  title: "Shared/UI/Toast",
  component: ToastWrapper,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof ToastWrapper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
