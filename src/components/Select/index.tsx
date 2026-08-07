import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown, X } from "lucide-react";
import classNames from "classnames";
import style from "./index.module.scss";

export type SelectOption = {
  value: string;
  label: string;
};

type SelectProps = {
  value?: string;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  ariaLabel?: string;
  compact?: boolean;
  onChange: (value: string) => void;
  onClear?: () => void;
};

export function Select({
  value,
  options,
  placeholder,
  disabled,
  ariaLabel,
  compact,
  onChange,
  onClear,
}: SelectProps) {
  return (
    <div className={style.root}>
      <SelectPrimitive.Root
        value={value ?? ""}
        disabled={disabled}
        onValueChange={onChange}
      >
        <SelectPrimitive.Trigger
          className={classNames(
            style.trigger,
            compact && style.compact,
            value && onClear && style.clearable,
          )}
          aria-label={ariaLabel}
        >
          <SelectPrimitive.Value placeholder={placeholder} />
          <SelectPrimitive.Icon className={style.icon}>
            <ChevronDown size={16} />
          </SelectPrimitive.Icon>
        </SelectPrimitive.Trigger>
        <SelectPrimitive.Portal>
          <SelectPrimitive.Content
            className={style.content}
            position="popper"
            sideOffset={6}
            collisionPadding={12}
          >
            <SelectPrimitive.Viewport className={style.viewport}>
              {options.map((option) => (
                <SelectPrimitive.Item
                  className={style.item}
                  key={option.value}
                  value={option.value}
                >
                  <SelectPrimitive.ItemText>{option.label}</SelectPrimitive.ItemText>
                  <SelectPrimitive.ItemIndicator className={style.indicator}>
                    <Check size={15} />
                  </SelectPrimitive.ItemIndicator>
                </SelectPrimitive.Item>
              ))}
            </SelectPrimitive.Viewport>
          </SelectPrimitive.Content>
        </SelectPrimitive.Portal>
      </SelectPrimitive.Root>
      {value && onClear && (
        <button
          type="button"
          className={style.clear}
          aria-label={`Clear ${ariaLabel ?? placeholder ?? "selection"}`}
          disabled={disabled}
          onClick={onClear}
        >
          <X size={15} />
        </button>
      )}
    </div>
  );
}
