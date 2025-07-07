'use client';
import { useEffect, useState } from 'react';
import { db, auth } from '@/data/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

export default function DoctorChatPage() {
  const [chats, setChats] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchChats = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const doctorId = user.uid;

      const q1 = query(collection(db, 'conversations'), where('user1', '==', doctorId));
      const q2 = query(collection(db, 'conversations'), where('user2', '==', doctorId));

      const [snap1, snap2] = await Promise.all([getDocs(q1), getDocs(q2)]);
      const combined = [...snap1.docs, ...snap2.docs];
      const allChats = combined.map(doc => ({ id: doc.id, ...doc.data() }));

      setChats(allChats);
    };

    fetchChats();
  }, []);

  const handleChatClick = (chatId) => {
    router.push(`/doctor/chat/${chatId}`); // ✅ correct route for doctor
  };

  return (
    <div className="space-y-4 p-6">
      <h2 className="text-2xl font-bold">💬 My Chats</h2>

      {chats.length === 0 ? (
        <p className="text-gray-500">No conversations found.</p>
      ) : (
        chats.map(chat => (
          <div
            key={chat.id}
            onClick={() => handleChatClick(chat.id)}
            className="p-4 bg-white rounded shadow hover:bg-gray-100 cursor-pointer"
          >
            <p><strong>Patient:</strong> {chat.patientName}</p>
            <p><strong>Started:</strong> {chat.createdAt?.toDate ? new Date(chat.createdAt.toDate()).toLocaleString() : '—'}</p>
          </div>
        ))
      )}
    </div>
  );
}
