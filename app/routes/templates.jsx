import React, { useState } from "react";
import { useNavigate, Link } from "@remix-run/react";
import { MdCheckCircle, MdAdd, MdArrowForward } from "react-icons/md";

const DRAFT_FORM_KEY = "draftForm";
const SAVED_FORMS_KEY = "savedForms";

export default function Templates() {
  const navigate = useNavigate();
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const templates = {
    contactForm: {
      name: "Contact Form",
      category: "basic",
      description: "A simple contact form with name, email, subject, and message fields.",
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
      category: "multi-step",
      description: "Collect detailed feedback with various question types organized in multiple steps.",
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
      category: "multi-step",
      description: "Register attendees for your event with personal info, preferences, and payment details.",
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
      category: "multi-step",
      description: "Comprehensive application form with personal details, experience, education, and file uploads.",
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
      category: "basic",
      description: "Gather customer satisfaction data with rating scales, multiple choice, and comment fields.",
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
      category: "basic",
      description: "Simple email collection with name, email, and preference settings.",
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
      category: "multi-step",
      description: "Product selection, quantity, shipping details, and payment information collection.",
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
      name: "Lead Generation",
      category: "basic",
      description: "Capture prospect information with contact details and interest qualification questions.",
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
      name: "Contest Entry",
      category: "basic",
      description: "Collect participant information for giveaways and contests with terms acceptance.",
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
    const selected = templates[templateKey];
    if (selected) {
      const templateId = `template-${Date.now()}`;

      const highestStep = Math.max(
        ...selected.fields.map((f) => f.step || 1),
        1
      );

      const templateData = {
        name: selected.name,
        fields: selected.fields,
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

      navigate(`/create?formId=${templateId}`);
    }
  };

  const selectTemplate = (templateKey) => {
    setSelectedTemplate(templateKey);
  };

  const getCategoryBadge = (category) => {
    if (category === 'multi-step') {
      return <span className="text-green-700 text-xs font-medium">Multi-step</span>;
    }
    return <span className="text-blue-700 text-xs font-medium">Basic</span>;
  };

  // Group templates by category
  const popularTemplates = ['contactForm', 'surveyForm', 'eventRegistration'];
  const businessTemplates = ['jobApplication', 'customerFeedback', 'orderForm'];
  const marketingTemplates = ['newsletterSignup', 'leadGeneration', 'contestEntry'];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Form Templates</h2>
          
          {selectedTemplate ? (
            <button
              onClick={() => handleUseTemplate(selectedTemplate)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Use Selected Template <MdArrowForward className="ml-2" />
            </button>
          ) : (
            <Link
              to="/create"
              className="flex items-center text-blue-600 hover:text-blue-800"
            >
              <MdAdd className="mr-1" /> Create Empty Form
            </Link>
          )}
        </div>
        
        <p className="text-gray-600 mb-6">
          Select a template to jumpstart your form creation process.
        </p>
        
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-4 text-gray-800">Popular Templates</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {popularTemplates.map(key => (
              <div 
                key={key}
                className={`p-4 transition-all rounded-lg cursor-pointer ${
                  selectedTemplate === key 
                    ? 'bg-blue-50 border-blue-500 border' 
                    : 'hover:bg-gray-50 border border-gray-100'
                }`}
                onClick={() => selectTemplate(key)}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-medium">{templates[key].name}</h3>
                  {selectedTemplate === key && (
                    <MdCheckCircle className="text-blue-500 text-xl" />
                  )}
                </div>
                
                <div className="mb-2">
                  {getCategoryBadge(templates[key].category)}
                </div>
                
                <p className="text-gray-600 text-sm">
                  {templates[key].description}
                </p>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-4 text-gray-800">Business Forms</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {businessTemplates.map(key => (
              <div 
                key={key}
                className={`p-4 transition-all rounded-lg cursor-pointer ${
                  selectedTemplate === key 
                    ? 'bg-blue-50 border-blue-500 border' 
                    : 'hover:bg-gray-50 border border-gray-100'
                }`}
                onClick={() => selectTemplate(key)}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-medium">{templates[key].name}</h3>
                  {selectedTemplate === key && (
                    <MdCheckCircle className="text-blue-500 text-xl" />
                  )}
                </div>
                
                <div className="mb-2">
                  {getCategoryBadge(templates[key].category)}
                </div>
                
                <p className="text-gray-600 text-sm">
                  {templates[key].description}
                </p>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-4 text-gray-800">Marketing Forms</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {marketingTemplates.map(key => (
              <div 
                key={key}
                className={`p-4 transition-all rounded-lg cursor-pointer ${
                  selectedTemplate === key 
                    ? 'bg-blue-50 border-blue-500 border' 
                    : 'hover:bg-gray-50 border border-gray-100'
                }`}
                onClick={() => selectTemplate(key)}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-medium">{templates[key].name}</h3>
                  {selectedTemplate === key && (
                    <MdCheckCircle className="text-blue-500 text-xl" />
                  )}
                </div>
                
                <div className="mb-2">
                  {getCategoryBadge(templates[key].category)}
                </div>
                
                <p className="text-gray-600 text-sm">
                  {templates[key].description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
