import React, { useState } from "react";
import { useSearchParams } from "@remix-run/react";
import { 
  MdTextFields, 
  MdSubject, 
  MdArrowDropDown,
  MdCheckBox, 
  MdRadioButtonChecked,
  MdCalendarMonth,
  MdAttachFile,
  MdSave,
  MdDelete
} from "react-icons/md";

const DRAFT_FORM_KEY = 'draftForm';
const SAVED_FORMS_KEY = 'savedForms';

const FIELD_TYPES = [
  { id: "text", label: "Text Field", icon: <MdTextFields /> },
  { id: "textarea", label: "Text Area", icon: <MdSubject /> },
  { id: "dropdown", label: "Dropdown", icon: <MdArrowDropDown /> },
  { id: "checkbox", label: "Checkbox", icon: <MdCheckBox /> },
  { id: "radio", label: "Radio Button", icon: <MdRadioButtonChecked /> },
  { id: "date", label: "Date Picker", icon: <MdCalendarMonth /> },
  { id: "file", label: "File Upload", icon: <MdAttachFile /> },
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
      
      <div className="space-y-4">
        {FIELD_TYPES.map((field) => (
          <div
            key={field.id}
            className="p-3 cursor-move flex items-center border-b border-transparent hover:border-blue-500 transition-all duration-300"
            draggable
            onDragStart={(e) => onDragStart(e, field.id)}
          >
            <span className="mr-3 text-xl text-blue-600">{field.icon}</span>
            <span className="text-gray-700">{field.label}</span>
          </div>
        ))}
      </div>
      
      <div className="mt-8 space-y-3">
        <button
          onClick={handleSave}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded flex items-center justify-center"
        >
          <span className="mr-2"><MdSave /></span>
          {isEditing ? "Update Form" : "Save Form"}
        </button>
        
        <button
          onClick={handleReset}
          className="w-full text-blue-500 border-blue-500 border-solid border-[1px] hover:bg-blue-500 hover:text-white transition-all duration-300 py-2 px-4 rounded flex items-center justify-center"
        >
          <span className="mr-2"><MdDelete /></span>
          Reset Form
        </button>
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
