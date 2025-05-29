import React, { useState, useEffect } from "react";
import { useNavigate, Link, useSearchParams } from "@remix-run/react";
import { MdCheckCircle, MdAdd, MdArrowForward } from "react-icons/md";
import PageLayout from "../components/PageLayout";

const DRAFT_FORM_KEY = "draftForm";
const SAVED_FORMS_KEY = "savedForms";

export default function Templates() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  
  useEffect(() => {
    // Fetch templates data
    const mockTemplates = [
      // Business category
      { id: 'business-feedback', name: 'Customer Feedback', category: 'Business', icon: '💼', fields: 8, popularity: 'high' },
      { id: 'business-contact', name: 'Contact Form', category: 'Business', icon: '📞', fields: 5, popularity: 'high' },
      { id: 'business-lead', name: 'Lead Generation', category: 'Business', icon: '🎯', fields: 7, popularity: 'medium' },
      { id: 'business-order', name: 'Order Form', category: 'Business', icon: '🛒', fields: 10, popularity: 'medium' },
      { id: 'business-registration', name: 'Event Registration', category: 'Business', icon: '📅', fields: 12, popularity: 'high' },
      
      // Education category
      { id: 'education-application', name: 'Course Application', category: 'Education', icon: '🎓', fields: 15, popularity: 'medium' },
      { id: 'education-feedback', name: 'Course Feedback', category: 'Education', icon: '📝', fields: 10, popularity: 'low' },
      { id: 'education-quiz', name: 'Quiz Form', category: 'Education', icon: '❓', fields: 8, popularity: 'medium' },
      { id: 'education-registration', name: 'Student Registration', category: 'Education', icon: '📚', fields: 12, popularity: 'high' },
      
      // Healthcare category
      { id: 'healthcare-appointment', name: 'Appointment Request', category: 'Healthcare', icon: '🩺', fields: 7, popularity: 'high' },
      { id: 'healthcare-intake', name: 'Patient Intake', category: 'Healthcare', icon: '🏥', fields: 20, popularity: 'medium' },
      { id: 'healthcare-feedback', name: 'Service Feedback', category: 'Healthcare', icon: '💉', fields: 12, popularity: 'low' },
      
      // HR category
      { id: 'hr-application', name: 'Job Application', category: 'HR', icon: '👔', fields: 18, popularity: 'high' },
      { id: 'hr-onboarding', name: 'Employee Onboarding', category: 'HR', icon: '🚪', fields: 25, popularity: 'medium' },
      { id: 'hr-survey', name: 'Employee Survey', category: 'HR', icon: '📊', fields: 15, popularity: 'medium' },
      
      // Events category
      { id: 'event-rsvp', name: 'RSVP Form', category: 'Events', icon: '✉️', fields: 6, popularity: 'high' },
      { id: 'event-feedback', name: 'Event Feedback', category: 'Events', icon: '🎭', fields: 10, popularity: 'medium' },
      { id: 'event-registration', name: 'Event Registration', category: 'Events', icon: '🎪', fields: 12, popularity: 'high' },
    ];

    setTemplates(mockTemplates);
    
    // Check for template selection from URL
    const templateId = searchParams.get('template');
    if (templateId) {
      const template = mockTemplates.find(t => t.id === templateId);
      if (template) {
        setSelectedTemplate(template);
      }
    }
  }, [searchParams]);

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
  };

  const handleUseTemplate = () => {
    if (selectedTemplate) {
      navigate(`/create?template=${selectedTemplate.id}`);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          template.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || template.category.toLowerCase() === filter.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  // Group templates by category
  const templatesByCategory = filteredTemplates.reduce((acc, template) => {
    if (!acc[template.category]) {
      acc[template.category] = [];
    }
    acc[template.category].push(template);
    return acc;
  }, {});

  const categories = Object.keys(templatesByCategory).sort();

  return (
    <PageLayout 
      title="Form Templates" 
      description="Choose a template to get started quickly or create a form from scratch."
      actions={
        <button
          onClick={() => navigate('/create')}
          className="btn-primary flex items-center"
        >
          <MdAdd className="mr-1.5 h-5 w-5" />
          Create From Scratch
        </button>
      }
    >
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-2/3">
          <div className="bg-white rounded-xl shadow-md p-6 mb-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center space-y-4 sm:space-y-0 mb-6">
              <div className="relative flex-1 max-w-md mx-2">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search templates..."
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </div>
              
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleFilterChange('all')}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                    filter === 'all' 
                      ? 'bg-blue-100 text-blue-800 ring-2 ring-blue-300 ring-offset-1' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  All
                </button>
                
                {Array.from(new Set(templates.map(t => t.category))).sort().map(category => (
                  <button
                    key={category}
                    onClick={() => handleFilterChange(category.toLowerCase())}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                      filter === category.toLowerCase() 
                        ? 'bg-blue-100 text-blue-800 ring-2 ring-blue-300 ring-offset-1' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
            
            {filteredTemplates.length === 0 ? (
              <div className="py-12 text-center animate-fadeIn">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <h3 className="mt-2 text-lg font-medium text-gray-900">No templates found</h3>
                <p className="mt-1 text-gray-500">Try adjusting your search or filter to find what you're looking for.</p>
              </div>
            ) : (
              <div className="space-y-8">
                {categories.map(category => (
                  <div key={category} className="animate-slideUpIn">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
                      <span className="w-8 h-8 flex items-center justify-center bg-blue-100 text-blue-800 rounded-full mr-2">
                        {templatesByCategory[category][0].icon}
                      </span>
                      {category}
                    </h2>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {templatesByCategory[category].map(template => (
                        <div
                          key={template.id}
                          onClick={() => handleTemplateSelect(template)}
                          className={`border rounded-xl overflow-hidden group transition-all duration-300 transform hover:scale-102 hover:shadow-lg ${
                            selectedTemplate?.id === template.id 
                              ? 'ring-2 ring-blue-500 bg-blue-50' 
                              : 'hover:bg-gray-50 hover:border-gray-300'
                          }`}
                        >
                          <div className="p-5 relative">
                            <div className="flex items-start justify-between">
                              <div className="flex items-center space-x-3">
                                <div className={`text-3xl p-3 rounded-lg transition-all duration-300 ${
                                  selectedTemplate?.id === template.id 
                                    ? 'bg-blue-100' 
                                    : 'bg-gray-100 group-hover:bg-blue-50'
                                }`}>
                                  {template.icon}
                                </div>
                                <div>
                                  <h3 className="font-medium text-lg group-hover:text-blue-700 transition-colors duration-200">{template.name}</h3>
                                  <p className="text-sm text-gray-500 group-hover:text-gray-600 transition-colors duration-200">
                                    <span className="inline-flex items-center">
                                      <svg className="h-4 w-4 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                      </svg>
                                      {template.fields} fields
                                    </span>
                                  </p>
                                </div>
                              </div>
                              <div className={`rounded-full h-6 w-6 flex items-center justify-center transition-all duration-300 ${
                                selectedTemplate?.id === template.id 
                                  ? 'bg-blue-500 text-white scale-110 shadow-md' 
                                  : 'border border-gray-300 group-hover:border-blue-300 group-hover:bg-blue-50'
                              }`}>
                                {selectedTemplate?.id === template.id ? (
                                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                                  </svg>
                                ) : (
                                  <svg className="h-4 w-4 text-gray-400 group-hover:text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                )}
                              </div>
                            </div>
                            
                            <div className="mt-4 flex items-center space-x-2">
                              {template.popularity === 'high' && (
                                <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs font-medium flex items-center">
                                  <svg className="h-3 w-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                                  </svg>
                                  Popular
                                </span>
                              )}
                              {template.popularity === 'medium' && (
                                <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full text-xs font-medium">
                                  Recommended
                                </span>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex justify-end px-5 py-3 bg-gradient-to-r from-gray-50 to-gray-100 border-t group-hover:from-blue-50 group-hover:to-blue-50 transition-all duration-300">
                            <button
                              className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center transition-all duration-200 group-hover:translate-x-1"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedTemplate(template);
                                handleUseTemplate();
                              }}
                            >
                              Use Template
                              <svg className="ml-1 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7m0 0l-7 7m7-7H3" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div className="md:w-1/3">
          <div className="sticky top-8">
            {selectedTemplate ? (
              <div className="bg-white rounded-xl shadow-md overflow-hidden animate-scaleIn">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 relative overflow-hidden">
                  <div className="absolute inset-0 opacity-20">
                    <svg className="h-full w-full" viewBox="0 0 80 80" fill="none">
                      <path d="M14 16H9v-2h5V9.87a4 4 0 1 1 2 0V14h5v2h-5v15.95A10 10 0 0 0 23.66 27l-3.4-2 8.2-2.2-2.2 8.2-2-3.4A12 12 0 0 1 7.96 31.95 4 4 0 0 1 4 28c.01-1.1.45-2.1 1.17-2.83A4 4 0 0 1 8 24h5v-2H8c-1.1 0-2.1.45-2.83 1.17A6 6 0 0 0 2 28c0 1.63.67 3.1 1.76 4.17A14 14 0 0 0 19.95 47.34l-2-3.4 8.2-2.2-2.2 8.2-2-3.4A16 16 0 0 1 5.96 31.95 8 8 0 0 1 0 28c.01-2.2.9-4.2 2.35-5.66A8 8 0 0 1 8 20v-4z" fill="currentColor"></path>
                    </svg>
                  </div>
                  <div className="flex items-center justify-between relative z-10">
                    <div className="flex items-center space-x-4">
                      <div className="text-3xl bg-white bg-opacity-20 p-3 rounded-lg shadow-inner backdrop-blur-sm">
                        {selectedTemplate.icon}
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold">{selectedTemplate.name}</h2>
                        <div className="flex items-center text-blue-100 mt-1">
                          <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                          </svg>
                          {selectedTemplate.category}
                        </div>
                      </div>
                    </div>
                    
                    {selectedTemplate.popularity === 'high' && (
                      <div className="text-black font-bold bg-white bg-opacity-20 px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm">
                        Popular Choice
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="mb-6">
                    <h3 className="text-lg font-medium mb-4 text-gray-800 border-b pb-2">Template Details</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                        <div className="flex items-center">
                          <svg className="h-5 w-5 mr-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                          <span className="text-gray-600 font-medium">Fields</span>
                        </div>
                        <div className="flex items-center bg-white px-3 py-1 rounded-full shadow-sm">
                          <span className="font-semibold text-gray-700">{selectedTemplate.fields}</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                        <div className="flex items-center">
                          <svg className="h-5 w-5 mr-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                          </svg>
                          <span className="text-gray-600 font-medium">Category</span>
                        </div>
                        <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                          {selectedTemplate.category}
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                        <div className="flex items-center">
                          <svg className="h-5 w-5 mr-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                          </svg>
                          <span className="text-gray-600 font-medium">Popularity</span>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                          selectedTemplate.popularity === 'high' ? 'bg-green-100 text-green-800' :
                          selectedTemplate.popularity === 'medium' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {selectedTemplate.popularity.charAt(0).toUpperCase() + selectedTemplate.popularity.slice(1)}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200">
                    <button
                      onClick={handleUseTemplate}
                      className="w-full btn-primary group"
                    >
                      <span className="inline-flex items-center">
                        Use This Template
                        <svg className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </span>
                    </button>
                    
                    <p className="text-xs text-center text-gray-500 mt-2">
                      This template will be used as a starting point for your form
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-md p-6 animate-fadeIn">
                <div className="text-center py-10">
                  <div className="mx-auto w-20 h-20 flex items-center justify-center rounded-full bg-blue-100 mb-4 animate-pulse-custom">
                    <svg className="h-10 w-10 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-medium text-gray-900 mb-2">Select a Template</h3>
                  <p className="text-gray-500 max-w-sm mx-auto mb-6">
                    Choose a template from the list to see more details and get started quickly with pre-built form structures.
                  </p>
                  
                  <div className="flex justify-center">
                    <svg className="w-24 h-24 text-gray-300 animate-bounce-custom" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                    </svg>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
