import React, { useState } from 'react';
import FormField from './FormField';

export default function FormCanvas() {
  const [fields, setFields] = useState([]);
  
  const onDragOver = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
  };
  
  const onDrop = (event) => {
    event.preventDefault();
    const fieldType = event.dataTransfer.getData('fieldType');
    
    if (fieldType) {
      const newField = {
        id: `field-${Date.now()}`,
        type: fieldType,
        label: `New ${fieldType} field`,
        placeholder: `Enter ${fieldType}...`,
        required: false
      };
      
      setFields([...fields, newField]);
    }
  };

  return (
    <div 
      className="flex-1 p-6 bg-white border border-dashed border-gray-300 min-h-screen"
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      {fields.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-400 text-lg">Drag and drop form elements here</p>
        </div>
      ) : (
        <div className="space-y-6 max-w-2xl mx-auto">
          <h2 className="text-xl font-semibold pb-2 border-b">Form Preview</h2>
          <form className="space-y-4">
            {fields.map((field) => (
              <div key={field.id} className="p-4 border rounded-md bg-gray-50 hover:shadow-md transition-shadow">
                <FormField field={field} />
                <div className="flex justify-end mt-2 space-x-2">
                  <button 
                    type="button" 
                    className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                    onClick={() => {
                      // This would open field settings in a real implementation
                      alert(`Edit settings for ${field.label}`);
                    }}
                  >
                    Edit
                  </button>
                  <button 
                    type="button" 
                    className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
                    onClick={() => {
                      setFields(fields.filter(f => f.id !== field.id));
                    }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </form>
        </div>
      )}
    </div>
  );
}
