import React, { useState } from 'react';

export default function FormField({ field }) {
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
    patternDescription
  } = field;
  
  const [value, setValue] = useState('');
  const [touched, setTouched] = useState(false);
  const [error, setError] = useState(null);

  const validate = (inputValue) => {
    if (required && (!inputValue || inputValue.length === 0)) {
      return 'This field is required';
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
          return patternDescription || 'Invalid format';
        }
      } catch (e) {
        console.error('Invalid regex pattern:', e);
        return 'Error in validation pattern';
      }
    }
    
    return null;
  };

  const handleChange = (e) => {
    const newValue = e.target.value;
    setValue(newValue);
    
    if (touched) {
      setError(validate(newValue));
    }
  };

  const handleBlur = () => {
    setTouched(true);
    setError(validate(value));
  };

  const showCharCount = ['text', 'textarea'].includes(type) && (minLength || maxLength);
  const charCount = value.length;
  const isWithinLimits = (!minLength || charCount >= minLength) && (!maxLength || charCount <= maxLength);

  const getDefaultPlaceholder = () => {
    if (pattern) {
      if (pattern.includes('@')) {
        return 'example@domain.com';
      }
      if (pattern.includes('\\+91')) {
        return '+91 9876543210';
      }
    }
    return placeholder || `Enter ${type}...`;
  };
  
  const renderField = () => {
    switch (type) {
      case 'text':
        return (
          <div>
            <input
              type="text"
              className={`w-full px-3 py-2 border rounded-md ${error ? 'border-red-500' : ''}`}
              placeholder={getDefaultPlaceholder()}
              value={value}
              onChange={handleChange}
              onBlur={handleBlur}
              required={required}
              minLength={minLength || undefined}
              maxLength={maxLength || undefined}
              pattern={pattern}
            />
            {showCharCount && (
              <div className={`text-xs mt-1 text-right ${!isWithinLimits ? 'text-red-500' : 'text-gray-500'}`}>
                {charCount} {minLength && maxLength ? `/ ${minLength}-${maxLength}` : 
                            maxLength ? `/ ${maxLength}` : 
                            minLength ? `(min: ${minLength})` : ''}
              </div>
            )}
          </div>
        );
      case 'textarea':
        return (
          <div>
            <textarea
              className={`w-full px-3 py-2 border rounded-md ${error ? 'border-red-500' : ''}`}
              rows="3"
              placeholder={placeholder || `Enter ${type}...`}
              value={value}
              onChange={handleChange}
              onBlur={handleBlur}
              required={required}
              minLength={minLength || undefined}
              maxLength={maxLength || undefined}
            />
            {showCharCount && (
              <div className={`text-xs mt-1 text-right ${!isWithinLimits ? 'text-red-500' : 'text-gray-500'}`}>
                {charCount} {minLength && maxLength ? `/ ${minLength}-${maxLength}` : 
                            maxLength ? `/ ${maxLength}` : 
                            minLength ? `(min: ${minLength})` : ''}
              </div>
            )}
          </div>
        );
      case 'dropdown':
        return (
          <select
            className={`w-full px-3 py-2 border rounded-md ${error ? 'border-red-500' : ''}`}
            value={value}
            onChange={handleChange}
            onBlur={handleBlur}
            required={required}
          >
            <option value="">Select an option</option>
            {(options || ['Option 1', 'Option 2', 'Option 3']).map((option, index) => (
              <option key={index} value={option}>{option}</option>
            ))}
          </select>
        );
      case 'checkbox':
        return (
          <div className="flex items-center">
            <input
              type="checkbox"
              id={field.id}
              className="mr-2"
              checked={value === true}
              onChange={(e) => setValue(e.target.checked)}
              onBlur={handleBlur}
              required={required}
            />
            <label htmlFor={field.id}>{placeholder}</label>
          </div>
        );
      case 'radio':
        return (
          <div className="space-y-2">
            {(options || ['Option 1', 'Option 2', 'Option 3']).map((option, index) => (
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
                      setValue(option);
                      if (touched) setError(validate(option));
                    }
                  }}
                  onBlur={handleBlur}
                  required={required}
                />
                <label htmlFor={`${field.id}-${index}`}>{option}</label>
              </div>
            ))}
          </div>
        );
      case 'date':
        return (
          <input
            type="date"
            className={`w-full px-3 py-2 border rounded-md ${error ? 'border-red-500' : ''}`}
            value={value}
            onChange={handleChange}
            onBlur={handleBlur}
            required={required}
          />
        );
      case 'file':
        return (
          <input
            type="file"
            className={`w-full px-3 py-2 ${error ? 'text-red-500' : ''}`}
            onChange={(e) => {
              setValue(e.target.files?.[0]?.name || '');
              if (touched && required) {
                setError(e.target.files?.length ? null : 'This field is required');
              }
            }}
            onBlur={handleBlur}
            required={required}
          />
        );
      default:
        return <p>Unknown field type: {type}</p>;
    }
  };

  return (
    <div className="mb-4">
      <label className="block mb-2 font-medium">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {renderField()}
      {error && touched && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
      {helpText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helpText}</p>
      )}
    </div>
  );
}
