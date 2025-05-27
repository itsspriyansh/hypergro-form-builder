import React from 'react';

export default function FormField({ field }) {
  const { type, label, placeholder, required } = field;

  const renderField = () => {
    switch (type) {
      case 'text':
        return (
          <input
            type="text"
            className="w-full px-3 py-2 border rounded-md"
            placeholder={placeholder}
            required={required}
          />
        );
      case 'textarea':
        return (
          <textarea
            className="w-full px-3 py-2 border rounded-md"
            rows="3"
            placeholder={placeholder}
            required={required}
          />
        );
      case 'dropdown':
        return (
          <select
            className="w-full px-3 py-2 border rounded-md"
            required={required}
          >
            <option value="">Select an option</option>
            <option value="option1">Option 1</option>
            <option value="option2">Option 2</option>
            <option value="option3">Option 3</option>
          </select>
        );
      case 'checkbox':
        return (
          <div className="flex items-center">
            <input
              type="checkbox"
              id={field.id}
              className="mr-2"
            />
            <label htmlFor={field.id}>{placeholder}</label>
          </div>
        );
      case 'radio':
        return (
          <div className="space-y-2">
            {['Option 1', 'Option 2', 'Option 3'].map((option, index) => (
              <div key={index} className="flex items-center">
                <input
                  type="radio"
                  id={`${field.id}-${index}`}
                  name={field.id}
                  className="mr-2"
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
            className="w-full px-3 py-2 border rounded-md"
            required={required}
          />
        );
      case 'file':
        return (
          <input
            type="file"
            className="w-full px-3 py-2"
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
    </div>
  );
}
