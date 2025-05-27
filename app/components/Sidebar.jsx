import React from "react";

const FIELD_TYPES = [
  { id: "text", label: "Text Field", icon: "📝" },
  { id: "textarea", label: "Text Area", icon: "📄" },
  { id: "dropdown", label: "Dropdown", icon: "▼" },
  { id: "checkbox", label: "Checkbox", icon: "☑️" },
  { id: "radio", label: "Radio Button", icon: "⚪" },
  { id: "date", label: "Date Picker", icon: "📅" },
  { id: "file", label: "File Upload", icon: "📎" },
];

export default function Sidebar({
  fields,
  formName,
  setFormName,
  onReset,
  onSave,
  isEditing,
}) {
  const onDragStart = (event, fieldType) => {
    event.dataTransfer.setData("fieldType", fieldType);
    event.dataTransfer.effectAllowed = "copy";
  };

  const handleSave = () => {
    if (fields.length === 0) {
      alert("Please add at least one field to your form before saving.");
      return;
    }

    const formId = isEditing ? fields[0]?.formId : `form-${Date.now()}`;
    const currentDate = new Date().toISOString().split("T")[0]; // Format: YYYY-MM-DD

    const formData = {
      id: formId,
      name: formName,
      createdAt: currentDate,
      fields: fields,
      responses: 0,
      updatedAt: new Date().toISOString(),
    };

    let savedForms = [];
    try {
      const existingForms = localStorage.getItem("savedForms");
      if (existingForms) {
        savedForms = JSON.parse(existingForms);
      }
    } catch (error) {
      console.error("Error loading saved forms:", error);
    }

    if (isEditing) {
      savedForms = savedForms.map((form) =>
        form.id === formId ? formData : form
      );
    } else {
      savedForms = [formData, ...savedForms];
    }

    localStorage.setItem("savedForms", JSON.stringify(savedForms));
    alert("Form saved successfully!");

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
      </div>
    </div>
  );
}
