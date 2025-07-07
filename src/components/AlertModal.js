import React from 'react';

export default function AlertModal({ isOpen, title, message, type, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/70 backdrop-blur-sm transition-all">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 text-center">
        <div className="text-4xl mb-4">
          {type === 'success' ? '✅' : '⚠️'}
        </div>
        <h2 className="text-2xl font-semibold mb-2 text-gray-800">{title}</h2>
        <p className="text-gray-600 mb-4">{message}</p>
        <button
          onClick={onClose}
          className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition"
        >
          Close
        </button>
      </div>
    </div>
  );
}
