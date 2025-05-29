import React from "react";
import { useNavigate } from "@remix-run/react";

const DRAFT_FORM_KEY = "draftForm";
const SAVED_FORMS_KEY = "savedForms";

export default function Templates() {
  const navigate = useNavigate();

  const templates = {
    contactForm: {
      name: "Contact Form",
      fields: [
        {
          id: "field-1",
          type: "text",
          label: "Name",
          placeholder: "Enter your full name",
          required: true,
          step: 1,
        },
        {
          id: "field-2",
          type: "email",
          label: "Email Address",
          placeholder: "your@email.com",
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
          placeholder: "Your message here...",
          required: true,
          step: 1,
        },
      ],
    },
    surveyForm: {
      name: "Customer Survey",
      fields: [
        {
          id: "field-1",
          type: "text",
          label: "Name",
          placeholder: "Your name",
          required: true,
          step: 1,
        },
        {
          id: "field-2",
          type: "email",
          label: "Email",
          placeholder: "your@email.com",
          required: true,
          step: 1,
        },
        {
          id: "field-3",
          type: "radio",
          label: "How did you hear about us?",
          options: [
            "Social Media",
            "Friend",
            "Advertisement",
            "Search Engine",
            "Other",
          ],
          required: true,
          step: 2,
        },
        {
          id: "field-4",
          type: "dropdown",
          label: "How satisfied are you with our service?",
          options: [
            "Very Satisfied",
            "Satisfied",
            "Neutral",
            "Dissatisfied",
            "Very Dissatisfied",
          ],
          required: true,
          step: 2,
        },
        {
          id: "field-5",
          type: "textarea",
          label: "What can we improve?",
          placeholder: "Your suggestions...",
          required: false,
          step: 3,
        },
      ],
    },
    eventRegistration: {
      name: "Event Registration",
      fields: [
        {
          id: "field-1",
          type: "text",
          label: "Full Name",
          placeholder: "Your full name",
          required: true,
          step: 1,
        },
        {
          id: "field-2",
          type: "email",
          label: "Email",
          placeholder: "your@email.com",
          required: true,
          step: 1,
        },
        {
          id: "field-3",
          type: "text",
          label: "Phone",
          placeholder: "Your phone number",
          required: true,
          step: 1,
        },
        {
          id: "field-4",
          type: "dropdown",
          label: "Number of Guests",
          options: ["1", "2", "3", "4", "5+"],
          required: true,
          step: 2,
        },
        {
          id: "field-5",
          type: "radio",
          label: "Meal Preference",
          options: ["Vegetarian", "Vegan", "Gluten-Free", "No Restrictions"],
          required: true,
          step: 2,
        },
        {
          id: "field-6",
          type: "textarea",
          label: "Special Requirements",
          placeholder: "Any special requirements or comments",
          required: false,
          step: 3,
        },
      ],
    },
    jobApplication: {
      name: "Job Application Form",
      fields: [
        {
          id: "field-1",
          type: "text",
          label: "Full Name",
          placeholder: "Your full name",
          required: true,
          step: 1,
        },
        {
          id: "field-2",
          type: "email",
          label: "Email",
          placeholder: "your@email.com",
          required: true,
          step: 1,
        },
        {
          id: "field-3",
          type: "text",
          label: "Phone",
          placeholder: "Your phone number",
          required: true,
          step: 1,
        },
        {
          id: "field-4",
          type: "dropdown",
          label: "Position Applied For",
          options: [
            "Developer",
            "Designer",
            "Manager",
            "Sales Representative",
            "Other",
          ],
          required: true,
          step: 2,
        },
        {
          id: "field-5",
          type: "textarea",
          label: "Work Experience",
          placeholder: "Describe your relevant work experience",
          required: true,
          step: 2,
        },
        {
          id: "field-6",
          type: "textarea",
          label: "Education",
          placeholder: "Your educational background",
          required: true,
          step: 3,
        },
      ],
    },
    customerFeedback: {
      name: "Customer Feedback",
      fields: [
        {
          id: "field-1",
          type: "text",
          label: "Name",
          placeholder: "Your name",
          required: false,
          step: 1,
        },
        {
          id: "field-2",
          type: "email",
          label: "Email",
          placeholder: "your@email.com",
          required: false,
          step: 1,
        },
        {
          id: "field-3",
          type: "dropdown",
          label: "Product/Service Used",
          options: [
            "Product A",
            "Product B",
            "Service X",
            "Service Y",
            "Other",
          ],
          required: true,
          step: 1,
        },
        {
          id: "field-4",
          type: "radio",
          label: "How would you rate our service?",
          options: ["Excellent", "Good", "Average", "Poor", "Very Poor"],
          required: true,
          step: 1,
        },
        {
          id: "field-5",
          type: "textarea",
          label: "Additional Comments",
          placeholder: "Please share any additional feedback",
          required: false,
          step: 1,
        },
      ],
    },
    newsletterSignup: {
      name: "Newsletter Signup",
      fields: [
        {
          id: "field-1",
          type: "text",
          label: "First Name",
          placeholder: "Your first name",
          required: true,
          step: 1,
        },
        {
          id: "field-2",
          type: "email",
          label: "Email Address",
          placeholder: "your@email.com",
          required: true,
          step: 1,
        },
        {
          id: "field-3",
          type: "radio",
          label: "Email Frequency",
          options: ["Daily", "Weekly", "Monthly"],
          required: true,
          step: 1,
        },
      ],
    },
    orderForm: {
      name: "Order Form",
      fields: [
        {
          id: "field-1",
          type: "text",
          label: "Full Name",
          placeholder: "Your full name",
          required: true,
          step: 1,
        },
        {
          id: "field-2",
          type: "email",
          label: "Email Address",
          placeholder: "your@email.com",
          required: true,
          step: 1,
        },
        {
          id: "field-3",
          type: "text",
          label: "Shipping Address",
          placeholder: "Your shipping address",
          required: true,
          step: 1,
        },
        {
          id: "field-4",
          type: "dropdown",
          label: "Product",
          options: [
            "Product A - $10",
            "Product B - $20",
            "Product C - $30",
            "Product D - $40",
          ],
          required: true,
          step: 2,
        },
        {
          id: "field-5",
          type: "dropdown",
          label: "Quantity",
          options: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
          required: true,
          step: 2,
        },
        {
          id: "field-6",
          type: "dropdown",
          label: "Shipping Method",
          options: [
            "Standard Shipping - $5",
            "Express Shipping - $15",
            "Overnight - $25",
          ],
          required: true,
          step: 2,
        },
        {
          id: "field-7",
          type: "radio",
          label: "Payment Method",
          options: ["Credit Card", "PayPal", "Bank Transfer"],
          required: true,
          step: 3,
        },
        {
          id: "field-8",
          type: "checkbox",
          label: "I agree to the terms and conditions",
          required: true,
          step: 3,
        },
      ],
    },
    leadGeneration: {
      name: "Lead Generation Form",
      fields: [
        {
          id: "field-1",
          type: "text",
          label: "Full Name",
          placeholder: "Your full name",
          required: true,
          step: 1,
        },
        {
          id: "field-2",
          type: "email",
          label: "Email Address",
          placeholder: "your@email.com",
          required: true,
          step: 1,
        },
        {
          id: "field-3",
          type: "text",
          label: "Phone Number",
          placeholder: "Your phone number",
          required: true,
          step: 1,
        },
        {
          id: "field-4",
          type: "dropdown",
          label: "Company Size",
          options: [
            "1-10 employees",
            "11-50 employees",
            "51-200 employees",
            "201-500 employees",
            "500+ employees",
          ],
          required: true,
          step: 1,
        },
        {
          id: "field-5",
          type: "radio",
          label: "Interested in our",
          options: ["Products", "Services", "Both"],
          required: true,
          step: 1,
        },
        {
          id: "field-6",
          type: "checkbox",
          label: "Subscribe to newsletter",
          required: false,
          step: 1,
        },
      ],
    },
    contestEntry: {
      name: "Contest Entry Form",
      fields: [
        {
          id: "field-1",
          type: "text",
          label: "Full Name",
          placeholder: "Your full name",
          required: true,
          step: 1,
        },
        {
          id: "field-2",
          type: "email",
          label: "Email Address",
          placeholder: "your@email.com",
          required: true,
          step: 1,
        },
        {
          id: "field-3",
          type: "text",
          label: "Phone Number",
          placeholder: "Your phone number",
          required: true,
          step: 1,
        },
        {
          id: "field-4",
          type: "dropdown",
          label: "How did you hear about this contest?",
          options: ["Social Media", "Email", "Website", "Friend", "Other"],
          required: true,
          step: 1,
        },
        {
          id: "field-5",
          type: "checkbox",
          label: "I agree to the contest rules and terms",
          required: true,
          step: 1,
        },
        {
          id: "field-6",
          type: "checkbox",
          label: "I would like to receive promotional emails",
          required: false,
          step: 1,
        },
      ],
    },
  };

  const handleUseTemplate = (templateKey) => {
    const selectedTemplate = templates[templateKey];
    if (selectedTemplate) {
      const templateId = `template-${Date.now()}`;

      const highestStep = Math.max(
        ...selectedTemplate.fields.map((f) => f.step || 1),
        1
      );

      const templateData = {
        name: selectedTemplate.name,
        fields: selectedTemplate.fields,
        id: templateId,
        maxSteps: highestStep,
      };

      localStorage.setItem(
        DRAFT_FORM_KEY,
        JSON.stringify({
          name: templateData.name,
          fields: templateData.fields,
          formId: templateData.id,
          lastEdited: new Date().toISOString(),
        })
      );

      try {
        const savedFormsJson = localStorage.getItem(SAVED_FORMS_KEY);
        const savedForms = savedFormsJson ? JSON.parse(savedFormsJson) : [];

        savedForms.push({
          id: templateId,
          name: templateData.name,
          fields: templateData.fields,
          maxSteps: templateData.maxSteps,
          createdAt: new Date().toISOString(),
        });

        localStorage.setItem(SAVED_FORMS_KEY, JSON.stringify(savedForms));
      } catch (error) {
        console.error("Error saving template to saved forms:", error);
      }

      navigate(`/builder?formId=${templateId}`);

      console.log(
        "Template selected:",
        templateData.name,
        "ID:",
        templateId,
        "Steps:",
        templateData.maxSteps
      );
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-2">Form Templates</h2>
      <p className="text-gray-600 mb-6">
        Choose a template to jumpstart your form creation process.
      </p>

      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4 text-blue-700 border-b pb-2">
          Popular Templates
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-white">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">Contact Form</h3>
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                Basic
              </span>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              A simple contact form with name, email, subject, and message
              fields.
            </p>
            <button
              onClick={() => handleUseTemplate("contactForm")}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors w-full"
            >
              Use Template
            </button>
          </div>

          <div className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-white">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">Survey Form</h3>
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                Multi-step
              </span>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Collect detailed feedback with various question types organized in
              multiple steps.
            </p>
            <button
              onClick={() => handleUseTemplate("surveyForm")}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors w-full"
            >
              Use Template
            </button>
          </div>

          <div className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-white">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">Event Registration</h3>
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                Multi-step
              </span>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Register attendees for your event with personal info, preferences,
              and payment details.
            </p>
            <button
              onClick={() => handleUseTemplate("eventRegistration")}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors w-full"
            >
              Use Template
            </button>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4 text-blue-700 border-b pb-2">
          Business Forms
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-white">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">Job Application</h3>
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                Multi-step
              </span>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Comprehensive application form with personal details, experience,
              education, and file uploads.
            </p>
            <button
              onClick={() => handleUseTemplate("jobApplication")}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors w-full"
            >
              Use Template
            </button>
          </div>

          <div className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-white">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">Customer Feedback</h3>
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                Basic
              </span>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Gather customer satisfaction data with rating scales, multiple
              choice, and comment fields.
            </p>
            <button
              onClick={() => handleUseTemplate("customerFeedback")}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors w-full"
            >
              Use Template
            </button>
          </div>

          <div className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-white">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">Order Form</h3>
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                Multi-step
              </span>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Product selection, quantity, shipping details, and payment
              information collection.
            </p>
            <button
              onClick={() => handleUseTemplate("orderForm")}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors w-full"
            >
              Use Template
            </button>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4 text-blue-700 border-b pb-2">
          Marketing Forms
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-white">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">Newsletter Signup</h3>
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                Basic
              </span>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Simple email collection with name, email, and preference settings.
            </p>
            <button
              onClick={() => handleUseTemplate("newsletterSignup")}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors w-full"
            >
              Use Template
            </button>
          </div>

          <div className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-white">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">Lead Generation</h3>
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                Basic
              </span>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Capture prospect information with contact details and interest
              qualification questions.
            </p>
            <button
              onClick={() => handleUseTemplate("leadGeneration")}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors w-full"
            >
              Use Template
            </button>
          </div>

          <div className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-white">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">Contest Entry</h3>
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                Basic
              </span>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Collect participant information for giveaways and contests with
              terms acceptance.
            </p>
            <button
              onClick={() => handleUseTemplate("contestEntry")}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors w-full"
            >
              Use Template
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
