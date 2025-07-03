'use client';
import { useEffect, useState } from 'react';
import { db } from '@/data/firebase';
import { collection, setDoc, doc } from 'firebase/firestore';
import doctors from '@/data/doctors';

const UploadDoctors = () => {
  const [status, setStatus] = useState('Waiting...');

  useEffect(() => {
    const uploadDoctors = async () => {
      try {
        for (let doctor of doctors) {
          await setDoc(doc(db, 'doctors', doctor.id.toString()), doctor);
        }
        setStatus('✅ Doctors uploaded successfully!');
      } catch (error) {
        console.error(error);
        setStatus('❌ Upload failed');
      }
    };

    uploadDoctors();
  }, []);

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-4">Uploading Doctors to Firestore...</h1>
      <p>{status}</p>
    </div>
  );
};

export default UploadDoctors;
