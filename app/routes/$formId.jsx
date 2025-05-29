import React, { useState, useEffect } from "react";
import { useParams, Link } from "@remix-run/react";
import FormField from "../components/FormField";

const SAVED_FORMS_KEY = "savedForms";
const FORM_RESPONSES_KEY = "formResponses";

export default function FormView() {
  const { formId } = useParams();
  const [form, setForm] = useState(null);
  const [formData, setFormData] = useState({});
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    try {
      const savedForms = localStorage.getItem(SAVED_FORMS_KEY);

      if (savedForms) {
        const parsedForms = JSON.parse(savedForms);

        const targetForm = parsedForms.find(
          (f) => f.id === formId || f.shareableId === formId
        );

        if (targetForm) {
          setForm(targetForm);
        } else {
          setError("Form not found");
        }
      } else {
        setError("No forms available");
      }
    } catch (err) {
      console.error("Error loading form:", err);
      setError("Failed to load form data");
    } finally {
      setLoading(false);
    }
  }, [formId]);

  const handleInputChange = (fieldId, value) => {
    setFormData((prev) => ({
      ...prev,
      [fieldId]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      currentStep < Math.max(...form.fields.map((field) => field.step || 1))
    ) {
      setCurrentStep(currentStep + 1);
      return;
    }

    const responseData = {
      formId: form.id,
      formName: form.name,
      submittedAt: new Date().toISOString(),
      data: formData,
    };

    try {
      const existingResponses = localStorage.getItem(FORM_RESPONSES_KEY);
      const responses = existingResponses ? JSON.parse(existingResponses) : [];

      responses.push(responseData);
      localStorage.setItem(FORM_RESPONSES_KEY, JSON.stringify(responses));

      const savedForms = JSON.parse(localStorage.getItem(SAVED_FORMS_KEY));
      const updatedForms = savedForms.map((f) => {
        if (f.id === form.id) {
          return {
            ...f,
            responses: (f.responses || 0) + 1,
          };
        }
        return f;
      });

      localStorage.setItem(SAVED_FORMS_KEY, JSON.stringify(updatedForms));

      setSubmitted(true);
    } catch (err) {
      console.error("Error saving response:", err);
      alert("Failed to submit form. Please try again.");
    }
  };

  const stepFields =
    form?.fields?.filter((field) => (field.step || 1) === currentStep) || [];
  const totalSteps = form?.fields
    ? Math.max(...form.fields.map((field) => field.step || 1))
    : 1;

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto p-8 text-center">Loading form...</div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto p-8 text-center">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
          <p className="text-red-700">{error}</p>
        </div>
        <Link
          to="/"
          className="mt-4 inline-block px-4 py-2 bg-blue-500 text-white rounded"
        >
          Go Home
        </Link>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="max-w-3xl mx-auto p-8 text-center">
        <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-4">
          <h2 className="text-xl font-bold text-green-700 mb-2">
            Form Submitted Successfully!
          </h2>
          <p>Thank you for your submission.</p>
        </div>
        <Link
          to="/"
          className="mt-4 inline-block px-4 py-2 bg-blue-500 text-white rounded"
        >
          Go Home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-4">{form?.name || "Form"}</h1>

        {totalSteps > 1 && (
          <div className="mb-6">
            <div className="flex justify-between w-full mb-2">
              {Array.from({ length: totalSteps }, (_, i) => i + 1).map(
                (step) => (
                  <div key={step} className="flex flex-col items-center">
                    <div
                      className={`w-8 h-8 flex items-center justify-center rounded-full 
                      ${
                        step < currentStep
                          ? "bg-green-500 text-white"
                          : step === currentStep
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      {step}
                    </div>
                    <span className="text-xs mt-1">Step {step}</span>
                  </div>
                )
              )}
            </div>
            <div className="w-full bg-gray-200 h-2 rounded-full">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%`,
                }}
              ></div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {stepFields.map((field) => (
            <div key={field.id} className="mb-4">
              <FormField
                field={field}
                value={formData[field.id] || ""}
                onChange={(value) => handleInputChange(field.id, value)}
                editable={true}
              />
            </div>
          ))}

          <div className="flex justify-between mt-6 pt-4 border-t border-gray-200">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep - 1)}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Previous
              </button>
            )}

            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 ml-auto"
            >
              {currentStep < totalSteps ? "Next" : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
