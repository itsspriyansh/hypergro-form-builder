import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import FormCanvas, { useFormCanvas } from '../components/FormCanvas';

export default function FormBuilder() {
  const { fields, setFields, formName, setFormName, resetForm, saveForm, isEditing } = useFormCanvas();
  
  return (
    <div className="flex h-full">
      <Sidebar 
        fields={fields}
        formName={formName}
        setFormName={setFormName}
        onReset={resetForm}
        onSave={saveForm}
        isEditing={isEditing}
      />
      <FormCanvas 
        fields={fields}
        setFields={setFields}
      />
    </div>
  );
}
