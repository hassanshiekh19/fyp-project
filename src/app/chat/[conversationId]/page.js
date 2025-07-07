'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  doc,
  getDoc,
  getDocs
} from 'firebase/firestore';
import { db } from '@/data/firebase';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

export default function ChatPage() {
  const { conversationId } = useParams();
  const router = useRouter();
  const auth = getAuth();

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [doctorName, setDoctorName] = useState('');
  const [patientName, setPatientName] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [adminUIDs, setAdminUIDs] = useState([]);
  const [conversationMeta, setConversationMeta] = useState({});

  // ✅ Get logged-in user and admin UIDs
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        const adminDocs = await getDocs(collection(db, 'admin'));
        const uids = adminDocs.docs.map(doc => doc.id);
        setAdminUIDs(uids);
      }
    });

    return () => unsubscribe();
  }, []);

  // ✅ Fetch messages
  useEffect(() => {
    if (!conversationId) return;

    const q = query(
      collection(db, 'conversations', conversationId, 'messages'),
      orderBy('timestamp')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => doc.data());
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [conversationId]);

  // ✅ Fetch conversation meta
  useEffect(() => {
    const fetchConversation = async () => {
      if (!conversationId) return;
      const convoRef = doc(db, 'conversations', conversationId);
      const convoSnap = await getDoc(convoRef);
      if (convoSnap.exists()) {
        const data = convoSnap.data();
        setConversationMeta(data);
        setDoctorName(data.doctorName || 'Doctor');
        setPatientName(data.patientName || 'You');
      }
    };
    fetchConversation();
  }, [conversationId]);

  // ✅ Send message with role
  const sendMessage = async () => {
    if (!input.trim() || !currentUser) return;

    const role = adminUIDs.includes(currentUser.uid)
      ? 'admin'
      : currentUser.uid === conversationMeta.user1
      ? 'user'
      : 'doctor';

    await addDoc(collection(db, 'conversations', conversationId, 'messages'), {
      text: input.trim(),
      senderId: currentUser.uid,
      timestamp: serverTimestamp(),
      role: role,
    });

    setInput('');
  };

  // ✅ Label helper
  const getSenderLabel = (msg) => {
    if (msg.role === 'admin') return '🛠️ Admin';
    if (msg.senderId === conversationMeta.user2) return `👨‍⚕️ ${doctorName}`;
    if (msg.senderId === conversationMeta.user1) return `👤 ${patientName}`;
    if (msg.senderId === currentUser?.uid) return `👤 You`;
    return '❓ Unknown';
  };

  return (
    <div className="flex flex-col min-h-screen pt-24 px-4 max-w-3xl mx-auto">
      {/* ✅ Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Chat with {doctorName}</h2>
        <button
          onClick={() => router.push('/team')}
          className="text-blue-600 hover:underline"
        >
          ← Back to Doctors
        </button>
      </div>

      {/* ✅ Messages Area */}
      <div
        className="flex-1 overflow-y-auto border rounded bg-gray-50 p-4 mb-4"
        style={{ maxHeight: '60vh' }}
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`mb-2 p-2 rounded-md max-w-xs ${
              msg.senderId === currentUser?.uid
                ? 'bg-blue-500 text-white ml-auto'
                : 'bg-gray-300 text-black'
            }`}
          >
            <p className="text-[11px] font-semibold text-gray-700 mb-1">
              {getSenderLabel(msg)}
            </p>
            <p>{msg.text}</p>
          </div>
        ))}
      </div>

      {/* ✅ Input Area */}
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 p-2 border rounded"
          placeholder="Type a message..."
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Send
        </button>
      </div>
    </div>
  );
}
