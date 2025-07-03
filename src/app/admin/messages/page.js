'use client';
import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/data/firebase';
import { MessageSquare, Mail } from 'lucide-react';

const AdminMessagesPage = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'messages'));
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMessages(data);
      } catch (error) {
        console.error('Error loading messages:', error);
      }
    };

    fetchMessages();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <MessageSquare size={24} />
        Inbox Messages
      </h1>

      {messages.length === 0 ? (
        <p className="text-gray-600">No messages found.</p>
      ) : (
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className="bg-white shadow border rounded-lg p-4 hover:shadow-md transition"
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold text-blue-600">
                  {msg.name} ({msg.email})
                </p>
                <p className="text-xs text-gray-500">{msg.timestamp || 'Unknown time'}</p>
              </div>
              <p className="text-gray-700">{msg.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminMessagesPage;
