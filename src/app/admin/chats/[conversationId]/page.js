'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  getDoc,
  getDocs,
  onSnapshot
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '@/data/firebase';

export default function ChatDetail() {
  const { conversationId } = useParams();
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [conversationMeta, setConversationMeta] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [adminUsers, setAdminUsers] = useState([]);

  const auth = getAuth();

  // ✅ Step 1: Load current user and admin list
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setCurrentUser(user);
    });

    const loadAdminUsers = async () => {
      const adminDocs = await getDocs(collection(db, 'admin'));
      const adminUIDs = adminDocs.docs.map(doc => doc.id); // UID from doc ID
      setAdminUsers(adminUIDs);
    };

    loadAdminUsers();
    return () => unsubscribe();
  }, []);

  // ✅ Step 2: Load messages and conversation metadata
  useEffect(() => {
    const unsubscribeMessages = onSnapshot(
      collection(db, `conversations/${conversationId}/messages`),
      (snapshot) => {
        const msgs = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        msgs.sort((a, b) => (a.timestamp?.seconds || 0) - (b.timestamp?.seconds || 0));
        setMessages(msgs);
      }
    );

    const loadConversationMeta = async () => {
      const convoRef = doc(db, 'conversations', conversationId);
      const convoSnap = await getDoc(convoRef);
      if (convoSnap.exists()) {
        setConversationMeta(convoSnap.data());
      }
    };

    loadConversationMeta();
    return () => unsubscribeMessages();
  }, [conversationId]);

  // ✅ Step 3: Get label based on role and ID
  const getSenderLabel = useCallback((senderId, role) => {
    if (role === 'admin') {
      return '🛠️ Admin';
    }

    if (conversationMeta) {
      if (senderId === conversationMeta.user1) {
        return `👤 ${conversationMeta.patientName || 'Patient'}`;
      }
      if (senderId === conversationMeta.user2) {
        return `👨‍⚕️ ${conversationMeta.doctorName || 'Doctor'}`;
      }
    }

    if (currentUser && senderId === currentUser.uid) {
      return `👤 You`;
    }

    return '❓ Unknown';
  }, [conversationMeta, currentUser]);

  // ✅ Step 4: Send message with role
  const sendMessage = async () => {
    if (!inputText.trim() || !currentUser) return;

    const role = adminUsers.includes(currentUser.uid) ? 'admin' : 'user';

    await addDoc(collection(db, `conversations/${conversationId}/messages`), {
      text: inputText,
      senderId: currentUser.uid,
      senderEmail: currentUser.email,
      timestamp: serverTimestamp(),
      role: role
    });

    setInputText('');
  };

  // ✅ Step 5: UI
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-xl font-bold mb-4">
        💬 Chat with {conversationMeta?.patientName || 'Patient'}
      </h2>

      <div className="space-y-3 mb-6 max-h-[60vh] overflow-y-auto">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`p-3 rounded-lg max-w-[80%] text-sm whitespace-pre-wrap ${
              msg.senderId === currentUser?.uid
                ? 'bg-blue-100 text-right ml-auto'
                : 'bg-gray-200 text-left mr-auto'
            }`}
          >
            <div className="flex justify-between items-baseline mb-1">
              <span className="text-xs font-semibold text-gray-600">
                {getSenderLabel(msg.senderId, msg.role)}
              </span>
              <span className="text-[10px] text-gray-500">
                {msg.timestamp?.seconds
                  ? new Date(msg.timestamp.seconds * 1000).toLocaleTimeString()
                  : ''}
              </span>
            </div>
            <p className="text-gray-800">{msg.text}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-2 sticky bottom-0 bg-white pt-4">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Type message..."
          className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={sendMessage}
          disabled={!inputText.trim()}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm disabled:bg-blue-400 disabled:cursor-not-allowed"
        >
          Send
        </button>
      </div>
    </div>
  );
}
