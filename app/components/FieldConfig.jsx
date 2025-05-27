import React, { useState, useEffect } from 'react';

const VALIDATION_PATTERNS = {
  email: {
    pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
    description: 'Standard email format (example@domain.com)'
  },
  phone: {
    pattern: '^(\\+91[\\-\\s]?)?[0]?(91)?[6789]\\d{9}$',
    description: 'Indian phone format (e.g., +91 9876543210, 9876543210)'
  },
  custom: {
    pattern: '',
    description: 'Custom pattern (RegEx)'
  }
};

export default function FieldConfig({ field, onSave, onCancel }) {
  const [config, setConfig] = useState({
    label: '',
    placeholder: '',
    required: false,
    helpText: '',
    options: [],
    minLength: '',
    maxLength: '',
    patternType: 'none',
    pattern: '',
    patternDescription: ''
  });

  useEffect(() => {
    let patternType = 'none';
    let pattern = '';
    let patternDescription = '';
    
    if (field.pattern) {
      if (field.pattern === VALIDATION_PATTERNS.email.pattern) {
        patternType = 'email';
      } else if (field.pattern === VALIDATION_PATTERNS.phone.pattern) {
        patternType = 'phone';
      } else {
        patternType = 'custom';
      }
      pattern = field.pattern;
      patternDescription = field.patternDescription || '';
    }

    setConfig({
      label: field.label || '',
      placeholder: field.placeholder || '',
      required: field.required || false,
      helpText: field.helpText || '',
      options: field.options || ['Option 1', 'Option 2', 'Option 3'],
      minLength: field.minLength || '',
      maxLength: field.maxLength || '',
      patternType,
      pattern,
      patternDescription
    });
  }, [field]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === 'minLength' || name === 'maxLength') {
      const numValue = value === '' ? '' : parseInt(value, 10);
      setConfig({
        ...config,
        [name]: numValue
      });
    } else {
      setConfig({
        ...config,
        [name]: type === 'checkbox' ? checked : value
      });
    }
  };

  const handlePatternTypeChange = (e) => {
    const patternType = e.target.value;
    
    if (patternType === 'none') {
      setConfig({
        ...config,
        patternType,
        pattern: '',
        patternDescription: ''
      });
    } else if (patternType in VALIDATION_PATTERNS) {
      setConfig({
        ...config,
        patternType,
        pattern: VALIDATION_PATTERNS[patternType].pattern,
        patternDescription: VALIDATION_PATTERNS[patternType].description
      });
    }
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...config.options];
    newOptions[index] = value;
    setConfig({ ...config, options: newOptions });
  };

  const addOption = () => {
    setConfig({
      ...config,
      options: [...config.options, `Option ${config.options.length + 1}`]
    });
  };

  const removeOption = (index) => {
    const newOptions = config.options.filter((_, i) => i !== index);
    setConfig({ ...config, options: newOptions });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const fieldConfig = { ...field, ...config };

    if (config.patternType === 'none') {
      delete fieldConfig.pattern;
      delete fieldConfig.patternDescription;
    }

    if (config.patternType === 'email' && !fieldConfig.placeholder) {
      fieldConfig.placeholder = 'example@domain.com';
    } else if (config.patternType === 'phone' && !fieldConfig.placeholder) {
      fieldConfig.placeholder = '+91 9876543210';
    }
    
    onSave(fieldConfig);
  };

  const supportsLengthValidation = ['text', 'textarea'].includes(field.type);

  const supportsPatternValidation = field.type === 'text';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white p-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-semibold">Configure {field.type} Field</h3>
          <button 
            type="button" 
            className="text-gray-500 hover:text-gray-700"
            onClick={onCancel}
          >
            ✕
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4">
          <div className="space-y-4">

            <div>
              <label className="block text-sm font-medium mb-1">Field Label</label>
              <input
                type="text"
                name="label"
                value={config.label}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>

            {field.type !== 'checkbox' && field.type !== 'radio' && (
              <div>
                <label className="block text-sm font-medium mb-1">Placeholder</label>
                <input
                  type="text"
                  name="placeholder"
                  value={config.placeholder}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-1">Help Text</label>
              <input
                type="text"
                name="helpText"
                value={config.helpText}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Optional guidance for this field"
              />
            </div>

            <div className="pt-2 pb-1 border-t border-gray-200">
              <h4 className="font-medium text-sm mb-2">Validation</h4>
              
              <div className="flex items-center mb-3">
                <input
                  type="checkbox"
                  id="required"
                  name="required"
                  checked={config.required}
                  onChange={handleChange}
                  className="mr-2"
                />
                <label htmlFor="required" className="text-sm font-medium">Required Field</label>
              </div>
              
              {supportsLengthValidation && (
                <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-3 sm:space-y-0 mb-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium mb-1">Min Length</label>
                    <input
                      type="number"
                      name="minLength"
                      value={config.minLength}
                      onChange={handleChange}
                      min="0"
                      className="w-full px-3 py-2 border rounded-md"
                      placeholder="Optional"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium mb-1">Max Length</label>
                    <input
                      type="number"
                      name="maxLength"
                      value={config.maxLength}
                      onChange={handleChange}
                      min="0"
                      className="w-full px-3 py-2 border rounded-md"
                      placeholder="Optional"
                    />
                  </div>
                </div>
              )}
              
              {supportsPatternValidation && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">Format Validation</label>
                    <select
                      className="w-full px-3 py-2 border rounded-md"
                      value={config.patternType}
                      onChange={handlePatternTypeChange}
                    >
                      <option value="none">None</option>
                      <option value="email">Email</option>
                      <option value="phone">Phone Number</option>
                      <option value="custom">Custom Pattern</option>
                    </select>
                  </div>
                  
                  {config.patternType === 'custom' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium mb-1">Custom Pattern (RegEx)</label>
                        <input
                          type="text"
                          name="pattern"
                          value={config.pattern}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border rounded-md"
                          placeholder="Regular expression"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Pattern Description</label>
                        <input
                          type="text"
                          name="patternDescription"
                          value={config.patternDescription}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border rounded-md"
                          placeholder="Explanation of the pattern for users"
                        />
                      </div>
                    </>
                  )}
                  
                  {config.patternType !== 'none' && config.patternType !== 'custom' && (
                    <div className="p-3 bg-gray-50 rounded text-sm">
                      <p className="font-medium mb-1">Pattern:</p>
                      <code className="text-xs bg-gray-100 p-1 rounded break-all">{config.pattern}</code>
                      <p className="font-medium mt-2 mb-1">Description:</p>
                      <p className="text-gray-600">{config.patternDescription}</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {(field.type === 'dropdown' || field.type === 'radio') && (
              <div>
                <label className="block text-sm font-medium mb-2">Options</label>
                <div className="space-y-2">
                  {config.options.map((option, index) => (
                    <div key={index} className="flex items-center">
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => handleOptionChange(index, e.target.value)}
                        className="flex-1 px-3 py-2 border rounded-md mr-2"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => removeOption(index)}
                        className="px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
                        disabled={config.options.length <= 1}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  
                  <button
                    type="button"
                    onClick={addOption}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 w-full"
                  >
                    + Add Option
                  </button>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex justify-end space-x-2 mt-6 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 sm:inline-block hidden"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
