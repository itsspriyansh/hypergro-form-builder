import React, { useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import FormCanvas, { useFormCanvas } from '../components/FormCanvas';

export default function FormBuilder() {
  const { 
    fields, 
    setFields, 
    formName, 
    setFormName, 
    resetForm, 
    saveForm, 
    isEditing,
    showDraftNotice,
    lastEdited,
    dismissDraftNotice,
    maxSteps,
    addStep,
    showSavedNotification
  } = useFormCanvas();

  useEffect(() => {
    const handleAddStep = () => {
      addStep();
    };
    
    window.addEventListener('addStep', handleAddStep);
    
    return () => {
      window.removeEventListener('addStep', handleAddStep);
    };
  }, [addStep]);
  
  return (
    <div className="flex flex-col md:flex-row h-full overflow-hidden">
      <Sidebar 
        fields={fields}
        formName={formName}
        setFormName={setFormName}
        onReset={resetForm}
        onSave={saveForm}
        isEditing={isEditing}
        onAddStep={addStep}
      />
      <FormCanvas 
        fields={fields}
        setFields={setFields}
        showDraftNotice={showDraftNotice}
        lastEdited={lastEdited}
        dismissDraftNotice={dismissDraftNotice}
        maxSteps={maxSteps}
        showSavedNotification={showSavedNotification}
      />
    </div>
  );
}
