import { useRef } from "react";
import { cn } from "~/lib/utils";

interface OTPInputProps {
  value: string;
  onChange: (value: string) => void;
  length: number;
  className?: string;
}

export default function OTPInput({
  value = "",
  onChange,
  length,
  className,
}: OTPInputProps) {
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  function focusNextInput(index: number) {
    if (index < length - 1) {
      const nextInput = inputRefs.current[index + 1];
      nextInput?.focus();
    }
  }
  function focusPrevInput(index: number) {
    if (index > 0) {
      const prevInput = inputRefs.current[index - 1];
      prevInput?.focus();
    }
  }

  return (
    <div>
      {Array(length)
        .fill(0)
        .map((_, index) => (
          <input
            key={index}
            type="text"
            onKeyDown={(e) => {
              if (e.key === "ArrowLeft") {
                if (index === 0) return;
                focusPrevInput(index);
              }
              if (e.key === "ArrowRight") {
                if (index === length - 1) return;
                focusNextInput(index);
              }
            }}
            value={value[index] ?? ""}
            ref={(ref) => {
              inputRefs.current[index] = ref;
            }}
            onChange={(e) => {
              if (e.target.value.length > 1) return;
              if (e.target.value === "") {
                onChange(
                  value.slice(0, index) + value.slice(index + 1, value.length),
                );
                focusPrevInput(index);
                return;
              }

              const newValue = e.target.value;
              if (newValue.length > 1) {
                const current = value + newValue[0];
                onChange(current ?? "");
                focusNextInput(index);
              } else {
                const current = value + newValue;
                onChange(current);
                focusNextInput(index);
              }
            }}
            className={cn(
              "m-1 h-12 w-12 rounded-md border-2 border-gray-300 text-center text-4xl focus:border-blue-500 focus:outline-none",
              className,
            )}
          />
        ))}
    </div>
  );
}
