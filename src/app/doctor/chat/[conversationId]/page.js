'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  collection,
  getDocs,
  addDoc,
  serverTimestamp,
  doc,
  getDoc,
  onSnapshot,
} from 'firebase/firestore';
import { db, auth } from '@/data/firebase';
import { onAuthStateChanged } from 'firebase/auth';

export default function DoctorChatDetail() {
  const { conversationId } = useParams();
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [conversationMeta, setConversationMeta] = useState({});
  const [currentUser, setCurrentUser] = useState(null);
  const [adminUIDs, setAdminUIDs] = useState([]);

  // ✅ Load current user and admin UIDs
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        const adminDocs = await getDocs(collection(db, 'admin'));
        const adminList = adminDocs.docs.map((doc) => doc.id);
        setAdminUIDs(adminList);
      }
    });

    return () => unsubscribe();
  }, []);

  // ✅ Load conversation and real-time messages
  useEffect(() => {
    const ref = doc(db, 'conversations', conversationId);
    getDoc(ref).then((snap) => {
      if (snap.exists()) {
        setConversationMeta(snap.data());
      }
    });

    const unsubscribeMessages = onSnapshot(
      collection(db, `conversations/${conversationId}/messages`),
      (snapshot) => {
        const msgs = snapshot.docs.map((doc) => doc.data());
        msgs.sort((a, b) => a.timestamp?.seconds - b.timestamp?.seconds);
        setMessages(msgs);
      }
    );

    return () => unsubscribeMessages();
  }, [conversationId]);

  // ✅ Send message with role
  const sendMessage = async () => {
    if (!inputText.trim() || !currentUser) return;

    const role = adminUIDs.includes(currentUser.uid)
      ? 'admin'
      : currentUser.uid === conversationMeta.user2
      ? 'doctor'
      : 'user';

    await addDoc(collection(db, `conversations/${conversationId}/messages`), {
      text: inputText.trim(),
      senderId: currentUser.uid,
      senderEmail: currentUser.email,
      timestamp: serverTimestamp(),
      role: role,
      emailSent: true,
    });

    const receiverEmail = role === 'doctor'
  ? conversationMeta.patientEmail
  : conversationMeta.doctorEmail;

const receiverName = role === 'doctor'
  ? conversationMeta.patientName
  : conversationMeta.doctorName;

await fetch('/api/message-email', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    senderName: currentUser.displayName || 'User',
    receiverEmail,
    receiverName,
    text: inputText.trim(),
  }),
});

    setInputText('');
  };

  // ✅ Role-based label
  const getSenderLabel = (msg) => {
    if (msg.role === 'admin') return '🛠️ Admin';
    if (msg.senderId === conversationMeta.user1) return `👤 ${conversationMeta.patientName || 'User'}`;
    if (msg.senderId === conversationMeta.user2) return `👨‍⚕️ ${conversationMeta.doctorName || 'Doctor'}`;
    if (msg.senderId === currentUser?.uid) return '👨‍⚕️ You';
    return '❓ Unknown';
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp?.seconds) return '';
    return new Date(timestamp.seconds * 1000).toLocaleString();
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">
        💬 Chat with {conversationMeta.patientName || 'Patient'}
      </h2>

      <div className="space-y-3 mb-6 max-h-[60vh] overflow-y-auto">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-3 rounded-lg max-w-xl text-sm whitespace-pre-wrap ${
              msg.senderId === currentUser?.uid
                ? 'bg-blue-100 text-right ml-auto'
                : 'bg-gray-200 text-left mr-auto'
            }`}
          >
            <p className="text-xs font-semibold text-gray-600 mb-1">
              {getSenderLabel(msg)}
            </p>
            <p>{msg.text}</p>
            <p className="text-[11px] text-gray-500 mt-1">
              {formatTimestamp(msg.timestamp)}
            </p>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type message..."
          className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm"
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
        >
          Send
        </button>
      </div>
    </div>
  );
}
