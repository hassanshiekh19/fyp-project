'use client';
import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/data/firebase';
import Link from 'next/link';

export default function AdminChats() {
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    const fetchConversations = async () => {
      const snapshot = await getDocs(collection(db, 'conversations'));
      const result = [];

      snapshot.forEach(doc => {
        const data = doc.data();
        result.push({
          id: doc.id,
          patientName: data.patientName,
          doctorName: data.doctorName,
        });
      });

      setConversations(result);
    };

    fetchConversations();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">💬 Doctor-Patient Conversations</h1>
      <ul className="space-y-4">
        {conversations.map(conv => (
          <li key={conv.id} className="p-4 bg-white shadow rounded">
            <p className="font-medium">
              {conv.patientName} 🡒 {conv.doctorName}
            </p>
            <Link
              href={`/admin/chats/${conv.id}`}
              className="text-blue-600 text-sm underline"
            >
              View Conversation
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
