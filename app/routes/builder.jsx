import React from 'react';
import Sidebar from '../components/Sidebar';
import FormCanvas from '../components/FormCanvas';

export default function FormBuilder() {
  return (
    <div className="flex h-full">
      <Sidebar />
      <FormCanvas />
    </div>
  );
}
