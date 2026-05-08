import React from "react";
import type { UseFormRegisterReturn } from "react-hook-form";

interface CurrencyInputProps {
  register: UseFormRegisterReturn;
  placeholder?: string;
}

const CurrencyInput: React.FC<CurrencyInputProps> = ({
  register,
  placeholder,
}) => {
  const handlePriceKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const isNumber = /\d/.test(e.key);
    const isDot = e.key === ".";
    const isNavigation = [
      "Backspace",
      "Delete",
      "ArrowLeft",
      "ArrowRight",
      "Tab",
      "Enter",
    ].includes(e.key);

    if (isNavigation || e.ctrlKey || e.metaKey) return;

    const currentVal = e.currentTarget.value;
    const selectionStart = e.currentTarget.selectionStart ?? 0;

    if (isDot && currentVal.includes(".")) {
      e.preventDefault();
      return;
    }

    if (currentVal.includes(".") && isNumber) {
      const dotIndex = currentVal.indexOf(".");
      const decimals = currentVal.split(".")[1];
      if (decimals && decimals.length >= 2 && selectionStart > dotIndex) {
        e.preventDefault();
        return;
      }
    }

    if (!isNumber && !isDot) {
      e.preventDefault();
    }
  };

  return (
    <div className="currency-input-wrapper">
      <span className="currency-prefix">$</span>
      <input
        type="text"
        placeholder={placeholder}
        onKeyDown={handlePriceKeyDown}
        {...register}
      />
    </div>
  );
};

export default CurrencyInput;
