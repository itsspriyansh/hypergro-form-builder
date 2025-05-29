import React, { useState } from "react";
import { useSearchParams } from "@remix-run/react";

const DRAFT_FORM_KEY = 'draftForm';
const SAVED_FORMS_KEY = 'savedForms';

const FIELD_TYPES = [
  { id: "text", label: "Text Field", icon: "📝" },
  { id: "textarea", label: "Text Area", icon: "📄" },
  { id: "dropdown", label: "Dropdown", icon: "▼" },
  { id: "checkbox", label: "Checkbox", icon: "☑️" },
  { id: "radio", label: "Radio Button", icon: "⚪" },
  { id: "date", label: "Date Picker", icon: "📅" },
  { id: "file", label: "File Upload", icon: "📎" },
];

function ShareLinkDialog({ formId, onClose }) {
  const [copied, setCopied] = useState(false);
  const shareableLink = `${window.location.origin}/${formId}`;
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareableLink)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
      });
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4">Share Your Form</h3>
        <p className="text-sm text-gray-600 mb-3">
          Use this link to share your form with others. They can access and submit the form without needing to log in.
        </p>
        
        <div className="flex mb-4">
          <input
            type="text"
            value={shareableLink}
            readOnly
            className="flex-1 px-3 py-2 border rounded-l-md bg-gray-50"
          />
          <button
            onClick={copyToClipboard}
            className={`px-4 py-2 rounded-r-md ${copied ? 'bg-green-500' : 'bg-blue-500'} text-white`}
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
        
        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Sidebar({
  fields,
  formName,
  setFormName,
  onReset,
  onSave,
  isEditing,
  onAddStep
}) {
  const [searchParams] = useSearchParams();
  const formId = searchParams.get('formId');
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [savedFormId, setSavedFormId] = useState(null);

  const onDragStart = (event, fieldType) => {
    event.dataTransfer.setData("fieldType", fieldType);
    event.dataTransfer.setData("text/plain", fieldType);
    event.dataTransfer.effectAllowed = "copy";
  };

  const handleSave = () => {
    if (fields.length === 0) {
      alert("Please add at least one field to your form before saving.");
      return;
    }

    const formId = searchParams.get('formId') || `form-${Date.now()}`;
    const currentDate = new Date().toISOString().split("T")[0];

    const shareableId = `f${Math.random().toString(36).substring(2, 9)}`;

    const formData = {
      id: formId,
      shareableId: shareableId,
      name: formName || 'Untitled Form',
      createdAt: currentDate,
      fields: fields,
      responses: 0,
      updatedAt: new Date().toISOString(),
    };

    let savedForms = [];
    try {
      const existingForms = localStorage.getItem(SAVED_FORMS_KEY);
      if (existingForms) {
        savedForms = JSON.parse(existingForms);
      }
    } catch (error) {
      console.error("Error loading saved forms:", error);
    }

    if (isEditing) {
      const existingForm = savedForms.find(form => form.id === formId);
      if (existingForm && existingForm.shareableId) {
        formData.shareableId = existingForm.shareableId;
      }
      
      savedForms = savedForms.map((form) =>
        form.id === formId ? formData : form
      );
    } else {
      savedForms = [formData, ...savedForms];
    }

    localStorage.setItem(SAVED_FORMS_KEY, JSON.stringify(savedForms));
    localStorage.removeItem(DRAFT_FORM_KEY);
    
    setSavedFormId(formData.shareableId);

    setShowShareDialog(true);
    
    if (onSave) onSave(formData);
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to clear all form fields?")) {
      onReset();
    }
  };

  return (
    <div className="w-64 bg-gray-100 p-4 border-r border-gray-200 h-full overflow-auto">
      <h2 className="text-lg font-semibold mb-4">Form Elements</h2>
      
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Form Name</label>
        <input
          type="text"
          value={formName}
          onChange={(e) => setFormName(e.target.value)}
          className="w-full px-3 py-2 border rounded-md"
          placeholder="Enter form name"
        />
      </div>
      
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
          {isEditing ? "Update Form" : "Save Form"}
        </button>
        
        <button
          onClick={handleReset}
          className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded flex items-center justify-center"
        >
          <span className="mr-2">🗑️</span>
          Reset Form
        </button>

        {onAddStep && (
          <button
            onClick={onAddStep}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded flex items-center justify-center mt-4"
            title="Add another page to your multi-step form"
          >
            <span className="mr-2">➕</span>
            Add Form Step/Page
          </button>
        )}
      </div>
      
      <div className="mt-6 pt-4 border-t border-gray-300">
        <p className="text-sm text-gray-600 mb-2">Multistep Form Instructions:</p>
        <ol className="text-xs text-gray-600 list-decimal pl-4 space-y-1">
          <li>Add fields to your form</li>
          <li>Edit each field to assign it to a step</li>
          <li>Click 'Preview Form' to test</li>
          <li>Save when you're done</li>
        </ol>
      </div>
      
      {showShareDialog && savedFormId && (
        <ShareLinkDialog 
          formId={savedFormId} 
          onClose={() => setShowShareDialog(false)}
        />
      )}
    </div>
  );
}
