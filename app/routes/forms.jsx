import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from '@remix-run/react';
import { MdClose, MdEdit, MdRemoveRedEye, MdDelete, MdContentCopy, MdAdd } from 'react-icons/md';

function ToastNotification({ message, type, onClose }) {
  return (
    <div className={`fixed bottom-4 right-4 px-4 py-3 rounded-lg shadow-lg ${
      type === 'success' ? 'bg-green-500' : 'bg-blue-500'
    } text-white flex items-center z-50`}>
      <span>{message}</span>
      <button 
        onClick={onClose} 
        className="ml-3 text-white hover:text-gray-200"
      >
        <MdClose />
      </button>
    </div>
  );
}

export default function Forms() {
  const navigate = useNavigate();
  const [savedForms, setSavedForms] = useState([]);
  const [selectedFormIds, setSelectedFormIds] = useState([]);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  
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

  const handleDeleteSelected = () => {
    if (selectedFormIds.length === 0) return;
    
    if (window.confirm(`Are you sure you want to delete ${selectedFormIds.length} selected form(s)?`)) {
      const updatedForms = savedForms.filter(form => !selectedFormIds.includes(form.id));
      setSavedForms(updatedForms);
      localStorage.setItem('savedForms', JSON.stringify(updatedForms));
      setSelectedFormIds([]);
      
      showToast('Forms deleted successfully', 'success');
    }
  };

  const handleEditSelected = () => {
    if (selectedFormIds.length !== 1) {
      showToast('Please select exactly one form to edit', 'error');
      return;
    }
    
    const formId = selectedFormIds[0];
    navigate(`/create?formId=${formId}`);
  };

  const handleViewSelected = () => {
    if (selectedFormIds.length !== 1) {
      showToast('Please select exactly one form to view', 'error');
      return;
    }
    
    const form = savedForms.find(f => f.id === selectedFormIds[0]);
    if (form) {
      const formUrl = `/${form.shareableId || form.id}`;
      window.open(formUrl, '_blank');
    }
  };

  const copyLinkToClipboard = (form) => {
    const shareableLink = `${window.location.origin}/${form.shareableId || form.id}`;
    
    navigator.clipboard.writeText(shareableLink)
      .then(() => {
        showToast('Link copied to clipboard!', 'success');
      })
      .catch(err => {
        console.error('Failed to copy link:', err);
        showToast('Failed to copy link', 'error');
      });
  };

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  const toggleSelectForm = (formId) => {
    setSelectedFormIds(prev => 
      prev.includes(formId) 
        ? prev.filter(id => id !== formId) 
        : [...prev, formId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedFormIds.length === savedForms.length) {
      setSelectedFormIds([]);
    } else {
      setSelectedFormIds(savedForms.map(form => form.id));
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">My Forms</h2>
          <Link
              to="/create"
              className="flex items-center text-blue-600 hover:text-blue-800"
            >
              <MdAdd className="mr-1" /> Create New Form
            </Link>
        </div>
        
        {savedForms.length > 0 ? (
          <>
            <div className="flex items-center mb-4 space-x-2">
              <input 
                type="checkbox" 
                checked={selectedFormIds.length === savedForms.length && savedForms.length > 0} 
                onChange={toggleSelectAll}
                className="w-4 h-4"
              />
              <span className="text-sm text-gray-500">
                {selectedFormIds.length} of {savedForms.length} selected
              </span>
              
              <div className="ml-auto flex space-x-4">
                <button
                  onClick={handleEditSelected}
                  disabled={selectedFormIds.length !== 1}
                  className={`p-2 rounded-full ${
                    selectedFormIds.length === 1 
                      ? 'hover:text-blue-600 hover:bg-blue-100' 
                      : 'text-gray-400 cursor-not-allowed'
                  }`}
                  title="Edit"
                >
                  <MdEdit size={20} />
                </button>
                
                <button
                  onClick={handleViewSelected}
                  disabled={selectedFormIds.length !== 1}
                  className={`p-2 rounded-full ${
                    selectedFormIds.length === 1 
                      ? 'hover:text-blue-600 hover:bg-blue-100' 
                      : 'text-gray-400 cursor-not-allowed'
                  }`}
                  title="View"
                >
                  <MdRemoveRedEye size={20} />
                </button>
                
                <button
                  onClick={handleDeleteSelected}
                  disabled={selectedFormIds.length === 0}
                  className={`p-2 rounded-full ${
                    selectedFormIds.length > 0 
                      ? 'hover:text-red-600 hover:bg-red-100' 
                      : 'text-gray-400 cursor-not-allowed'
                  }`}
                  title="Delete"
                >
                  <MdDelete size={20} />
                </button>
              </div>
            </div>
            
            <div className="space-y-3">
              {savedForms.map(form => (
                <div 
                  key={form.id} 
                  className={`border rounded-lg p-4 transition-all ${
                    selectedFormIds.includes(form.id) 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                  }`}
                  onClick={() => toggleSelectForm(form.id)}
                >
                  <div className="flex items-start">
                    <input 
                      type="checkbox" 
                      checked={selectedFormIds.includes(form.id)} 
                      onChange={() => toggleSelectForm(form.id)}
                      className="mt-1 mr-3"
                      onClick={(e) => e.stopPropagation()} 
                    />
                    
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h3 className="font-semibold text-lg">{form.name}</h3>
                        <button 
                          className="text-gray-500 hover:text-blue-600"
                          onClick={(e) => {
                            e.stopPropagation();
                            copyLinkToClipboard(form);
                          }}
                          title="Copy form link"
                        >
                          <MdContentCopy size={18} />
                        </button>
                      </div>
                      
                      <div className="text-sm text-gray-500 mt-1 flex items-center justify-between">
                        <div>
                          <span>Created: {formatDate(form.createdAt)}</span>
                          <span className="mx-3">•</span>
                          <span>Responses: {form.responses || 0}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center p-8 bg-gray-50 rounded">
            <p className="text-gray-500 mb-4">You haven't created any forms yet.</p>
            <Link 
              to="/create" 
              className="text-blue-600 hover:underline font-light"
            >
              Create Your First Form
            </Link>
            <span className="mx-2 text-gray-500 mb-4">or</span>
            <Link 
              to="/templates" 
              className="text-blue-600 hover:underline font-light"
            >
              Start with a template
            </Link>
          </div>
        )}
      </div>
      
      {toast.show && (
        <ToastNotification
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}
    </div>
  );
}
