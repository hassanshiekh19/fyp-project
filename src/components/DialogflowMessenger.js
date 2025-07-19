'use client';
import { useEffect } from 'react';

const DialogflowMessenger = () => {
  useEffect(() => {
    if (window.dfMessengerInitialized) return;
    window.dfMessengerInitialized = true;

    const script = document.createElement('script');
    script.src = 'https://www.gstatic.com/dialogflow-console/fast/messenger/bootstrap.js?v=1';
    script.async = true;

    script.onload = () => {
      console.log('Dialogflow loaded successfully');

      setTimeout(() => {
        const messenger = document.querySelector('df-messenger');
        if (messenger?.shadowRoot) {
          const icon = messenger.shadowRoot.querySelector('.icon-button');
          if (icon) {
            icon.style.backgroundImage = `url('https://i.postimg.cc/zBHPmNVn/Indigo-Modern-AI-Company-Logo-512-x-512-px-1.png')`;
            icon.style.backgroundSize = 'contain';
          }
        }
      }, 1000);
    };

    document.body.appendChild(script);
  }, []);

  return (
    <>
      {/* 🌈 Messenger Styling */}
      <style jsx global>{`
        df-messenger {
          --df-messenger-button-titlebar-color: #667eea;
          --df-messenger-chat-background-color: #ffffff;
          --df-messenger-font-color: #333333;
          --df-messenger-user-message: #e0e7ff;
          --df-messenger-bot-message: #f4f4f5;
          --df-messenger-send-icon: #667eea;
          font-family: 'Poppins', sans-serif;
          z-index: 9999; /* Ensure it's above all content */
        }
      `}</style>

      <df-messenger
        chat-icon="https://i.postimg.cc/zBHPmNVn/Indigo-Modern-AI-Company-Logo-512-x-512-px-1.png"
        intent="WELCOME"
        chat-title="Derma-AI"
        agent-id="61cccb3a-0b80-4703-b2f9-34be94ab7b1c"
        language-code="en"
      ></df-messenger>
    </>
  );
};

export default DialogflowMessenger;
