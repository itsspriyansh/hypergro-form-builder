import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from '@remix-run/react';
import { MdDragIndicator, MdClose, MdAdd, MdRemoveRedEye, MdArrowBack, MdCancel, MdEdit, MdDelete } from 'react-icons/md';
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
    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4 rounded shadow-sm animate-fadeIn">
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
          <MdClose />
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
                 step === currentStep ? 'bg-green-600 text-white' : 
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
          className="bg-green-500 h-2 rounded-full transition-all duration-300"
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
  const [showDraftNotice, setShowDraftNotice] = useState(false);
  const [lastEdited, setLastEdited] = useState(null);
  const [maxSteps, setMaxSteps] = useState(1);
  const formId = searchParams.get('formId');

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
            
            if (targetForm.maxSteps) {
              setMaxSteps(targetForm.maxSteps);
            } else if (targetForm.fields && targetForm.fields.length > 0) {
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
        const { name, fields: draftFields, formId: draftId, lastEdited, maxSteps: draftMaxSteps } = JSON.parse(draftForm);
        setFields(draftFields || []);
        setFormName(name || 'Untitled Form');

        if (draftMaxSteps) {
          setMaxSteps(draftMaxSteps);
        } else if (draftFields && draftFields.length > 0) {
          const highestStep = Math.max(...draftFields.map(f => f.step || 1));
          setMaxSteps(Math.max(highestStep, 1));
        }

        if (lastEdited) {
          setLastEdited(lastEdited);
          setShowDraftNotice(true);
        }

        if (!formId && draftId && window.location.pathname === '/create') {
          window.history.replaceState(null, '', `/create?formId=${draftId}`);
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
        maxSteps: maxSteps,
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
    setMaxSteps(1);
    localStorage.removeItem(DRAFT_FORM_KEY);
    setShowDraftNotice(false);
    
    if (window.location.search.includes('formId=')) {
      window.history.replaceState(null, '', '/create');
    }
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
  const [draggedField, setDraggedField] = useState(null);
  const [dragOverFieldId, setDragOverFieldId] = useState(null);
  const [dragOverStep, setDragOverStep] = useState(null);
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

  const handleFieldDragStart = (e, field) => {
    setDraggedField(field);
    e.dataTransfer.setData('application/json', JSON.stringify(field));
    const dragImg = document.createElement('div');
    dragImg.textContent = field.label;
    dragImg.style.position = 'absolute';
    dragImg.style.top = '-1000px';
    document.body.appendChild(dragImg);
    e.dataTransfer.setDragImage(dragImg, 0, 0);
    setTimeout(() => document.body.removeChild(dragImg), 0);
  };

  const handleFieldDragOver = (e, fieldId) => {
    e.preventDefault();
    const isFromSidebar = e.dataTransfer.types.includes('text/plain');

    if (!isFromSidebar && draggedField) {
      e.stopPropagation();
      setDragOverFieldId(fieldId);
    }
  };

  const handleFieldDrop = (e, overFieldId, stepNumber) => {
    e.preventDefault();
    e.stopPropagation();

    const fieldType = e.dataTransfer.getData('fieldType');
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
        step: stepNumber
      };

      if (fieldType === 'dropdown' || fieldType === 'radio') {
        newField.options = ['Option 1', 'Option 2', 'Option 3'];
      }
      
      setFields([...fields, newField]);
      resetDragState();
      return;
    }

    if (!draggedField) return;

    const newFields = [...fields];

    const draggedIdx = newFields.findIndex(f => f.id === draggedField.id);
    const dropIdx = newFields.findIndex(f => f.id === overFieldId);
    
    if (draggedIdx === -1) return;

    if (stepNumber !== undefined && stepNumber !== draggedField.step) {
      newFields[draggedIdx] = { ...newFields[draggedIdx], step: stepNumber };
    }

    if (draggedIdx !== -1 && dropIdx !== -1 && draggedIdx !== dropIdx) {
      const [removed] = newFields.splice(draggedIdx, 1);
      newFields.splice(dropIdx, 0, removed);
    }
    
    setFields(newFields);
    resetDragState();
  };

  const handleSectionDragOver = (e, stepNumber) => {
    e.preventDefault();
    const isFromSidebar = e.dataTransfer.types.includes('text/plain');
    if (isFromSidebar || !dragOverFieldId) {
      setDragOverStep(stepNumber);
    }
  };

  const handleSectionDrop = (e, stepNumber) => {
    e.preventDefault();

    if (dragOverFieldId) return;

    const fieldType = e.dataTransfer.getData('fieldType');
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
        step: stepNumber
      };

      if (fieldType === 'dropdown' || fieldType === 'radio') {
        newField.options = ['Option 1', 'Option 2', 'Option 3'];
      }
      
      setFields([...fields, newField]);
      resetDragState();
      return;
    }

    if (draggedField) {
      const newFields = [...fields];
      const draggedIdx = newFields.findIndex(f => f.id === draggedField.id);
      
      if (draggedIdx !== -1) {
        newFields[draggedIdx] = { ...newFields[draggedIdx], step: stepNumber };
        setFields(newFields);
      }
    }
    
    resetDragState();
  };

  const resetDragState = () => {
    setDraggedField(null);
    setDragOverFieldId(null);
    setDragOverStep(null);
  };

  const handleEditField = (field) => {
    const index = fields.findIndex(f => f.id === field.id);
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

  const availableSteps = isPreviewMode 
    ? [currentStep]
    : Array.from({ length: maxSteps }, (_, i) => i + 1);

  const currentStepFields = isPreviewMode 
    ? fields.filter(field => field.step === currentStep)
    : fields;

  const totalSteps = Math.max(...fields.map(field => field.step || 1), 1);

  const addNewStep = () => {
    const newStepNumber = maxSteps + 1;
    if (typeof externalDismissNotice === 'function') {
      const event = new CustomEvent('addStep');
      window.dispatchEvent(event);
    } else {
      setMaxSteps(newStepNumber);
    }
  };

  const removeStep = (stepToRemove) => {
    if (maxSteps <= 1) {
      return;
    }
    
    if (window.confirm(`Are you sure you want to remove Step ${stepToRemove}? All fields in this step will be deleted.`)) {
      const updatedFields = fields.filter(field => (field.step || 1) !== stepToRemove);
      
      const finalFields = updatedFields.map(field => {
        if ((field.step || 1) > stepToRemove) {
          return { ...field, step: field.step - 1 };
        }
        return field;
      });
      
      setFields(finalFields);
      
      if (typeof externalDismissNotice === 'function') {
        const event = new CustomEvent('removeStep', { detail: { maxSteps: maxSteps - 1 } });
        window.dispatchEvent(event);
      } else {
        setMaxSteps(maxSteps - 1);
      }

      if (isPreviewMode) {
        if (currentStep === stepToRemove) {
          setCurrentStep(Math.max(1, currentStep - 1));
        } else if (currentStep > stepToRemove) {
          setCurrentStep(currentStep - 1);
        }
      }
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {shouldShowNotice && noticeLastEdited && (
        <div className="p-2 transition-all duration-300 ease-in-out">
          <DraftNotification 
            lastEdited={noticeLastEdited} 
            onDismiss={dismissDraftNotice} 
          />
        </div>
      )}

      <div className="flex-1 p-4 md:p-6 overflow-y-auto border-dashed border border-gray-200">
        <div className="max-w-4xl mx-auto">
          <div className="mb-4 flex justify-between items-center">
            <h2 className="text-xl font-semibold transition-all duration-300">
              {isPreviewMode ? 'Form Preview - Step ' + currentStep + ' of ' + totalSteps : 'Form Builder'}
              {!isPreviewMode && (
                <span className="text-sm ml-2 font-normal text-gray-500 transition-all duration-300">
                  {maxSteps} step{maxSteps !== 1 ? 's' : ''} available
                </span>
              )}
            </h2>
            <button
              onClick={togglePreviewMode}
              className={`flex items-center transition-all duration-300 ease-in-out text-blue-600 hover:text-blue-800 ${
                isPreviewMode ? 'text-gray-600 hover:text-gray-800' : ''
              }`}
            >
              {isPreviewMode 
                ? <><MdArrowBack className="mr-1 transition-transform duration-300" /> Back to Editor</>
                : <><MdRemoveRedEye className="mr-1 transition-transform duration-300 hover:scale-110" /> Preview</>
              }
            </button>
          </div>

          {isPreviewMode && totalSteps > 1 && (
            <div className="transition-all duration-500 ease-in-out transform">
              <StepProgressBar 
                currentStep={currentStep}
                totalSteps={totalSteps}
                onStepClick={handleStepChange}
              />
            </div>
          )}

          <div className={`transition-all duration-500 ease-in-out ${isPreviewMode ? 'opacity-100' : ''}`}>
            {isPreviewMode ? (
              <div className="transition-opacity duration-300 ease-in-out">
                {currentStepFields.length === 0 ? (
                  <div className="flex items-center justify-center h-64 border-2 border-dashed border-gray-300 rounded-lg">
                    <p className="text-gray-400 text-lg">No fields found for step {currentStep}</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <form className="space-y-4">
                      {currentStepFields.map((field) => (
                        <FormField key={field.id} field={field} />
                      ))}
                    </form>
                  </div>
                )}
                
                {totalSteps > 1 && (
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
            ) : (
              <div className="space-y-6 transition-all duration-500 ease-in-out">
                <div className="grid grid-cols-1 gap-6 transition-all duration-500 ease-in-out">
                  {availableSteps.map(stepNumber => {
                    const stepFields = fields.filter(field => (field.step || 1) === stepNumber);
                    
                    return (
                      <div 
                        key={stepNumber}
                        className={`relative border-2 ${dragOverStep === stepNumber && !dragOverFieldId ? 'border-blue-500 bg-blue-50' : 'border-gray-200'} rounded-lg p-4 transition-all duration-300 ease-in-out transform hover:shadow-md`}
                        onDragOver={(e) => handleSectionDragOver(e, stepNumber)}
                        onDrop={(e) => handleSectionDrop(e, stepNumber)}
                      >
                        {availableSteps.length > 1 && (
                          <button
                            onClick={() => removeStep(stepNumber)}
                            className="absolute -right-3 top-1/2 transform -translate-y-1/2 p-1 bg-white rounded-full text-gray-400 hover:text-red-500 border border-gray-200 shadow-sm z-10 transition-all duration-200 ease-in-out hover:scale-110"
                            title={`Remove Step ${stepNumber}`}
                          >
                            <MdCancel size={18} />
                          </button>
                        )}
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-lg font-semibold text-blue-700">
                            Step {stepNumber}
                          </h3>
                          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full transition-all duration-300">
                            {stepFields.length} field{stepFields.length !== 1 ? 's' : ''}
                          </span>
                        </div>
                        
                        {stepFields.length === 0 ? (
                          <div className="flex items-center justify-center h-32 border-2 border-dashed border-gray-300 rounded-lg transition-all duration-300 ease-in-out">
                            <p className="text-gray-400">Drop form elements here for Step {stepNumber}</p>
                          </div>
                        ) : (
                          <div className="space-y-2 transition-all duration-300 ease-in-out">
                            {stepFields.map((field) => (
                              <div 
                                key={field.id} 
                                className={`p-3 border rounded-md transition-all duration-300 ease-in-out transform
                                  ${draggedField?.id === field.id ? 'opacity-50 border-dashed bg-gray-50 scale-98' : 'bg-white hover:bg-gray-50'} 
                                  ${dragOverFieldId === field.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}
                                  cursor-move hover:shadow-md relative`}
                                draggable="true"
                                onDragStart={(e) => handleFieldDragStart(e, field)}
                                onDragOver={(e) => handleFieldDragOver(e, field.id)}
                                onDrop={(e) => handleFieldDrop(e, field.id, stepNumber)}
                                onDragEnd={resetDragState}
                              >
                                <div className="absolute top-2 right-2 flex space-x-2 z-10">
                                  <button 
                                    type="button" 
                                    className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-100 rounded-full transition-all duration-200"
                                    onClick={() => handleEditField(field)}
                                    title="Edit Field"
                                  >
                                    <MdEdit size={18} />
                                  </button>
                                  <button 
                                    type="button" 
                                    className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-100 rounded-full transition-all duration-200"
                                    onClick={() => {
                                      setFields(fields.filter(f => f.id !== field.id));
                                    }}
                                    title="Remove Field"
                                  >
                                    <MdDelete size={18} />
                                  </button>
                                </div>
                                
                                <div className="flex items-center mb-2 text-gray-500">
                                  <span className="mr-2"><MdDragIndicator className="transition-transform duration-200 hover:scale-110" /></span>
                                  <span className="text-sm">Drag to reorder or move between steps</span>
                                </div>
                                <FormField field={field} showStepIndicator={false} />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="flex justify-center pt-4 transition-all duration-300">
                  <button
                    onClick={addNewStep}
                    className="px-4 py-2 text-gray-500 border-gray-500 border-dashed border-[1px] hover:bg-blue-500 hover:text-white transition-all duration-300 rounded-lg flex items-center"
                  >
                    <MdAdd className="h-5 w-5 mr-2 transition-transform duration-200 hover:rotate-90" />
                    Add New Step
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {editingField !== null && (
        <div className="animate-fadeIn">
          <FieldConfig 
            field={fields[editingField]} 
            onSave={handleSaveFieldConfig}
            onCancel={handleCancelFieldConfig}
            maxSteps={maxSteps}
          />
        </div>
      )}
    </div>
  );
}
