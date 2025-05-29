import React, { useState, useEffect } from 'react';
import { MdClose, MdAdd } from 'react-icons/md';

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

export default function FieldConfig({ field, onSave, onCancel, maxSteps = 1 }) {
  const [updatedField, setUpdatedField] = useState({ ...field });
  const [options, setOptions] = useState(field.options || []);
  const [newOption, setNewOption] = useState('');

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setUpdatedField(prev => ({ ...prev, [name]: checked }));
    } else {
      setUpdatedField(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleAddOption = () => {
    if (newOption.trim()) {
      setOptions(prev => [...prev, newOption.trim()]);
      setNewOption('');
    }
  };

  const handleRemoveOption = (index) => {
    setOptions(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    const fieldToSave = { ...updatedField };
    if (fieldToSave.type === 'dropdown' || fieldToSave.type === 'radio') {
      fieldToSave.options = options;
    }
    onSave(fieldToSave);
  };

  const inputClass = "w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:ring-opacity-50 transition-all duration-200";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";
  const buttonClass = "inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200";
  const primaryButtonClass = `${buttonClass} text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 focus:ring-blue-500 transform hover:scale-105`;
  const secondaryButtonClass = `${buttonClass} text-gray-700 bg-white border-gray-300 hover:bg-gray-50 focus:ring-blue-500 transform hover:scale-105`;
  const dangerButtonClass = `${buttonClass} text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 focus:ring-red-500 transform hover:scale-105`;

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn" style={{backgroundColor: "rgba(0, 0, 0, 0.5)"}}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-auto transform transition-all duration-300 ease-out animate-scaleIn">
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 rounded-t-xl">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-white">Configure Field</h2>
            <button 
              onClick={onCancel} 
              className="text-white hover:text-blue-200 hover:bg-blue-800 rounded-full p-1 transition-all duration-200 transform hover:rotate-90"
            >
              <MdClose className="h-6 w-6" />
            </button>
          </div>
        </div>
        
        <div className="p-6">
          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label htmlFor="label" className={labelClass}>Field Label</label>
                <input
                  type="text"
                  id="label"
                  name="label"
                  value={updatedField.label}
                  onChange={handleInputChange}
                  className={inputClass}
                />
              </div>
              
              <div>
                <label htmlFor="type" className={labelClass}>Field Type</label>
                <select
                  id="type"
                  name="type"
                  value={updatedField.type}
                  onChange={handleInputChange}
                  className={`${inputClass} appearance-none bg-no-repeat bg-right pr-10`}
                  style={{ 
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                    backgroundSize: '1.5em 1.5em'
                  }}
                  disabled
                >
                  <option value="text">Text</option>
                  <option value="textarea">Textarea</option>
                  <option value="email">Email</option>
                  <option value="number">Number</option>
                  <option value="date">Date</option>
                  <option value="dropdown">Dropdown</option>
                  <option value="radio">Radio</option>
                  <option value="checkbox">Checkbox</option>
                </select>
              </div>
            </div>
            
            <div>
              <label htmlFor="placeholder" className={labelClass}>Placeholder Text</label>
              <input
                type="text"
                id="placeholder"
                name="placeholder"
                value={updatedField.placeholder}
                onChange={handleInputChange}
                className={inputClass}
              />
            </div>
            
            <div>
              <label htmlFor="helpText" className={labelClass}>Help Text</label>
              <input
                type="text"
                id="helpText"
                name="helpText"
                value={updatedField.helpText}
                onChange={handleInputChange}
                className={inputClass}
                placeholder="Additional information to help users fill out this field"
              />
            </div>
            
            {(updatedField.type === 'text' || updatedField.type === 'textarea') && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="minLength" className={labelClass}>Minimum Length</label>
                  <input
                    type="number"
                    id="minLength"
                    name="minLength"
                    value={updatedField.minLength}
                    onChange={handleInputChange}
                    className={inputClass}
                    min="0"
                  />
                </div>
                
                <div>
                  <label htmlFor="maxLength" className={labelClass}>Maximum Length</label>
                  <input
                    type="number"
                    id="maxLength"
                    name="maxLength"
                    value={updatedField.maxLength}
                    onChange={handleInputChange}
                    className={inputClass}
                    min="0"
                  />
                </div>
              </div>
            )}
            
            {(updatedField.type === 'dropdown' || updatedField.type === 'radio') && (
              <div className="space-y-3">
                <label className={labelClass}>Options</label>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  {options.map((option, index) => (
                    <div key={index} className="flex items-center mb-2 group">
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => {
                          const newOptions = [...options];
                          newOptions[index] = e.target.value;
                          setOptions(newOptions);
                        }}
                        className={`${inputClass} group-hover:border-blue-300 transition-all duration-200`}
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveOption(index)}
                        className="ml-2 text-gray-400 hover:text-red-500 p-2 rounded-full hover:bg-red-50 transition-all duration-200"
                      >
                        <MdClose />
                      </button>
                    </div>
                  ))}
                  
                  <div className="flex mt-3">
                    <input
                      type="text"
                      value={newOption}
                      onChange={(e) => setNewOption(e.target.value)}
                      placeholder="Add new option"
                      className={inputClass}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddOption();
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={handleAddOption}
                      className="ml-2 bg-blue-100 text-blue-600 hover:bg-blue-200 p-2 rounded-md transition-all duration-200 flex items-center"
                    >
                      <MdAdd className="mr-1" /> Add
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="required"
                  name="required"
                  checked={updatedField.required || false}
                  onChange={handleInputChange}
                  className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 transition-colors duration-200"
                />
                <label htmlFor="required" className="ml-2 block text-sm text-gray-700">
                  Required Field
                </label>
              </div>
              
              <div>
                <label htmlFor="step" className={labelClass}>Form Step</label>
                <select
                  id="step"
                  name="step"
                  value={updatedField.step || 1}
                  onChange={handleInputChange}
                  className={`${inputClass} appearance-none bg-no-repeat bg-right pr-10`}
                  style={{ 
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                    backgroundSize: '1.5em 1.5em'
                  }}
                >
                  {Array.from({ length: maxSteps }, (_, i) => i + 1).map((step) => (
                    <option key={step} value={step}>Step {step}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
        
        <div className="sticky bottom-0 bg-gray-50 px-6 py-4 rounded-b-xl border-t border-gray-200 flex justify-between">
          <button 
            type="button" 
            onClick={onCancel} 
            className={secondaryButtonClass}
          >
            Cancel
          </button>
          
          <button 
            type="button" 
            onClick={handleSave} 
            className={primaryButtonClass}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
