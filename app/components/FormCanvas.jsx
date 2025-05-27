import React, { useState, useEffect } from 'react';
import { useSearchParams } from '@remix-run/react';
import FormField from './FormField';
import FieldConfig from './FieldConfig';

const DRAFT_FORM_KEY = 'draftForm';
const SAVED_FORMS_KEY = 'savedForms';

function DraftNotification({ lastEdited, onDismiss }) {
  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.round(diffMs / 60000);
    
    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins === 1 ? '' : 's'} ago`;
    
    const diffHours = Math.round(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
    
    const diffDays = Math.round(diffHours / 24);
    return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
  };

  return (
    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4 rounded shadow-sm">
      <div className="flex justify-between items-center">
        <div>
          <p className="font-medium">Draft form restored</p>
          <p className="text-sm text-gray-600">
            Last edited {formatTimeAgo(lastEdited)}
          </p>
        </div>
        <button 
          onClick={onDismiss}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

export function useFormCanvas() {
  const [fields, setFields] = useState([]);
  const [formName, setFormName] = useState('');
  const [searchParams] = useSearchParams();
  const formId = searchParams.get('formId');
  const [showDraftNotice, setShowDraftNotice] = useState(false);
  const [lastEdited, setLastEdited] = useState(null);

  useEffect(() => {
    if (formId) {
      try {
        const savedForms = localStorage.getItem(SAVED_FORMS_KEY);
        if (savedForms) {
          const forms = JSON.parse(savedForms);
          const targetForm = forms.find(form => form.id === formId);
          
          if (targetForm) {
            setFields(targetForm.fields);
            setFormName(targetForm.name || 'Untitled Form');

            saveDraftForm(targetForm.name || 'Untitled Form', targetForm.fields, formId);
            return;
          }
        }
      } catch (error) {
        console.error('Error loading form:', error);
      }
    }

    try {
      const draftForm = localStorage.getItem(DRAFT_FORM_KEY);
      if (draftForm) {
        const { name, fields: draftFields, formId: draftId, lastEdited } = JSON.parse(draftForm);
        setFields(draftFields || []);
        setFormName(name || 'Untitled Form');

        if (lastEdited) {
          setLastEdited(lastEdited);
          setShowDraftNotice(true);
        }

        if (!formId && draftId && window.location.pathname === '/builder') {
          window.history.replaceState(null, '', `/builder?formId=${draftId}`);
        }
      } else if (!fields.length) {
        setFormName('Untitled Form');
      }
    } catch (error) {
      console.error('Error loading draft form:', error);
    }
  }, [formId]);

  useEffect(() => {
    if (fields.length > 0 || (formName && formName !== 'Untitled Form')) {
      saveDraftForm(formName, fields, formId);
    }
  }, [fields, formName, formId]);
  
  const saveDraftForm = (name, formFields, id) => {
    try {
      const draftData = {
        name: name,
        fields: formFields,
        formId: id,
        lastEdited: new Date().toISOString()
      };
      localStorage.setItem(DRAFT_FORM_KEY, JSON.stringify(draftData));
    } catch (error) {
      console.error('Error saving draft form:', error);
    }
  };
  
  const resetForm = () => {
    setFields([]);
    setFormName('Untitled Form');
    localStorage.removeItem(DRAFT_FORM_KEY);
    setShowDraftNotice(false);
  };

  const saveForm = (formData) => {
    console.log('Form saved:', formData);
    localStorage.removeItem(DRAFT_FORM_KEY);
    setShowDraftNotice(false);
  };
  
  const dismissDraftNotice = () => {
    setShowDraftNotice(false);
  };
  
  return {
    fields,
    setFields,
    formName,
    setFormName,
    resetForm,
    saveForm,
    isEditing: !!formId,
    showDraftNotice,
    lastEdited,
    dismissDraftNotice
  };
}

export default function FormCanvas({ 
  fields, 
  setFields,
  showDraftNotice: externalShowDraftNotice,
  lastEdited: externalLastEdited,
  dismissDraftNotice: externalDismissNotice
}) {
  const [draggedItem, setDraggedItem] = useState(null);
  const [dragOverItem, setDragOverItem] = useState(null);
  const [editingField, setEditingField] = useState(null);
  const [searchParams] = useSearchParams();
  const [showDraftNotice, setShowDraftNotice] = useState(false);
  const [lastEdited, setLastEdited] = useState(null);

  const shouldShowNotice = externalShowDraftNotice !== undefined ? externalShowDraftNotice : showDraftNotice;
  const noticeLastEdited = externalLastEdited !== undefined ? externalLastEdited : lastEdited;

  useEffect(() => {
    if (externalShowDraftNotice !== undefined) return;
    
    try {
      const draftForm = localStorage.getItem(DRAFT_FORM_KEY);
      if (draftForm) {
        const { lastEdited } = JSON.parse(draftForm);
        if (lastEdited) {
          setLastEdited(lastEdited);
          setShowDraftNotice(true);
        }
      }
    } catch (error) {
      console.error('Error checking draft form:', error);
    }
  }, [externalShowDraftNotice]);

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

  const dismissDraftNotice = () => {
    if (externalDismissNotice) {
      externalDismissNotice();
    } else {
      setShowDraftNotice(false);
    }
  };

  return (
    <div 
      className="flex-1 p-6 bg-white border border-dashed border-gray-300 min-h-screen"
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      {shouldShowNotice && noticeLastEdited && (
        <DraftNotification 
          lastEdited={noticeLastEdited} 
          onDismiss={dismissDraftNotice} 
        />
      )}
      
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
