import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "@remix-run/react";
import {
  MdDragIndicator,
  MdClose,
  MdAdd,
  MdRemoveRedEye,
  MdArrowBack,
  MdCancel,
  MdEdit,
  MdDelete,
  MdDragHandle,
  MdCheckCircle,
} from "react-icons/md";
import FormField from "./FormField";
import FieldConfig from "./FieldConfig";

const DRAFT_FORM_KEY = "draftForm";
const SAVED_FORMS_KEY = "savedForms";

function DraftNotification({ lastEdited, onDismiss }) {
  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.round(diffMs / 60000);

    if (diffMins < 1) return "just now";
    if (diffMins < 60)
      return `${diffMins} minute${diffMins === 1 ? "" : "s"} ago`;

    const diffHours = Math.round(diffMins / 60);
    if (diffHours < 24)
      return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;

    const diffDays = Math.round(diffHours / 24);
    return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-l-4 border-blue-500 p-4 mb-4 rounded-lg shadow-sm animate-fadeIn">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <div className="bg-blue-500 rounded-full p-2 mr-3 shadow-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-white"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div>
            <p className="font-medium text-blue-800">Draft form restored</p>
            <p className="text-sm text-blue-600">
              Last edited {formatTimeAgo(lastEdited)}
            </p>
          </div>
        </div>
        <button
          onClick={onDismiss}
          className="text-gray-500 hover:text-gray-700 bg-white hover:bg-gray-100 rounded-full p-1.5 transition-all duration-200 hover:shadow-md"
        >
          <MdClose className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}

