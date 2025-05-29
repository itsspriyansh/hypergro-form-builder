import React, { useState, useEffect } from 'react';
import { Link } from '@remix-run/react';

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

export default function Forms() {
  const [savedForms, setSavedForms] = useState([]);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [selectedFormId, setSelectedFormId] = useState(null);
  
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

  const handleShareForm = (form) => {
    const shareId = form.shareableId || form.id;
    setSelectedFormId(shareId);
    setShowShareDialog(true);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getFormViewUrl = (form) => {
    return `/${form.shareableId || form.id}`;
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
                  <td className="p-3 border">{form.responses || 0}</td>
                  <td className="p-3 border">
                    <div className="flex space-x-2">
                      <Link 
                        to={`/builder?formId=${form.id}`} 
                        className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                      >
                        Edit
                      </Link>
                      <Link 
                        to={getFormViewUrl(form)}
                        className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded hover:bg-purple-200"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View
                      </Link>
                      <button 
                        className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200"
                        onClick={() => handleShareForm(form)}
                      >
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
      
      {showShareDialog && selectedFormId && (
        <ShareLinkDialog 
          formId={selectedFormId} 
          onClose={() => setShowShareDialog(false)}
        />
      )}
    </div>
  );
}
