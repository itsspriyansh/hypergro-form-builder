import React, { useState, useEffect } from 'react';
import { Link } from '@remix-run/react';

export default function Forms() {
  const [savedForms, setSavedForms] = useState([]);
  
  useEffect(() => {
    try {
      const formsData = localStorage.getItem('savedForms');
      if (formsData) {
        setSavedForms(JSON.parse(formsData));
      }
    } catch (error) {
      console.error('Error loading saved forms:', error);
    }
  }, []);

  const handleDeleteForm = (formId) => {
    if (window.confirm('Are you sure you want to delete this form?')) {
      const updatedForms = savedForms.filter(form => form.id !== formId);
      setSavedForms(updatedForms);
      localStorage.setItem('savedForms', JSON.stringify(updatedForms));
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">My Forms</h2>
        <Link to="/builder" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
          Create New Form
        </Link>
      </div>
      
      {savedForms.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="text-left p-3 border">Form Name</th>
                <th className="text-left p-3 border">Created</th>
                <th className="text-left p-3 border">Responses</th>
                <th className="text-left p-3 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {savedForms.map(form => (
                <tr key={form.id} className="hover:bg-gray-50">
                  <td className="p-3 border">{form.name}</td>
                  <td className="p-3 border">{formatDate(form.createdAt)}</td>
                  <td className="p-3 border">{form.responses}</td>
                  <td className="p-3 border">
                    <div className="flex space-x-2">
                      <Link 
                        to={`/builder?formId=${form.id}`} 
                        className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                      >
                        Edit
                      </Link>
                      <button className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200">
                        Share
                      </button>
                      <button 
                        onClick={() => handleDeleteForm(form.id)}
                        className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center p-8 bg-gray-50 rounded">
          <p className="text-gray-500">You haven't created any forms yet.</p>
          <Link 
            to="/builder" 
            className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Create Your First Form
          </Link>
        </div>
      )}
    </div>
  );
}
