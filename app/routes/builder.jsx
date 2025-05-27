import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import FormCanvas, { useFormCanvas } from '../components/FormCanvas';

export default function FormBuilder() {
  const { fields, setFields, resetForm, saveForm } = useFormCanvas();
  
  return (
    <div className="flex h-full">
      <Sidebar 
        fields={fields}
        onReset={resetForm}
        onSave={saveForm}
      />
      <FormCanvas 
        fields={fields}
        setFields={setFields}
      />
    </div>
  );
}
