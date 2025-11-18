import * as React from "react";
import { ChevronUp, ChevronDown, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface NumberInputProps extends Omit<React.ComponentProps<"input">, "type"> {
  onIncrement?: () => void;
  onDecrement?: () => void;
  showSuccessIcon?: boolean;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
}

const NumberInput = React.forwardRef<HTMLInputElement, NumberInputProps>(
  ({ className, onIncrement, onDecrement, showSuccessIcon, prefix, suffix, disabled, value, ...props }, ref) => {
    const handleIncrement = () => {
      if (!disabled && onIncrement) {
        onIncrement();
      }
    };

    const handleDecrement = () => {
      if (!disabled && onDecrement) {
        onDecrement();
      }
    };

    return (
      <div className={cn("relative flex items-center w-full", className)}>
        <div className="flex items-center w-full border border-input rounded-md overflow-hidden bg-background relative">
          {prefix && <span className="absolute right-3 z-10 flex items-center">{prefix}</span>}
          <div className="flex flex-col border-l border-input">
            <button
              type="button"
              onClick={handleIncrement}
              disabled={disabled}
              className="flex items-center justify-center h-5 w-6 border-b border-input hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Increase Value"
            >
              <ChevronUp className="h-3 w-3" />
            </button>
            <button
              type="button"
              onClick={handleDecrement}
              disabled={disabled}
              className="flex items-center justify-center h-5 w-6 hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Decrease Value"
            >
              <ChevronDown className="h-3 w-3" />
            </button>
          </div>
          <div className="flex-1 relative">
            <input
              type="number"
              ref={ref}
              value={value}
              disabled={disabled}
              className={cn(
                "w-full h-10 px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                prefix ? "pr-10" : "",
                (suffix || showSuccessIcon) ? "pl-10" : "",
              )}
              {...props}
            />
            {(suffix || showSuccessIcon) && (
              <span className="absolute left-3 top-1/2 -translate-y-1/2 z-10 flex items-center">
                {showSuccessIcon ? <CheckCircle2 className="h-4 w-4 text-green-600" /> : suffix}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  },
);
NumberInput.displayName = "NumberInput";

export { NumberInput };

