// components/SkinAnalysisUpload.js
"use client";
import { useState, useRef } from 'react';

const SkinAnalysisUpload = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file);
      setAnalysisResult(null);
      
      // Create a preview URL
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setPreviewUrl(fileReader.result);
      };
      fileReader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        setSelectedImage(file);
        setAnalysisResult(null);
        
        // Create a preview URL
        const fileReader = new FileReader();
        fileReader.onload = () => {
          setPreviewUrl(fileReader.result);
        };
        fileReader.readAsDataURL(file);
      }
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const analyzeImage = () => {
    if (!selectedImage) return;
    
    setIsAnalyzing(true);
    
    // Simulate analysis with a timeout
    // In a real application, you would send the image to your backend API
    setTimeout(() => {
      // Mock analysis result
      setAnalysisResult({
        condition: "Potential Eczema",
        confidence: 87,
        recommendations: [
          "Consider using moisturizers regularly",
          "Avoid harsh soaps and detergents",
          "Consult with a dermatologist for proper diagnosis"
        ],
        severity: "Mild to Moderate"
      });
      setIsAnalyzing(false);
    }, 2000);
  };

  const resetAnalysis = () => {
    setSelectedImage(null);
    setPreviewUrl(null);
    setAnalysisResult(null);
  };

  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 to-cyan-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Skin Condition Analysis</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Upload a clear image of your skin concern and our AI system will analyze it, providing insights and potential next steps.
          </p>
        </div>

        <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/2 p-8">
              <div 
                className={`border-2 border-dashed rounded-lg h-80 flex flex-col items-center justify-center cursor-pointer
                  ${selectedImage ? 'border-blue-300 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}`}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={triggerFileInput}
              >
                <input 
                  type="file" 
                  ref={fileInputRef}
                  className="hidden" 
                  accept="image/*" 
                  onChange={handleImageChange}
                />
                
                {previewUrl ? (
                  <img 
                    src={previewUrl} 
                    alt="Skin condition preview" 
                    className="max-h-full max-w-full object-contain rounded"
                  />
                ) : (
                  <>
                    <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                    <p className="text-gray-500 text-center mb-2">Drag and drop your image here</p>
                    <p className="text-gray-400 text-sm text-center">or click to browse files</p>
                  </>
                )}
              </div>
              
              <div className="flex justify-between mt-6">
                <button 
                  onClick={resetAnalysis}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
                >
                  Reset
                </button>
                
                <button 
                  onClick={analyzeImage}
                  disabled={!selectedImage || isAnalyzing}
                  className={`px-6 py-2 rounded font-medium text-white transition
                    ${!selectedImage || isAnalyzing 
                      ? 'bg-blue-300 cursor-not-allowed' 
                      : 'bg-blue-600 hover:bg-blue-700'}`}
                >
                  {isAnalyzing ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Analyzing...
                    </span>
                  ) : 'Analyze Image'}
                </button>
              </div>
            </div>
            
            <div className="md:w-1/2 bg-gray-50 p-8">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Analysis Results</h3>
              
              {!selectedImage && !analysisResult && (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                  </svg>
                  <p className="text-gray-500">Upload an image to see the analysis results</p>
                </div>
              )}
              
              {selectedImage && !analysisResult && !isAnalyzing && (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <svg className="w-16 h-16 text-blue-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                  </svg>
                  <p className="text-gray-600">Image ready for analysis</p>
                  <p className="text-gray-500 text-sm mt-2">Click the Analyze button to proceed</p>
                </div>
              )}
              
              {isAnalyzing && (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <div className="w-16 h-16 border-4 border-blue-400 border-t-blue-600 rounded-full animate-spin mb-4"></div>
                  <p className="text-gray-600">Analyzing your image...</p>
                  <p className="text-gray-500 text-sm mt-2">This may take a few moments</p>
                </div>
              )}
              
              {analysisResult && (
                <div className="space-y-6">
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium text-gray-700">Potential Condition</h4>
                      <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                        {analysisResult.confidence}% Confidence
                      </span>
                    </div>
                    <p className="text-lg font-semibold text-gray-900 mt-1">{analysisResult.condition}</p>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <h4 className="font-medium text-gray-700 mb-2">Severity Assessment</h4>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-yellow-400 h-2.5 rounded-full" style={{ width: '65%' }}></div>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">{analysisResult.severity}</p>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <h4 className="font-medium text-gray-700 mb-2">Recommendations</h4>
                    <ul className="space-y-2">
                      {analysisResult.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start">
                          <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                          </svg>
                          <span className="text-gray-600">{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="text-center mt-6">
                    <button className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
                      Book Consultation
                    </button>
                    <p className="text-sm text-gray-500 mt-2">
                      Please note: This is an AI-generated assessment and does not replace professional medical advice.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">How It Works</h3>
          <div className="flex flex-col md:flex-row justify-center gap-8 mt-6">
            <div className="bg-white p-6 rounded-lg shadow-sm max-w-xs mx-auto md:mx-0">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
              </div>
              <h4 className="font-medium text-gray-800 mb-2">1. Upload Image</h4>
              <p className="text-gray-600 text-sm">Take a clear photo of your skin concern and upload it to our secure system.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm max-w-xs mx-auto md:mx-0">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                </svg>
              </div>
              <h4 className="font-medium text-gray-800 mb-2">2. AI Analysis</h4>
              <p className="text-gray-600 text-sm">Our advanced AI technology analyzes the image and identifies potential skin conditions.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm max-w-xs mx-auto md:mx-0">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
              </div>
              <h4 className="font-medium text-gray-800 mb-2">3. Get Results</h4>
              <p className="text-gray-600 text-sm">Receive an assessment with recommendations and book a consultation if needed.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SkinAnalysisUpload;