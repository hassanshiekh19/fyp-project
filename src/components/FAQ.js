"use client"; 
import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 py-4 transition-all">
      <button
        className="flex justify-between items-center w-full text-left font-medium text-gray-900 hover:text-blue-600 focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-lg font-semibold">{question}</span>
        {isOpen ? (
          <ChevronUp size={24} className="text-blue-600" />
        ) : (
          <ChevronDown size={24} className="text-gray-600" />
        )}
      </button>
      <div
        className={`mt-4 transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
        } overflow-hidden`}
      >
        <div className="text-gray-700 text-sm">{answer}</div>
      </div>
    </div>
  );
};

const FAQSection = () => {
  const faqs = [
    {
      question: "How does the skin disease detection work?",
      answer: (
        <p>
          Our system uses advanced machine learning algorithms that have been trained on thousands of
          dermatological images. When you upload an image, our AI analyzes visual patterns, textures, and
          colors to identify potential skin conditions. The technology provides a preliminary assessment
          with confidence levels but should not replace professional medical diagnosis.
        </p>
      )
    },
    {
      question: "What types of skin conditions can the system detect?",
      answer: (
        <p>
          Our system can detect common skin conditions including but not limited to:
          acne, eczema, psoriasis, rosacea, melanoma, basal cell carcinoma, ringworm,
          contact dermatitis, and several other dermatological issues. The accuracy varies
          by condition, and we continuously improve our detection capabilities.
        </p>
      )
    },
    {
      question: "How should I take and upload photos of my skin condition?",
      answer: (
        <div>
          <p>For the best results, please follow these guidelines:</p>
          <ul className="list-disc pl-5 mt-2">
            <li>Ensure good lighting (natural daylight works best)</li>
            <li>Take clear, in-focus images from multiple angles if possible</li>
            <li>Include a reference object for scale when appropriate</li>
            <li>Avoid using filters or editing the photos</li>
            <li>Images should be in JPG, PNG, or HEIC format and under 10MB</li>
          </ul>
          <p className="mt-2">
            To upload, simply click the "Upload Image" button on the diagnosis page and select the file from your device.
          </p>
        </div>
      )
    },
    {
      question: "Is my medical data and images kept private?",
      answer: (
        <p>
          Your privacy is our top priority. All uploaded images and personal information are encrypted and
          stored securely in compliance with healthcare privacy regulations. We do not share your data with
          third parties without explicit consent. You can request deletion of your data at any time through
          your account settings. For more details, please review our Privacy Policy.
        </p>
      )
    },
    {
      question: "How accurate is the skin condition detection?",
      answer: (
        <p>
          Our system achieves an overall accuracy rate of approximately 85-90% for common conditions,
          though this varies by specific condition. Each detection includes a confidence score to
          indicate reliability. Remember that this tool is designed to assist with preliminary
          assessment only and should not replace professional medical consultation.
        </p>
      )
    },
    {
      question: "Does the app provide treatment suggestions?",
      answer: (
        <p>
          Yes, for identified conditions, we provide general care recommendations and over-the-counter
          treatment options based on clinical guidelines. However, these suggestions are informational
          only and not personalized medical advice. Always consult with a healthcare provider before
          starting any treatment regimen, especially for severe, persistent, or concerning skin conditions.
        </p>
      )
    },
    {
      question: "Can I track the progress of my skin condition over time?",
      answer: (
        <p>
          Yes, our application allows you to save images to your secure profile and track changes
          in your skin condition over time. This feature helps you and your healthcare provider
          monitor improvements or deterioration, which can be valuable for assessing treatment effectiveness.
        </p>
      )
    },
    {
      question: "What should I do if the system can't identify my skin condition?",
      answer: (
        <p>
          If our system cannot identify your condition or returns a low confidence score, we recommend
          consulting with a dermatologist or healthcare provider. Some conditions may have similar
          appearances or require professional examination. You can use our telemedicine feature to
          connect with a qualified dermatologist for remote consultation.
        </p>
      )
    },
    {
      question: "Is this service a substitute for seeing a doctor?",
      answer: (
        <p>
          <strong>No, this service is not a substitute for professional medical care.</strong> Our
          tool is designed to provide preliminary information and assist with early detection, but
          it has limitations. Always consult with qualified healthcare professionals for proper
          diagnosis, especially for persistent, painful, rapidly changing, or concerning skin conditions.
        </p>
      )
    }
  ];

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">Frequently Asked Questions</h2>
      <div className="bg-white rounded-lg shadow-lg p-6">
        {faqs.map((faq, index) => (
          <FAQItem key={index} question={faq.question} answer={faq.answer} />
        ))}
      </div>
    </div>
  );
};

export default FAQSection;
