// components/DialogflowMessenger.js
'use client'
import { useEffect } from 'react';

const DialogflowMessenger = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src =
      'https://www.gstatic.com/dialogflow-console/fast/messenger/bootstrap.js?v=1';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <df-messenger
      intent="WELCOME"
      chat-title="Derma-AI"
      agent-id="61cccb3a-0b80-4703-b2f9-34be94ab7b1c"
      language-code="en"
    ></df-messenger>
  );
};

export default DialogflowMessenger;
