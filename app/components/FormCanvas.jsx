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


function StepProgressBar({ currentStep, totalSteps, onStepClick }) {
  return (
    <div className="mb-6">
      <div className="flex justify-between w-full mb-2">
        {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
          <div 
            key={step} 
            className="flex flex-col items-center cursor-pointer"
            onClick={() => onStepClick(step)}
          >
            <div 
              className={`w-8 h-8 flex items-center justify-center rounded-full 
                ${step < currentStep ? 'bg-green-500 text-white' : 
                 step === currentStep ? 'bg-blue-500 text-white' : 
                 'bg-gray-200 text-gray-500'}`}
            >
              {step}
            </div>
            <span className="text-xs mt-1">Step {step}</span>
          </div>
        ))}
      </div>
      <div className="w-full bg-gray-200 h-2 rounded-full">
        <div 
          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
        ></div>
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
  const [maxSteps, setMaxSteps] = useState(3); // Default to 3 steps

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
            

            if (targetForm.fields && targetForm.fields.length > 0) {
              const highestStep = Math.max(...targetForm.fields.map(f => f.step || 1));
              setMaxSteps(Math.max(highestStep, 1));
            }

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


        if (draftFields && draftFields.length > 0) {
          const highestStep = Math.max(...draftFields.map(f => f.step || 1));
          setMaxSteps(Math.max(highestStep, 1));
        }

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
    if (fields.length > 0) {
      const highestStep = Math.max(...fields.map(f => f.step || 1), 1);
      setMaxSteps(highestStep);
    }

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
    setMaxSteps(3);
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

  const addStep = () => {
    setMaxSteps(prev => prev + 1);
    alert(`New step added! You now have ${maxSteps + 1} steps available.\n\nEdit your fields to assign them to step ${maxSteps + 1}.`);
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
    dismissDraftNotice,
    maxSteps,
    addStep
  };
}

export default function FormCanvas({ 
  fields, 
  setFields,
  showDraftNotice: externalShowDraftNotice,
  lastEdited: externalLastEdited,
  dismissDraftNotice: externalDismissNotice,
  maxSteps = 3
}) {
  const [draggedItem, setDraggedItem] = useState(null);
  const [dragOverItem, setDragOverItem] = useState(null);
  const [editingField, setEditingField] = useState(null);
  const [searchParams] = useSearchParams();
  const [showDraftNotice, setShowDraftNotice] = useState(false);
  const [lastEdited, setLastEdited] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [isPreviewMode, setIsPreviewMode] = useState(false);

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
        minLength: '',
        maxLength: '',
        step: currentStep
      };

      if (fieldType === 'dropdown' || fieldType === 'radio') {
        newField.options = ['Option 1', 'Option 2', 'Option 3'];
      }
      
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

  const handleStepChange = (step) => {
    setCurrentStep(step);
  };

  const nextStep = () => {
    if (currentStep < maxSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const togglePreviewMode = () => {
    setIsPreviewMode(!isPreviewMode);
    if (!isPreviewMode) {
      setCurrentStep(1);
    }
  };


  const currentStepFields = isPreviewMode 
    ? fields.filter(field => field.step === currentStep)
    : fields;

  const totalSteps = Math.max(...fields.map(field => field.step || 1), 1);

  return (
    <div 
      className="flex-1 flex flex-col overflow-hidden"
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      {shouldShowNotice && noticeLastEdited && (
        <div className="p-2">
          <DraftNotification 
            lastEdited={noticeLastEdited} 
            onDismiss={dismissDraftNotice} 
          />
        </div>
      )}

      <div className="flex-1 p-4 md:p-6 overflow-y-auto border-dashed border border-gray-200">
        <div className="max-w-2xl mx-auto">
          <div className="mb-4 flex justify-between items-center">
            <h2 className="text-xl font-semibold">
              {isPreviewMode ? 'Form Preview - Step ' + currentStep + ' of ' + totalSteps : 'Form Builder'}
              {!isPreviewMode && (
                <span className="text-sm ml-2 font-normal text-gray-500">
                  {maxSteps} step{maxSteps !== 1 ? 's' : ''} available
                </span>
              )}
            </h2>
            <button
              onClick={togglePreviewMode}
              className={`px-3 py-1 rounded ${
                isPreviewMode 
                  ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' 
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              {isPreviewMode ? 'Back to Editor' : 'Preview Form'}
            </button>
          </div>

          {!isPreviewMode && maxSteps > 1 && (
            <div className="mb-4 p-3 bg-blue-50 border-l-4 border-blue-500 rounded">
              <p className="text-sm">
                <strong>Multistep Form Enabled:</strong> You have {maxSteps} steps available. 
                Edit each field to assign it to a specific step, then click "Preview Form" to see how your multi-page form works.
              </p>
            </div>
          )}

          {isPreviewMode && totalSteps > 1 && (
            <StepProgressBar 
              currentStep={currentStep}
              totalSteps={totalSteps}
              onStepClick={handleStepChange}
            />
          )}

          {currentStepFields.length === 0 ? (
            <div className="flex items-center justify-center h-64 border-2 border-dashed border-gray-300 rounded-lg">
              <p className="text-gray-400 text-lg">
                {isPreviewMode 
                  ? `No fields found for step ${currentStep}` 
                  : 'Drag and drop form elements here'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <form className="space-y-4">
                {currentStepFields.map((field, index) => (
                  isPreviewMode ? (
                    <FormField key={field.id} field={field} />
                  ) : (
                    <div 
                      key={field.id} 
                      className={`p-3 md:p-4 border rounded-md bg-gray-50 hover:shadow-md transition-shadow cursor-move
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
                        {field.step && (
                          <span className="ml-auto bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-bold">
                            Step {field.step}
                          </span>
                        )}
                      </div>
                      <FormField field={field} showStepIndicator={false} />
                      <div className="flex justify-end mt-2 space-x-2">
                        <button 
                          type="button" 
                          className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                          onClick={() => handleEditField(fields.indexOf(field))}
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
                  )
                ))}
              </form>

              {isPreviewMode && totalSteps > 1 && (
                <div className="flex justify-between mt-6 pt-4 border-t border-gray-200">
                  <button
                    onClick={prevStep}
                    disabled={currentStep === 1}
                    className={`px-4 py-2 rounded ${
                      currentStep === 1 
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                      : 'bg-gray-500 text-white hover:bg-gray-600'
                    }`}
                  >
                    Previous
                  </button>
                  
                  <button
                    onClick={nextStep}
                    disabled={currentStep === totalSteps}
                    className={`px-4 py-2 rounded ${
                      currentStep === totalSteps 
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                    }`}
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {editingField !== null && (
        <FieldConfig 
          field={fields[editingField]} 
          onSave={handleSaveFieldConfig}
          onCancel={handleCancelFieldConfig}
          maxSteps={maxSteps}
        />
      )}
    </div>
  );
}