function DraftSavedNotification() {
  return (
    <div className="fixed top-4 right-12 z-50 flex items-center animate-fade-out">
      <div className="flex items-center w-[110px]">
        <div className="success-checkmark">
          <div className="check-icon">
            <span className="icon-line line-tip"></span>
            <span className="icon-line line-long"></span>
            <div className="icon-circle"></div>
            <div className="icon-fix"></div>
          </div>
        </div>
        <span className="text-[12px] font-light text-green-600 mt-3">
          Draft saved
        </span>
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
            className="flex flex-col items-center cursor-pointer group"
            onClick={() => onStepClick(step)}
          >
            <div
              className={`w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300 ease-in-out transform group-hover:scale-110 ${
                step < currentStep
                  ? "bg-green-500 text-white shadow-md"
                  : step === currentStep
                  ? "bg-green-600 text-white shadow-lg ring-4 ring-green-200"
                  : "bg-gray-200 text-gray-500 group-hover:bg-gray-300"
              }`}
            >
              {step}
            </div>
            <span className="text-xs mt-1 font-medium opacity-80 group-hover:opacity-100">
              Step {step}
            </span>
          </div>
        ))}
      </div>
      <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
        <div
          className="bg-green-500 h-2 rounded-full transition-all duration-500 ease-out shadow-inner"
          style={{
            width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%`,
            backgroundImage: "linear-gradient(to right, #4ade80, #22c55e)",
          }}
        ></div>
      </div>
    </div>
  );
}

export function useFormCanvas() {
  const [fields, setFields] = useState([]);
  const [formName, setFormName] = useState("");
  const [searchParams] = useSearchParams();
  const [showDraftNotice, setShowDraftNotice] = useState(false);
  const [lastEdited, setLastEdited] = useState(null);
  const [maxSteps, setMaxSteps] = useState(1);
  const formId = searchParams.get("formId");
  const templateId = searchParams.get("template");
  const [showSavedNotification, setShowSavedNotification] = useState(false);

  // Template definitions
  const getTemplateFields = (templateId) => {
    const templates = {
      "business-feedback": {
        name: "Customer Feedback Form",
        fields: [
          {
            id: "field-1",
            type: "text",
            label: "Full Name",
            placeholder: "Enter your full name",
            required: true,
            step: 1,
          },
          {
            id: "field-2",
            type: "email",
            label: "Email Address",
            placeholder: "Enter your email address",
            required: true,
            step: 1,
          },
          {
            id: "field-3",
            type: "dropdown",
            label: "Product/Service Used",
            options: ["Product A", "Product B", "Service X", "Service Y"],
            required: true,
            step: 1,
          },
          {
            id: "field-4",
            type: "radio",
            label: "How would you rate your experience?",
            options: ["Excellent", "Good", "Average", "Poor", "Very Poor"],
            required: true,
            step: 2,
          },
          {
            id: "field-5",
            type: "textarea",
            label: "Please share your feedback",
            placeholder:
              "What did you like or dislike about our product/service?",
            required: false,
            step: 2,
          },
          {
            id: "field-6",
            type: "checkbox",
            label: "May we contact you about your feedback?",
            required: false,
            step: 2,
          },
        ],
      },
      "business-contact": {
        name: "Contact Form",
        fields: [
          {
            id: "field-1",
            type: "text",
            label: "Name",
            placeholder: "Enter your name",
            required: true,
            step: 1,
          },
          {
            id: "field-2",
            type: "email",
            label: "Email",
            placeholder: "Enter your email",
            required: true,
            step: 1,
          },
          {
            id: "field-3",
            type: "text",
            label: "Subject",
            placeholder: "What is this regarding?",
            required: true,
            step: 1,
          },
          {
            id: "field-4",
            type: "textarea",
            label: "Message",
            placeholder: "How can we help you?",
            required: true,
            step: 1,
          },
        ],
      },
      "education-application": {
        name: "Course Application Form",
        fields: [
          {
            id: "field-1",
            type: "text",
            label: "First Name",
            placeholder: "Enter your first name",
            required: true,
            step: 1,
          },
          {
            id: "field-2",
            type: "text",
            label: "Last Name",
            placeholder: "Enter your last name",
            required: true,
            step: 1,
          },
          {
            id: "field-3",
            type: "date",
            label: "Date of Birth",
            required: true,
            step: 1,
          },
          {
            id: "field-4",
            type: "email",
            label: "Email Address",
            placeholder: "Enter your email address",
            required: true,
            step: 1,
          },
          {
            id: "field-5",
            type: "dropdown",
            label: "Course Selection",
            options: [
              "Web Development",
              "Data Science",
              "UX Design",
              "Digital Marketing",
            ],
            required: true,
            step: 2,
          },
          {
            id: "field-6",
            type: "textarea",
            label: "Why do you want to take this course?",
            required: true,
            step: 2,
          },
          {
            id: "field-7",
            type: "checkbox",
            label: "I agree to the terms and conditions",
            required: true,
            step: 3,
          },
        ],
      },
    };

    // Default template for any ID not found in the templates object
    const defaultTemplate = {
      name: "Template Form",
      fields: [
        {
          id: "field-1",
          type: "text",
          label: "Name",
          placeholder: "Enter your name",
          required: true,
          step: 1,
        },
        {
          id: "field-2",
          type: "email",
          label: "Email",
          placeholder: "Enter your email",
          required: true,
          step: 1,
        },
      ],
    };

    return templates[templateId] || defaultTemplate;
  };

  useEffect(() => {
    if (formId) {
      try {
        const savedForms = localStorage.getItem(SAVED_FORMS_KEY);
        if (savedForms) {
          const forms = JSON.parse(savedForms);
          const targetForm = forms.find((form) => form.id === formId);

          if (targetForm) {
            setFields(targetForm.fields);
            setFormName(targetForm.name || "Untitled Form");

            if (targetForm.maxSteps) {
              setMaxSteps(targetForm.maxSteps);
            } else if (targetForm.fields && targetForm.fields.length > 0) {
              const highestStep = Math.max(
                ...targetForm.fields.map((f) => f.step || 1)
              );
              setMaxSteps(Math.max(highestStep, 1));
            }

            saveDraftForm(
              targetForm.name || "Untitled Form",
              targetForm.fields,
              formId
            );
            return;
          }
        }
      } catch (error) {
        console.error("Error loading form:", error);
      }
    } else if (templateId) {
      // Load template if template parameter is present
      const template = getTemplateFields(templateId);
      setFields(template.fields);
      setFormName(template.name);

      // Set maxSteps based on the template fields
      if (template.fields && template.fields.length > 0) {
        const highestStep = Math.max(
          ...template.fields.map((f) => f.step || 1)
        );
        setMaxSteps(Math.max(highestStep, 1));
      }

      // Save as draft
      const newFormId = `form-${Date.now()}`;
      saveDraftForm(template.name, template.fields, newFormId);

      // Update URL with the new form ID
      window.history.replaceState(null, "", `/create?formId=${newFormId}`);

      return;
    }

    try {
      const draftForm = localStorage.getItem(DRAFT_FORM_KEY);
      if (draftForm) {
        const {
          name,
          fields: draftFields,
          formId: draftId,
          lastEdited,
          maxSteps: draftMaxSteps,
        } = JSON.parse(draftForm);
        setFields(draftFields || []);
        setFormName(name || "Untitled Form");

        if (draftMaxSteps) {
          setMaxSteps(draftMaxSteps);
        } else if (draftFields && draftFields.length > 0) {
          const highestStep = Math.max(...draftFields.map((f) => f.step || 1));
          setMaxSteps(Math.max(highestStep, 1));
        }

        if (lastEdited) {
          setLastEdited(lastEdited);
          setShowDraftNotice(true);
        }

        if (!formId && draftId && window.location.pathname === "/create") {
          window.history.replaceState(null, "", `/create?formId=${draftId}`);
        }
      } else if (!fields.length) {
        setFormName("Untitled Form");
      }
    } catch (error) {
      console.error("Error loading draft form:", error);
    }
  }, [formId, templateId]);

  useEffect(() => {
    if (fields.length > 0) {
      const highestStep = Math.max(...fields.map((f) => f.step || 1), 1);
      setMaxSteps(highestStep);
    }

    if (fields.length > 0 || (formName && formName !== "Untitled Form")) {
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
        lastEdited: new Date().toISOString(),
      };
      localStorage.setItem(DRAFT_FORM_KEY, JSON.stringify(draftData));

      // Show the saved notification
      setShowSavedNotification(true);
      setTimeout(() => {
        setShowSavedNotification(false);
      }, 2500); // Increased to match animation duration
    } catch (error) {
      console.error("Error saving draft form:", error);
    }
  };

  const resetForm = () => {
    setFields([]);
    setFormName("Untitled Form");
    setMaxSteps(1);
    localStorage.removeItem(DRAFT_FORM_KEY);
    setShowDraftNotice(false);

    if (window.location.search.includes("formId=")) {
      window.history.replaceState(null, "", "/create");
    }
  };

  const saveForm = (formData) => {
    console.log("Form saved:", formData);
    localStorage.removeItem(DRAFT_FORM_KEY);
    setShowDraftNotice(false);
  };

  const dismissDraftNotice = () => {
    setShowDraftNotice(false);
  };

  const addStep = () => {
    setMaxSteps((prev) => prev + 1);
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
    addStep,
    showSavedNotification,
  };
}

export default function FormCanvas({
  fields,
  setFields,
  showDraftNotice: externalShowDraftNotice,
  lastEdited: externalLastEdited,
  dismissDraftNotice: externalDismissNotice,
  maxSteps = 3,
  showSavedNotification,
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
  const [draggedStep, setDraggedStep] = useState(null);

  const shouldShowNotice =
    externalShowDraftNotice !== undefined
      ? externalShowDraftNotice
      : showDraftNotice;
  const noticeLastEdited =
    externalLastEdited !== undefined ? externalLastEdited : lastEdited;

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
      console.error("Error checking draft form:", error);
    }
  }, [externalShowDraftNotice]);

  const handleFieldDragStart = (e, field) => {
    setDraggedField(field);
    e.dataTransfer.setData("application/json", JSON.stringify(field));
    const dragImg = document.createElement("div");
    dragImg.textContent = field.label;
    dragImg.style.position = "absolute";
    dragImg.style.top = "-1000px";
    document.body.appendChild(dragImg);
    e.dataTransfer.setDragImage(dragImg, 0, 0);
    setTimeout(() => document.body.removeChild(dragImg), 0);
  };

  const handleFieldDragOver = (e, fieldId) => {
    e.preventDefault();
    const isFromSidebar = e.dataTransfer.types.includes("text/plain");

    if (!isFromSidebar && draggedField) {
      e.stopPropagation();
      setDragOverFieldId(fieldId);
    }
  };

  const handleFieldDrop = (e, overFieldId, stepNumber) => {
    e.preventDefault();
    e.stopPropagation();

    const fieldType = e.dataTransfer.getData("fieldType");
    if (fieldType) {
      const newField = {
        id: `field-${Date.now()}`,
        type: fieldType,
        label: `New ${fieldType} field`,
        placeholder: `Enter ${fieldType}...`,
        required: false,
        helpText: "",
        minLength: "",
        maxLength: "",
        step: stepNumber,
      };

      if (fieldType === "dropdown" || fieldType === "radio") {
        newField.options = ["Option 1", "Option 2", "Option 3"];
      }

      setFields([...fields, newField]);
      resetDragState();
      return;
    }

    if (!draggedField) return;

    const newFields = [...fields];

    const draggedIdx = newFields.findIndex((f) => f.id === draggedField.id);
    const dropIdx = newFields.findIndex((f) => f.id === overFieldId);

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
    const isFromSidebar = e.dataTransfer.types.includes("text/plain");
    if (isFromSidebar || !dragOverFieldId) {
      setDragOverStep(stepNumber);
    }
  };

  const handleSectionDrop = (e, stepNumber) => {
    e.preventDefault();

    if (dragOverFieldId) return;

    const fieldType = e.dataTransfer.getData("fieldType");
    if (fieldType) {
      const newField = {
        id: `field-${Date.now()}`,
        type: fieldType,
        label: `New ${fieldType} field`,
        placeholder: `Enter ${fieldType}...`,
        required: false,
        helpText: "",
        minLength: "",
        maxLength: "",
        step: stepNumber,
      };

      if (fieldType === "dropdown" || fieldType === "radio") {
        newField.options = ["Option 1", "Option 2", "Option 3"];
      }

      setFields([...fields, newField]);
      resetDragState();
      return;
    }

    if (draggedField) {
      const newFields = [...fields];
      const draggedIdx = newFields.findIndex((f) => f.id === draggedField.id);

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
    setDraggedStep(null);
  };

  const handleEditField = (field) => {
    const index = fields.findIndex((f) => f.id === field.id);
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
    ? fields.filter((field) => field.step === currentStep)
    : fields;

  const totalSteps = Math.max(...fields.map((field) => field.step || 1), 1);

  const addNewStep = () => {
    const newStepNumber = maxSteps + 1;
    if (typeof externalDismissNotice === "function") {
      const event = new CustomEvent("addStep");
      window.dispatchEvent(event);
    } else {
      setMaxSteps(newStepNumber);
    }
  };

  const removeStep = (stepToRemove) => {
    if (maxSteps <= 1) {
      return;
    }

    const updatedFields = fields.filter(
      (field) => (field.step || 1) !== stepToRemove
    );

    const finalFields = updatedFields.map((field) => {
      if ((field.step || 1) > stepToRemove) {
        return { ...field, step: field.step - 1 };
      }
      return field;
    });

    setFields(finalFields);

    if (typeof externalDismissNotice === "function") {
      const event = new CustomEvent("removeStep", {
        detail: { maxSteps: maxSteps - 1 },
      });
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
  };

  const handleStepDragStart = (e, stepNumber) => {
    setDraggedStep(stepNumber);
    e.dataTransfer.setData("text/plain", `step-${stepNumber}`);
    e.dataTransfer.effectAllowed = "move";

    const dragImg = document.createElement("div");
    dragImg.style.position = "absolute";
    dragImg.style.width = "300px";
    dragImg.style.height = "100px";
    dragImg.style.opacity = "0.01";
    document.body.appendChild(dragImg);
    e.dataTransfer.setDragImage(dragImg, 150, 50);
    setTimeout(() => document.body.removeChild(dragImg), 0);
  };

  const handleStepDragOver = (e, targetStepNumber) => {
    e.preventDefault();
    if (draggedStep && draggedStep !== targetStepNumber) {
      e.dataTransfer.dropEffect = "move";
      setDragOverStep(targetStepNumber);
    }
  };

  const handleStepDragEnter = (e, targetStepNumber) => {
    if (draggedStep && draggedStep !== targetStepNumber) {
      setDragOverStep(targetStepNumber);
    }
  };

  const handleStepDragLeave = (e, targetStepNumber) => {
    // Only clear if we're leaving this specific step
    if (e.currentTarget.contains(e.relatedTarget)) {
      return;
    }
    if (dragOverStep === targetStepNumber) {
      setDragOverStep(null);
    }
  };

  const handleStepDrop = (e, targetStepNumber) => {
    e.preventDefault();
    if (!draggedStep || draggedStep === targetStepNumber) return;

    const newFields = [...fields];

    newFields.forEach((field) => {
      const fieldStep = field.step || 1;

      if (draggedStep < targetStepNumber) {
        if (fieldStep === draggedStep) {
          field.step = targetStepNumber;
        } else if (fieldStep > draggedStep && fieldStep <= targetStepNumber) {
          field.step = fieldStep - 1;
        }
      } else {
        if (fieldStep === draggedStep) {
          field.step = targetStepNumber;
        } else if (fieldStep >= targetStepNumber && fieldStep < draggedStep) {
          field.step = fieldStep + 1;
        }
      }
    });

    setFields(newFields);
    setDraggedStep(null);
    setDragOverStep(null);
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

      {showSavedNotification && <DraftSavedNotification />}

      <div className="flex-1 p-4 md:p-6 overflow-y-auto border-dashed border border-gray-200">
        <div className="max-w-4xl mx-auto">
          <div className="mb-4 flex justify-between items-center">
            <h2 className="text-xl font-semibold transition-all duration-300">
              {isPreviewMode
                ? "Form Preview - Step " + currentStep + " of " + totalSteps
                : "Form Builder"}
              {!isPreviewMode && (
                <span className="text-sm ml-2 font-normal text-gray-500 transition-all duration-300">
                  {maxSteps} step{maxSteps !== 1 ? "s" : ""} available
                </span>
              )}
            </h2>
            <button
              onClick={togglePreviewMode}
              className={`flex items-center transition-all duration-300 ease-in-out text-blue-600 hover:text-blue-800 ${
                isPreviewMode ? "text-gray-600 hover:text-gray-800" : ""
              }`}
            >
              {isPreviewMode ? (
                <>
                  <MdArrowBack className="mr-1 transition-transform duration-300" />{" "}
                  Back to Editor
                </>
              ) : (
                <>
                  <MdRemoveRedEye className="mr-1 transition-transform duration-300 hover:scale-110" />{" "}
                  Preview
                </>
              )}
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

          <div
            className={`transition-all duration-500 ease-in-out ${
              isPreviewMode ? "opacity-100" : ""
            }`}
          >
            {isPreviewMode ? (
              <div className="transition-opacity duration-300 ease-in-out">
                {currentStepFields.length === 0 ? (
                  <div className="flex items-center justify-center h-64 border-2 border-dashed border-gray-300 rounded-lg">
                    <p className="text-gray-400 text-lg">
                      No fields found for step {currentStep}
                    </p>
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
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "bg-gray-500 text-white hover:bg-gray-600"
                      }`}
                    >
                      Previous
                    </button>

                    <button
                      onClick={nextStep}
                      disabled={currentStep === totalSteps}
                      className={`px-4 py-2 rounded ${
                        currentStep === totalSteps
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "bg-blue-500 text-white hover:bg-blue-600"
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
                  {availableSteps.map((stepNumber) => {
                    const stepFields = fields.filter(
                      (field) => (field.step || 1) === stepNumber
                    );

                    return (
                      <div
                        key={stepNumber}
                        className={`relative border-2 ${
                          dragOverStep === stepNumber
                            ? "border-blue-500 bg-blue-50 border-dashed scale-[1.01]"
                            : draggedStep === stepNumber
                            ? "border-blue-300 bg-blue-50 opacity-50 border-dashed rotate-1"
                            : "border-gray-200 hover:border-gray-300"
                        } rounded-lg p-5 transition-all duration-300 ease-in-out hover:shadow-lg will-change-transform`}
                        style={{
                          background:
                            dragOverStep !== stepNumber &&
                            draggedStep !== stepNumber
                              ? "linear-gradient(to bottom, white, #f9fafb)"
                              : "",
                          boxShadow:
                            draggedStep === stepNumber
                              ? "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)"
                              : "",
                        }}
                        onDragOver={(e) => {
                          e.preventDefault();
                          if (draggedStep) {
                            handleStepDragOver(e, stepNumber);
                          } else {
                            handleSectionDragOver(e, stepNumber);
                          }
                        }}
                        onDragEnter={(e) => {
                          e.preventDefault();
                          handleStepDragEnter(e, stepNumber);
                        }}
                        onDragLeave={(e) => handleStepDragLeave(e, stepNumber)}
                        onDrop={(e) => {
                          e.preventDefault();
                          if (draggedStep) {
                            handleStepDrop(e, stepNumber);
                          } else {
                            handleSectionDrop(e, stepNumber);
                          }
                        }}
                        draggable={true}
                        onDragStart={(e) => handleStepDragStart(e, stepNumber)}
                        onDragEnd={resetDragState}
                      >
                        <div className="absolute -left-3 top-1/2 transform -translate-y-1/2 p-1.5 bg-white rounded-full text-gray-400 border border-gray-200 shadow-sm z-10 cursor-move hover:text-blue-500 hover:border-blue-200 hover:bg-blue-50 transition-colors duration-200">
                          <MdDragHandle size={18} />
                        </div>

                        {availableSteps.length > 1 && (
                          <button
                            onClick={() => removeStep(stepNumber)}
                            className="absolute -right-3 top-1/2 transform -translate-y-1/2 p-1.5 bg-white rounded-full text-gray-400 hover:text-red-600 hover:bg-red-50 border border-gray-200 shadow-sm z-10 transition-all duration-200 ease-in-out hover:scale-110 hover:rotate-12"
                            title={`Remove Step ${stepNumber}`}
                          >
                            <MdCancel size={18} />
                          </button>
                        )}

                        <div className="flex justify-between items-center mb-5">
                          <h3 className="text-lg font-semibold text-blue-700 flex items-center">
                            <span className="bg-blue-100 text-blue-800 w-7 h-7 inline-flex items-center justify-center rounded-full mr-2 text-sm font-bold shadow-sm">
                              {stepNumber}
                            </span>
                            Step {stepNumber}
                          </h3>
                          <span className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full transition-all duration-300 font-medium">
                            {stepFields.length} field
                            {stepFields.length !== 1 ? "s" : ""}
                          </span>
                        </div>

                        {stepFields.length === 0 ? (
                          <div className="flex items-center justify-center h-32 border-2 border-dashed border-gray-300 rounded-lg transition-all duration-300 ease-in-out bg-gray-50 hover:bg-gray-100 group">
                            <p className="text-gray-400 group-hover:text-gray-500 transition-colors duration-200 flex flex-col items-center">
                              <MdAdd className="text-2xl mb-2 opacity-70 group-hover:opacity-100" />
                              Drop form elements here for Step {stepNumber}
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-3 transition-all duration-300 ease-in-out">
                            {stepFields.map((field) => (
                              <div
                                key={field.id}
                                className={`p-4 border rounded-md transition-all duration-300 ease-in-out transform
                                  ${
                                    draggedField?.id === field.id
                                      ? "opacity-50 border-dashed bg-gray-50 scale-98 rotate-1"
                                      : "bg-white hover:bg-gray-50"
                                  } 
                                  ${
                                    dragOverFieldId === field.id
                                      ? "border-blue-500 bg-blue-50"
                                      : "border-gray-200"
                                  }
                                  cursor-move hover:shadow-md relative group`}
                                draggable="true"
                                onDragStart={(e) =>
                                  handleFieldDragStart(e, field)
                                }
                                onDragOver={(e) =>
                                  handleFieldDragOver(e, field.id)
                                }
                                onDrop={(e) =>
                                  handleFieldDrop(e, field.id, stepNumber)
                                }
                                onDragEnd={resetDragState}
                              >
                                <div className="absolute top-2 right-2 flex space-x-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                  <button
                                    type="button"
                                    className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-100 rounded-full transition-all duration-200 transform hover:scale-110"
                                    onClick={() => handleEditField(field)}
                                    title="Edit Field"
                                  >
                                    <MdEdit size={18} />
                                  </button>
                                  <button
                                    type="button"
                                    className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-100 rounded-full transition-all duration-200 transform hover:scale-110"
                                    onClick={() => {
                                      setFields(
                                        fields.filter((f) => f.id !== field.id)
                                      );
                                    }}
                                    title="Remove Field"
                                  >
                                    <MdDelete size={18} />
                                  </button>
                                </div>

                                <div className="flex items-center mb-2 text-gray-500">
                                  <span className="mr-2">
                                    <MdDragIndicator className="transition-transform duration-200 hover:scale-110 text-gray-400" />
                                  </span>
                                  <span className="text-sm font-medium">
                                    Drag to reorder or move between steps
                                  </span>
                                </div>
                                <FormField
                                  field={field}
                                  showStepIndicator={false}
                                />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="flex justify-center pt-6">
                  <button
                    onClick={addNewStep}
                    className="group px-5 py-2.5 text-gray-500 border-gray-400 border-dashed border-[1px] hover:bg-gradient-to-r hover:from-blue-500 hover:to-blue-600 hover:text-white hover:border-transparent transition-all duration-300 rounded-lg flex items-center transform hover:scale-105 hover:shadow-lg"
                  >
                    <MdAdd className="h-5 w-5 mr-2 transition-transform duration-300 group-hover:rotate-90" />
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
