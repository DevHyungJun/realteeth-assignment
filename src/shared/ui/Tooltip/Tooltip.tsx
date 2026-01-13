import { useState, type ReactNode } from "react";

type TooltipProps = {
  content: string;
  children: ReactNode;
  position?: "top" | "bottom" | "left" | "right";
};

const TOOLTIP_STYLES = {
  top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
  bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
  left: "right-full top-1/2 -translate-y-1/2 mr-2",
  right: "left-full top-1/2 -translate-y-1/2 ml-2",
};

const TOOLTIP_ARROW_STYLES = {
  top: "bottom-[-4px] left-1/2 -translate-x-1/2",
  bottom: "top-[-4px] left-1/2 -translate-x-1/2",
  left: "right-[-4px] top-1/2 -translate-y-1/2",
  right: "left-[-4px] top-1/2 -translate-y-1/2",
};

const Tooltip = ({ content, children, position = "top" }: TooltipProps) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <span
      className="relative inline-flex items-center"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div
          className={`min-w-[200px] max-w-[280px] absolute z-50 px-2 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm text-white bg-gray-900 rounded-lg shadow-lg pointer-events-none whitespace-normal ${
            TOOLTIP_STYLES[position as keyof typeof TOOLTIP_STYLES]
          }`}
          role="tooltip"
        >
          {content}
          <div
            className={`absolute w-2 h-2 bg-gray-900 transform rotate-45 ${
              TOOLTIP_ARROW_STYLES[
                position as keyof typeof TOOLTIP_ARROW_STYLES
              ]
            }`}
          />
        </div>
      )}
    </span>
  );
};

export default Tooltip;
