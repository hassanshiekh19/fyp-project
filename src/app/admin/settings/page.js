'use client';
import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/data/firebase';
import { Paintbrush, Upload, Save } from 'lucide-react';

const AdminThemeSettings = () => {
  const [theme, setTheme] = useState({
    logo: '',
    color: 'blue',
    font: 'sans-serif',
  });

  const [newLogo, setNewLogo] = useState(null);

  useEffect(() => {
    const fetchTheme = async () => {
      const docRef = doc(db, 'settings', 'theme');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setTheme(docSnap.data());
      }
    };
    fetchTheme();
  }, []);

  const handleSave = async () => {
    const docRef = doc(db, 'settings', 'theme');
    await setDoc(docRef, theme);
    alert('✅ Theme settings updated');
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setTheme(prev => ({ ...prev, logo: reader.result }));
        setNewLogo(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Paintbrush size={24} /> Theme Settings
      </h1>

      <div className="space-y-6">
        {/* Logo Upload */}
        <div>
          <label className="block font-medium mb-2">Upload Logo</label>
          <input type="file" onChange={handleFileChange} />
          {theme.logo && (
            <img
              src={theme.logo}
              alt="Current Logo"
              className="h-20 mt-3 rounded shadow"
            />
          )}
        </div>

        {/* Primary Color */}
        <div>
          <label className="block font-medium mb-2">Primary Color</label>
          <select
            value={theme.color}
            onChange={(e) => setTheme({ ...theme, color: e.target.value })}
            className="border px-4 py-2 rounded"
          >
            <option value="blue">Blue</option>
            <option value="emerald">Green</option>
            <option value="rose">Red</option>
            <option value="violet">Purple</option>
            <option value="amber">Yellow</option>
          </select>
        </div>

        {/* Font Style */}
        <div>
          <label className="block font-medium mb-2">Font Style</label>
          <select
            value={theme.font}
            onChange={(e) => setTheme({ ...theme, font: e.target.value })}
            className="border px-4 py-2 rounded"
          >
            <option value="sans-serif">Sans Serif</option>
            <option value="serif">Serif</option>
            <option value="monospace">Monospace</option>
          </select>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="bg-blue-600 text-white px-5 py-2 rounded flex items-center gap-2 hover:bg-blue-700"
        >
          <Save size={18} /> Save Settings
        </button>
      </div>
    </div>
  );
};

export default AdminThemeSettings;
