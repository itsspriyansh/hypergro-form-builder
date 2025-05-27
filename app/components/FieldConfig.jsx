import React, { useState, useEffect } from 'react';

export default function FieldConfig({ field, onSave, onCancel }) {
  const [config, setConfig] = useState({
    label: '',
    placeholder: '',
    required: false,
    helpText: '',
    options: []
  });

  useEffect(() => {
    setConfig({
      label: field.label || '',
      placeholder: field.placeholder || '',
      required: field.required || false,
      helpText: field.helpText || '',
      options: field.options || ['Option 1', 'Option 2', 'Option 3']
    });
  }, [field]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setConfig({
      ...config,
      [name]: type === 'checkbox' ? checked : value
    });
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
    onSave({ ...field, ...config });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-semibold mb-4">Configure {field.type} Field</h3>
        
        <form onSubmit={handleSubmit}>
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

            <div className="flex items-center">
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
          
          <div className="flex justify-end space-x-2 mt-6">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
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
