import React, { useState, useEffect } from 'react';
import { useSearchParams } from '@remix-run/react';
import FormField from './FormField';
import FieldConfig from './FieldConfig';

export function useFormCanvas() {
  const [fields, setFields] = useState([]);
  const [formName, setFormName] = useState('');
  const [searchParams] = useSearchParams();
  const formId = searchParams.get('formId');
  
  useEffect(() => {
    if (formId) {
      try {
        const savedForms = localStorage.getItem('savedForms');
        if (savedForms) {
          const forms = JSON.parse(savedForms);
          const targetForm = forms.find(form => form.id === formId);
          
          if (targetForm) {
            setFields(targetForm.fields);
            setFormName(targetForm.name);
          }
        }
      } catch (error) {
        console.error('Error loading form:', error);
      }
    } else {
      try {
        const savedForm = localStorage.getItem('savedForm');
        if (savedForm && !fields.length) {
          const { fields: savedFields } = JSON.parse(savedForm);
          if (Array.isArray(savedFields)) {
            setFields(savedFields);
          }
        }
      } catch (error) {
        console.error('Error loading saved form:', error);
      }
    }
  }, [formId]);
  
  const resetForm = () => {
    setFields([]);
    setFormName('Untitled Form');
  };

  const saveForm = (formData) => {
    console.log('Form saved:', formData);
  };
  
  return {
    fields,
    setFields,
    formName,
    setFormName,
    resetForm,
    saveForm,
    isEditing: !!formId
  };
}

export default function FormCanvas({ fields, setFields }) {
  const [draggedItem, setDraggedItem] = useState(null);
  const [dragOverItem, setDragOverItem] = useState(null);
  const [editingField, setEditingField] = useState(null);

  const onDragOver = (event) => {
    event.preventDefault();
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
        required: false,
        helpText: '',
        options: fieldType === 'dropdown' || fieldType === 'radio' 
          ? ['Option 1', 'Option 2', 'Option 3'] 
          : undefined
      };
      
      setFields([...fields, newField]);
    }
  };

  const handleDragStart = (index) => {
    setDraggedItem(index);
  };

  const handleDragEnter = (index) => {
    setDragOverItem(index);
  };

  const handleDragEnd = () => {
    if (draggedItem !== null && dragOverItem !== null && draggedItem !== dragOverItem) {
      const fieldsCopy = [...fields];
      const draggedItemContent = fieldsCopy[draggedItem];
      
      fieldsCopy.splice(draggedItem, 1);
      fieldsCopy.splice(dragOverItem, 0, draggedItemContent);

      setFields(fieldsCopy);
    }

    setDraggedItem(null);
    setDragOverItem(null);
  };

  const handleEditField = (index) => {
    setEditingField(index);
  };

  const handleSaveFieldConfig = (updatedField) => {
    const newFields = [...fields];
    newFields[editingField] = updatedField;
    setFields(newFields);
    setEditingField(null);
  };

  const handleCancelFieldConfig = () => {
    setEditingField(null);
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
            {fields.map((field, index) => (
              <div 
                key={field.id} 
                className={`p-4 border rounded-md bg-gray-50 hover:shadow-md transition-shadow cursor-move
                  ${draggedItem === index ? 'opacity-50 border-dashed' : ''}
                  ${dragOverItem === index ? 'border-blue-500 bg-blue-50' : ''}`}
                draggable="true"
                onDragStart={() => handleDragStart(index)}
                onDragEnter={() => handleDragEnter(index)}
                onDragOver={(e) => e.preventDefault()}
                onDragEnd={handleDragEnd}
              >
                <div className="flex items-center mb-2 text-gray-500">
                  <span className="mr-2">☰</span>
                  <span className="text-sm">Drag to reorder</span>
                </div>
                <FormField field={field} />
                <div className="flex justify-end mt-2 space-x-2">
                  <button 
                    type="button" 
                    className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                    onClick={() => handleEditField(index)}
                  >
                    Edit
                  </button>
                  <button 
                    type="button" 
                    className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
                    onClick={() => {
                      setFields(fields.filter((_, i) => i !== index));
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

      {editingField !== null && (
        <FieldConfig 
          field={fields[editingField]} 
          onSave={handleSaveFieldConfig}
          onCancel={handleCancelFieldConfig}
        />
      )}
    </div>
  );
}
