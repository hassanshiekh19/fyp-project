"use client";
import { useState, useRef } from 'react';
import { Upload, Camera, RotateCcw, Zap, Shield, AlertTriangle, CheckCircle, Star, Sparkles, Calendar } from 'lucide-react';
import { useRouter } from 'next/navigation';


const SkinAnalysisUpload = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const fileInputRef = useRef(null);
  const router = useRouter();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file);
      setAnalysisResult(null);
      const reader = new FileReader();
      reader.onload = () => setPreviewUrl(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => fileInputRef.current.click();

  const resetAnalysis = () => {
    setSelectedImage(null);
    setPreviewUrl(null);
    setAnalysisResult(null);
  };

  const getTreatmentData = (condition) => {
    const conditionData = {
      'Acne': {
        recommendations: [
          "Use a gentle cleanser twice daily.",
          "Avoid touching or popping pimples.",
          "Use salicylic acid or benzoyl peroxide."
        ],
        products: [
          "CeraVe Foaming Cleanser",
          "The Ordinary Niacinamide 10% + Zinc"
        ]
      },
      'Dermatographia': {
        recommendations: [
          "Avoid scratching the skin.",
          "Apply antihistamines if needed.",
          "Keep skin moisturized."
        ],
        products: [
          "Aveeno Skin Relief Lotion"
        ]
      },
      'Pigmented Benign Keratosis': {
        recommendations: [
          "Monitor for changes in the spot.",
          "Apply SPF daily.",
          "Avoid sun exposure."
        ],
        products: [
          "La Roche-Posay SPF 50+"
        ]
      },
      'Melanoma': {
        recommendations: [
          "Serious condition. Visit a dermatologist immediately."
        ],
        products: []
      },
      'Basal Cell Carcinoma': {
        recommendations: [
          "Skin cancer type. Get professional medical care."
        ],
        products: []
      },
      'Actinic Keratosis': {
        recommendations: [
          "Precancerous. Dermatologist consultation recommended."
        ],
        products: []
      },
      'Nevus': {
        recommendations: [
          "Monitor mole changes over time.",
          "Use sun protection."
        ],
        products: [
          "Neutrogena Ultra Sheer SPF 60"
        ]
      },
      'Melanocytic Nevus': {
        recommendations: [
          "Benign, but monitor for changes.",
          "Protect from sun."
        ],
        products: []
      }
    };

    return conditionData[condition] || {
      recommendations: ["No specific treatment found. Please consult a specialist."],
      products: []
    };
  };

  const analyzeImage = async () => {
    if (!selectedImage) return;
    setIsAnalyzing(true);
    const formData = new FormData();
    formData.append('image', selectedImage);

    try {
      const response = await fetch('https://skinapimodel-production.up.railway.app/predict', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      const confidence = parseFloat(data.confidence);
      const severity = confidence > 75 ? "High" : confidence > 50 ? "Moderate" : "Low";

      const treatmentData = getTreatmentData(data.prediction);

      setAnalysisResult({
        condition: data.prediction,
        confidence: confidence.toFixed(2),
        severity,
        ...treatmentData
      });
    } catch (error) {
      console.error('Error:', error);
      setAnalysisResult({
        condition: 'Error',
        confidence: 0,
        severity: 'N/A',
        recommendations: ['Failed to analyze image. Try again later.'],
        products: []
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getSeverityConfig = (severity) => {
    const configs = {
      High: { 
        color: 'bg-gradient-to-r from-red-500 to-pink-500 text-white',
        icon: AlertTriangle,
        glow: 'shadow-red-200'
      },
      Moderate: { 
        color: 'bg-gradient-to-r from-amber-400 to-orange-500 text-white',
        icon: Shield,
        glow: 'shadow-amber-200'
      },
      Low: { 
        color: 'bg-gradient-to-r from-emerald-400 to-green-500 text-white',
        icon: CheckCircle,
        glow: 'shadow-emerald-200'
      },
      'N/A': { 
        color: 'bg-gradient-to-r from-gray-400 to-gray-500 text-white',
        icon: Shield,
        glow: 'shadow-gray-200'
      }
    };
    return configs[severity] || configs['N/A'];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <div className="pt-16 pb-8 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Sparkles size={16} />
            AI-Powered Analysis
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Advanced Skin Analysis
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get instant, AI-powered skin condition analysis with personalized treatment recommendations
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 pb-16">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm shadow-2xl rounded-3xl border border-white/20 overflow-hidden">
            <div className="grid lg:grid-cols-2 gap-0">
              {/* Left Side - Upload */}
              <div className="p-8 lg:p-12">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <Camera className="text-indigo-600" size={24} />
                    Upload Your Image
                  </h2>
                  <p className="text-gray-600">
                    Take or upload a clear photo of the skin area you'd like analyzed
                  </p>
                </div>

                {/* Upload Area */}
                <div
                  onClick={triggerFileInput}
                  className="group relative cursor-pointer border-2 border-dashed border-indigo-200 bg-gradient-to-br from-indigo-50 to-purple-50 h-80 rounded-2xl flex flex-col justify-center items-center overflow-hidden hover:border-indigo-300 hover:bg-gradient-to-br hover:from-indigo-100 hover:to-purple-100 transition-all duration-300"
                >
                  {previewUrl ? (
                    <>
                      <img 
                        src={previewUrl} 
                        alt="Preview" 
                        className="object-cover h-full w-full rounded-2xl group-hover:scale-105 transition-transform duration-300" 
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 rounded-2xl flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 rounded-full p-3">
                          <Upload size={24} className="text-indigo-600" />
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center">
                      <div className="bg-indigo-100 rounded-full p-6 mx-auto mb-4 group-hover:bg-indigo-200 transition-colors duration-300">
                        <Upload size={32} className="text-indigo-600" />
                      </div>
                      <p className="text-lg font-semibold text-indigo-700 mb-2">Click to Upload Image</p>
                      <p className="text-sm text-gray-500">PNG, JPG up to 10MB</p>
                    </div>
                  )}
                  <input 
                    ref={fileInputRef} 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageChange} 
                    className="hidden" 
                  />
                </div>

                {/* Action Buttons */}
                <div className="mt-8 space-y-4">
                  <div className="flex gap-4">
                    <button
                      onClick={resetAnalysis}
                      className="flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-all duration-200 hover:scale-105"
                    >
                      <RotateCcw size={18} />
                      Reset
                    </button>
                    <button
                      onClick={analyzeImage}
                      disabled={!selectedImage || isAnalyzing}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold transition-all duration-200 hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                      {isAnalyzing ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Zap size={18} />
                          Analyze Image
                        </>
                      )}
                    </button>
                  </div>
                  
                  {/* Book Appointment Button - Only show when image is uploaded */}
                  {analysisResult && (
  <button
    onClick={() => router.push('/book-appointment')}
    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold transition-all duration-200 hover:scale-105 hover:shadow-lg border-2 border-emerald-200"
  >
    <Calendar size={18} />
    Book Appointment with Dermatologist
  </button>
)}

                
                </div>
              </div>

              {/* Right Side - Results */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-8 lg:p-12">
                <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <Star className="text-indigo-600" size={24} />
                  Analysis Results
                </h3>
                
                {!analysisResult ? (
                  <div className="text-center py-16">
                    <div className="bg-gray-200 rounded-full p-8 mx-auto mb-4 w-fit">
                      <Zap size={48} className="text-gray-400" />
                    </div>
                    <p className="text-gray-500 text-lg">Upload an image to see your analysis results</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Condition Card */}
                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <p className="text-sm font-medium text-gray-500 mb-1">Detected Condition</p>
                          <p className="text-2xl font-bold text-gray-800">{analysisResult.condition}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-500 mb-1">Confidence</p>
                          <p className="text-xl font-bold text-indigo-600">{analysisResult.confidence}%</p>
                        </div>
                      </div>
                      
                      {/* Severity Badge */}
                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-500 mb-2">Severity Level</p>
                        {(() => {
                          const severityConfig = getSeverityConfig(analysisResult.severity);
                          const IconComponent = severityConfig.icon;
                          return (
                            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm ${severityConfig.color} shadow-lg ${severityConfig.glow}`}>
                              <IconComponent size={16} />
                              {analysisResult.severity}
                            </div>
                          );
                        })()}
                      </div>

                      {/* Confidence Bar */}
                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-gray-500">Confidence Level</span>
                          <span className="text-sm font-bold text-gray-700">{analysisResult.confidence}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-1000"
                            style={{ width: `${analysisResult.confidence}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    {/* Recommendations */}
                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                      <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <Shield size={20} className="text-indigo-600" />
                        Treatment Recommendations
                      </h4>
                      <div className="space-y-3">
                        {analysisResult.recommendations.map((rec, i) => (
                          <div key={i} className="flex items-start gap-3 p-3 bg-indigo-50 rounded-lg">
                            <CheckCircle size={16} className="text-indigo-600 mt-0.5 flex-shrink-0" />
                            <p className="text-gray-700 text-sm">{rec}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Products */}
                    {analysisResult.products.length > 0 && (
                      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                        <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                          <Star size={20} className="text-indigo-600" />
                          Recommended Products
                        </h4>
                        <div className="space-y-3">
                          {analysisResult.products.map((product, i) => (
                            <div key={i} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                              <div className="bg-green-100 rounded-full p-2">
                                <Star size={14} className="text-green-600" />
                              </div>
                              <p className="text-gray-700 text-sm font-medium">{product}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Disclaimer */}
                    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
                      <div className="flex items-start gap-3">
                        <AlertTriangle size={20} className="text-amber-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-amber-800 mb-1">Medical Disclaimer</p>
                          <p className="text-xs text-amber-700">This analysis is for informational purposes only. Please consult a healthcare professional for proper diagnosis and treatment.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkinAnalysisUpload;