// components/DialogflowMessenger.js
'use client'
import { useEffect } from 'react';

const DialogflowMessenger = () => {
  useEffect(() => {
    // Skip if already initialized
    if (window.dfMessengerInitialized) return;
    window.dfMessengerInitialized = true;

    const script = document.createElement('script');
    script.src = 'https://www.gstatic.com/dialogflow-console/fast/messenger/bootstrap.js?v=1';
    script.async = true;
    
    script.onload = () => {
      console.log('Dialogflow loaded successfully');
      // Ensure logo visibility
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

    return () => {
      // Keep the script loaded but clean up if needed
    };
  }, []);

  return (
    <df-messenger
      chat-icon="https://i.postimg.cc/zBHPmNVn/Indigo-Modern-AI-Company-Logo-512-x-512-px-1.png"
      intent="WELCOME"
      chat-title="Derma-AI"
      agent-id="61cccb3a-0b80-4703-b2f9-34be94ab7b1c"
      language-code="en"
    ></df-messenger>
  );
};

export default DialogflowMessenger;