'use client';
import { useState } from 'react';

export default function ImageUploader({ onUpload }) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      setUploading(true);
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      setUploading(false);

      if (res.ok) {
        onUpload(data.path); // send the path back to parent
      } else {
        alert(data.error || 'Upload failed');
      }
    } catch (err) {
      setUploading(false);
      alert('Error uploading image');
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col items-start space-y-2">
      <input type="file" accept="image/*" onChange={handleUpload} />
      {uploading && <p className="text-sm text-blue-600">Uploading...</p>}
    </div>
  );
}
