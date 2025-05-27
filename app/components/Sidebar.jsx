import React from 'react';

const FIELD_TYPES = [
  { id: 'text', label: 'Text Field', icon: '📝' },
  { id: 'textarea', label: 'Text Area', icon: '📄' },
  { id: 'dropdown', label: 'Dropdown', icon: '▼' },
  { id: 'checkbox', label: 'Checkbox', icon: '☑️' },
  { id: 'radio', label: 'Radio Button', icon: '⚪' },
  { id: 'date', label: 'Date Picker', icon: '📅' },
  { id: 'file', label: 'File Upload', icon: '📎' }
];

export default function Sidebar({ fields, onReset, onSave }) {
  const onDragStart = (event, fieldType) => {
    event.dataTransfer.setData('fieldType', fieldType);
    event.dataTransfer.effectAllowed = 'copy';
  };

  const handleSave = () => {
    const formData = {
      id: `form-${Date.now()}`,
      fields: fields,
      updatedAt: new Date().toISOString()
    };
    
    // Save to localStorage
    localStorage.setItem('savedForm', JSON.stringify(formData));
    alert('Form saved successfully!');
    
    if (onSave) onSave(formData);
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to clear all form fields?')) {
      onReset();
    }
  };

  return (
    <div className="w-64 bg-gray-100 p-4 border-r border-gray-200 h-full overflow-auto">
      <h2 className="text-lg font-semibold mb-4">Form Elements</h2>
      <div className="space-y-2">
        {FIELD_TYPES.map((field) => (
          <div
            key={field.id}
            className="bg-white p-3 rounded border border-gray-300 cursor-move flex items-center shadow-sm hover:shadow-md transition-shadow"
            draggable
            onDragStart={(e) => onDragStart(e, field.id)}
          >
            <span className="mr-2 text-xl">{field.icon}</span>
            <span>{field.label}</span>
          </div>
        ))}
      </div>
      
      <div className="mt-8 space-y-3">
        <button
          onClick={handleSave}
          className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded flex items-center justify-center"
        >
          <span className="mr-2">💾</span>
          Save Form
        </button>
        
        <button
          onClick={handleReset}
          className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded flex items-center justify-center"
        >
          <span className="mr-2">🗑️</span>
          Reset Form
        </button>
      </div>
    </div>
  );
}
