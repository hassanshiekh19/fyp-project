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

  const analyzeImage = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);

    const formData = new FormData();
    formData.append('image', selectedImage);

    try {
      const response = await fetch('https://skinapimodel-production.up.railway.app/predict', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      const confidence = parseFloat(data.confidence);
      let severity = 'Low';
      if (confidence > 75) severity = 'High';
      else if (confidence > 50) severity = 'Moderate';

      setAnalysisResult({
        condition: data.prediction,
        confidence: confidence.toFixed(2),
        recommendations: [
          "Please consult a dermatologist for a professional opinion.",
          "Monitor symptoms regularly and avoid self-treatment."
        ],
        severity: severity,
      });
    } catch (error) {
      console.error('Error analyzing image:', error);
      setAnalysisResult({
        condition: 'Error',
        confidence: 0,
        recommendations: ['Failed to analyze image. Please try again later.'],
        severity: 'N/A',
      });
    } finally {
      setIsAnalyzing(false);
    }
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
                    <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
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
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
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
                  <p className="text-gray-500">Upload an image to see the analysis results</p>
                </div>
              )}
              {selectedImage && !analysisResult && !isAnalyzing && (
                <div className="flex flex-col items-center justify-center h-64 text-center">
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
                      <div className="bg-yellow-400 h-2.5 rounded-full" style={{ width: analysisResult.confidence + '%' }}></div>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{analysisResult.severity}</p>
                  </div>

                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <h4 className="font-medium text-gray-700 mb-2">Recommendations</h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-600">
                      {analysisResult.recommendations.map((rec, idx) => (
                        <li key={idx}>{rec}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SkinAnalysisUpload;
