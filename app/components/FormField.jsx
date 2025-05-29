import React, { useState } from "react";

export default function FormField({
  field,
  showStepIndicator = false,
  value: externalValue,
  onChange: externalOnChange,
  editable = false,
}) {
  const {
    type,
    label,
    placeholder,
    required,
    helpText,
    options,
    minLength,
    maxLength,
    pattern,
    patternDescription,
    step,
  } = field;

  const [internalValue, setInternalValue] = useState("");
  const [touched, setTouched] = useState(false);
  const [error, setError] = useState(null);

  const value = externalValue !== undefined ? externalValue : internalValue;

  const validate = (inputValue) => {
    if (required && (!inputValue || inputValue.length === 0)) {
      return "This field is required";
    }

    if (minLength && inputValue.length < minLength) {
      return `Minimum length is ${minLength} characters`;
    }

    if (maxLength && inputValue.length > maxLength) {
      return `Maximum length is ${maxLength} characters`;
    }

    if (pattern && inputValue) {
      try {
        const regex = new RegExp(pattern);
        if (!regex.test(inputValue)) {
          return patternDescription || "Invalid format";
        }
      } catch (e) {
        console.error("Invalid regex pattern:", e);
        return "Error in validation pattern";
      }
    }

    return null;
  };

  const handleChange = (e) => {
    const newValue =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;

    if (externalValue === undefined) {
      setInternalValue(newValue);
    }

    if (externalOnChange) {
      externalOnChange(newValue);
    }

    if (touched) {
      setError(validate(newValue));
    }
  };

  const handleBlur = () => {
    setTouched(true);
    setError(validate(value));
  };

  const showCharCount =
    ["text", "textarea"].includes(type) && (minLength || maxLength);
  const charCount = value ? value.length : 0;
  const isWithinLimits =
    (!minLength || charCount >= minLength) &&
    (!maxLength || charCount <= maxLength);

  const getDefaultPlaceholder = () => {
    if (pattern) {
      if (pattern.includes("@")) {
        return "example@domain.com";
      }
      if (pattern.includes("\\+91")) {
        return "+91 9876543210";
      }
    }
    return placeholder || `Enter ${type}...`;
  };

  const renderField = () => {
    const isDisabled = !editable && externalValue === undefined;

    switch (type) {
      case "text":
      case "email":
        return (
          <div>
            <input
              type={type}
              className={`w-full px-3 py-2 border rounded-md ${
                error ? "border-red-500" : ""
              } ${isDisabled ? "bg-gray-100" : ""}`}
              placeholder={getDefaultPlaceholder()}
              value={value}
              onChange={handleChange}
              onBlur={handleBlur}
              required={required}
              minLength={minLength || undefined}
              maxLength={maxLength || undefined}
              pattern={pattern}
              disabled={isDisabled}
            />
            {showCharCount && (
              <div
                className={`text-xs mt-1 text-right ${
                  !isWithinLimits ? "text-red-500" : "text-gray-500"
                }`}
              >
                {charCount}{" "}
                {minLength && maxLength
                  ? `/ ${minLength}-${maxLength}`
                  : maxLength
                  ? `/ ${maxLength}`
                  : minLength
                  ? `(min: ${minLength})`
                  : ""}
              </div>
            )}
          </div>
        );
      case "textarea":
        return (
          <div>
            <textarea
              className={`w-full px-3 py-2 border rounded-md ${
                error ? "border-red-500" : ""
              } ${isDisabled ? "bg-gray-100" : ""}`}
              rows="3"
              placeholder={placeholder || `Enter ${type}...`}
              value={value}
              onChange={handleChange}
              onBlur={handleBlur}
              required={required}
              minLength={minLength || undefined}
              maxLength={maxLength || undefined}
              disabled={isDisabled}
            />
            {showCharCount && (
              <div
                className={`text-xs mt-1 text-right ${
                  !isWithinLimits ? "text-red-500" : "text-gray-500"
                }`}
              >
                {charCount}{" "}
                {minLength && maxLength
                  ? `/ ${minLength}-${maxLength}`
                  : maxLength
                  ? `/ ${maxLength}`
                  : minLength
                  ? `(min: ${minLength})`
                  : ""}
              </div>
            )}
          </div>
        );
      case "dropdown":
        return (
          <select
            className={`w-full px-3 py-2 border rounded-md ${
              error ? "border-red-500" : ""
            } ${isDisabled ? "bg-gray-100" : ""}`}
            value={value}
            onChange={handleChange}
            onBlur={handleBlur}
            required={required}
            disabled={isDisabled}
          >
            <option value="">Select an option</option>
            {(options || ["Option 1", "Option 2", "Option 3"]).map(
              (option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              )
            )}
          </select>
        );
      case "checkbox":
        return (
          <div className="flex items-center">
            <input
              type="checkbox"
              id={field.id}
              className="mr-2"
              checked={value === true}
              onChange={(e) => {
                if (externalOnChange) {
                  externalOnChange(e.target.checked);
                } else {
                  setInternalValue(e.target.checked);
                }
                if (touched) setError(validate(e.target.checked));
              }}
              onBlur={handleBlur}
              required={required}
              disabled={isDisabled}
            />
            <label htmlFor={field.id}>{placeholder}</label>
          </div>
        );
      case "radio":
        return (
          <div className="space-y-2">
            {(options || ["Option 1", "Option 2", "Option 3"]).map(
              (option, index) => (
                <div key={index} className="flex items-center">
                  <input
                    type="radio"
                    id={`${field.id}-${index}`}
                    name={field.id}
                    className="mr-2"
                    value={option}
                    checked={value === option}
                    onChange={(e) => {
                      if (e.target.checked) {
                        if (externalOnChange) {
                          externalOnChange(option);
                        } else {
                          setInternalValue(option);
                        }
                        if (touched) setError(validate(option));
                      }
                    }}
                    onBlur={handleBlur}
                    required={required}
                    disabled={isDisabled}
                  />
                  <label htmlFor={`${field.id}-${index}`}>{option}</label>
                </div>
              )
            )}
          </div>
        );
      case "date":
        return (
          <input
            type="date"
            className={`w-full px-3 py-2 border rounded-md ${
              error ? "border-red-500" : ""
            } ${isDisabled ? "bg-gray-100" : ""}`}
            value={value}
            onChange={handleChange}
            onBlur={handleBlur}
            required={required}
            disabled={isDisabled}
          />
        );
      case "file":
        return (
          <input
            type="file"
            className={`w-full px-3 py-2 ${error ? "text-red-500" : ""} ${
              isDisabled ? "opacity-50" : ""
            }`}
            onChange={(e) => {
              const fileName = e.target.files?.[0]?.name || "";
              if (externalOnChange) {
                externalOnChange(fileName);
              } else {
                setInternalValue(fileName);
              }
              if (touched && required) {
                setError(
                  e.target.files?.length ? null : "This field is required"
                );
              }
            }}
            onBlur={handleBlur}
            required={required}
            disabled={isDisabled}
          />
        );
      default:
        return <p>Unknown field type: {type}</p>;
    }
  };

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-2">
        <label className="font-medium">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        {showStepIndicator && step && (
          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
            Step {step}
          </span>
        )}
      </div>
      {renderField()}
      {error && touched && <p className="mt-1 text-sm text-red-500">{error}</p>}
      {helpText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helpText}</p>
      )}
    </div>
  );
}
