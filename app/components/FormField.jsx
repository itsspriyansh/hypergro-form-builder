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

  const baseInputClass = "w-full px-4 py-3 border rounded-lg shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-all duration-200 bg-white";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";
  const helpTextClass = "mt-1 text-xs text-gray-500";
  const requiredClass = "ml-1 text-red-500";

  const renderField = () => {
    const isDisabled = !editable && externalValue === undefined;

    switch (type) {
      case "text":
      case "email":
        return (
          <div>
            <input
              type={type}
              className={`${baseInputClass} hover:border-gray-400 ${
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
              className={`${baseInputClass} resize-y min-h-[100px] hover:border-gray-400 ${
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
            className={`${baseInputClass} hover:border-gray-400 appearance-none bg-no-repeat bg-right pr-10 ${
              error ? "border-red-500" : ""
            } ${isDisabled ? "bg-gray-100" : ""}`}
            style={{ 
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
              backgroundSize: '1.5em 1.5em'
            }}
            value={value}
            onChange={handleChange}
            onBlur={handleBlur}
            required={required}
            disabled={isDisabled}
          >
            <option value="">{placeholder || 'Select an option...'}</option>
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
          <div className="flex items-center mt-2 transform transition-transform duration-200 hover:translate-x-1">
            <input
              type="checkbox"
              id={field.id}
              className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer transition-all duration-150"
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
            <label htmlFor={field.id} className="ml-2 text-sm text-gray-700 cursor-pointer hover:text-blue-700 transition-colors duration-200">
              {placeholder || 'Check this box'}
            </label>
          </div>
        );
      case "radio":
        return (
          <div className="space-y-2 mt-2">
            {(options || ["Option 1", "Option 2", "Option 3"]).map(
              (option, index) => (
                <div key={index} className="flex items-center transition-transform duration-200 hover:translate-x-1">
                  <input
                    type="radio"
                    id={`${field.id}-${index}`}
                    name={field.id}
                    value={option}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 cursor-pointer transition-all duration-150"
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
                  <label htmlFor={`${field.id}-${index}`} className="ml-2 text-sm text-gray-700 cursor-pointer hover:text-blue-700 transition-colors duration-200">
                    {option}
                  </label>
                </div>
              )
            )}
          </div>
        );
      case "date":
        return (
          <input
            type="date"
            className={`${baseInputClass} hover:border-gray-400 ${
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
    <div className="relative group">
      {showStepIndicator && step && (
        <div className="absolute -left-2 -top-2 bg-blue-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center shadow-md transform transition-transform duration-200 group-hover:scale-110 z-10">
          {step}
        </div>
      )}
      
      <div className="form-field-container transition-all duration-300 hover:shadow-md p-2 rounded-lg">
        <label className={`${labelClass} flex items-center`}>
          <span className="transition-all duration-200 group-hover:text-blue-700">{label}</span>
          {required && <span className={`${requiredClass} text-sm transition-opacity duration-200`}>*</span>}
        </label>
        
        {renderField()}
        
        {helpText && (
          <p className={`${helpTextClass} italic transition-opacity duration-200 group-hover:opacity-100`}>{helpText}</p>
        )}
      </div>
      
      {error && touched && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}
