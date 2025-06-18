"use client";

import * as React from "react";
import { useImperativeHandle } from "react";

interface UseAutosizeTextAreaProps {
  textAreaRef: React.MutableRefObject<HTMLTextAreaElement | null>;
  minHeight?: number;
  maxHeight?: number;
  triggerAutoSize: string;
}

export const useAutosizeTextArea = ({
  textAreaRef,
  triggerAutoSize,
  maxHeight = 400,
  minHeight = 50,
}: UseAutosizeTextAreaProps) => {
  React.useEffect(() => {
    const textAreaElement = textAreaRef.current;
    if (textAreaElement) {
      // Reset height to get the correct scrollHeight
      textAreaElement.style.height = `${minHeight}px`;
      const scrollHeight = textAreaElement.scrollHeight;

      // Set the final height (clamped between min and max)
      const newHeight = Math.min(Math.max(scrollHeight, minHeight), maxHeight);
      textAreaElement.style.height = `${newHeight}px`;
    }
  }, [textAreaRef.current, triggerAutoSize, minHeight, maxHeight]);
};

export type AutosizeTextAreaRef = {
  textArea: HTMLTextAreaElement;
  focus: () => void;
};

type AutosizeTextAreaProps = {
  minHeight?: number;
  maxHeight?: number;
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export const AutosizeTextArea = React.forwardRef<
  AutosizeTextAreaRef,
  AutosizeTextAreaProps
>(
  (
    { minHeight = 50, maxHeight = 400, value, onChange, className, ...props },
    ref,
  ) => {
    const textAreaRef = React.useRef<HTMLTextAreaElement | null>(null);
    const [triggerAutoSize, setTriggerAutoSize] = React.useState(
      (value as string) || "",
    );

    useAutosizeTextArea({
      textAreaRef,
      triggerAutoSize,
      minHeight,
      maxHeight,
    });

    useImperativeHandle(ref, () => ({
      textArea: textAreaRef.current as HTMLTextAreaElement,
      focus: () => textAreaRef.current?.focus(),
    }));

    React.useEffect(() => {
      setTriggerAutoSize((value as string) || "");
    }, [value]);

    return (
      <textarea
        {...props}
        value={value}
        ref={textAreaRef}
        className={cn(
          "flex w-full rounded-md border-none border-input px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 shadow-none",
          className,
        )}
        style={{ resize: "none" }}
        onChange={(e) => {
          setTriggerAutoSize(e.target.value);
          onChange?.(e);
        }}
      />
    );
  },
);

AutosizeTextArea.displayName = "AutosizeTextArea";

function cn(...inputs: any[]) {
  // You can use your own classname utility or shadcn's if available
  return inputs.filter(Boolean).join(" ");
}
