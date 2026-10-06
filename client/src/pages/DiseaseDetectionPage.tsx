import React, { useState, useEffect } from 'react';
import {
  Bug,
  Upload,
  Sparkles,
  AlertTriangle,
  CheckCircle,
  ShieldAlert,
  Camera,
  Layers,
  History,
  Info,
} from 'lucide-react';
import { diseaseService } from '../services/diseaseService';
import { DiseaseReport } from '../types';

export const DiseaseDetectionPage: React.FC = () => {
  const [selectedCrop, setSelectedCrop] = useState('Cotton');
  const [previewImage, setPreviewImage] = useState<string>(
    'https://images.unsplash.com/photo-1599818816949-a29d5b4e7d69?auto=format&fit=crop&q=80&w=600'
  );
  const [isScanning, setIsScanning] = useState(false);
  const [report, setReport] = useState<DiseaseReport | null>(null);
  const [history, setHistory] = useState<DiseaseReport[]>([]);

  useEffect(() => {
    diseaseService.getMyDiseaseHistory().then((res) => {
      if (res.success && res.data) {
        setHistory(res.data);
        if (res.data.length > 0 && !report) {
          setReport(res.data[0]);
        }
      }
    }).catch(() => {});
  }, []);

  const handleAnalyze = async () => {
    setIsScanning(true);
    setReport(null);

    try {
      // Simulate real-time neural scan delay for realistic AI scanner experience
      await new Promise((resolve) => setTimeout(resolve, 1400));
      const res = await diseaseService.analyzeCropDisease({
        cropName: selectedCrop,
        imageUrl: previewImage,
      });

      if (res.success && res.data) {
        setReport(res.data);
        setHistory((prev) => [res.data, ...prev]);
      }
    } catch (err: any) {
      alert('Error during disease diagnosis simulation');
    } finally {
      setIsScanning(false);
    }
  };

  const sampleImages: Record<string, string> = {
    Cotton: 'https://images.unsplash.com/photo-1599818816949-a29d5b4e7d69?auto=format&fit=crop&q=80&w=600',
    Wheat: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=600',
    Tomato: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb22510?auto=format&fit=crop&q=80&w=600',
  };

  const handleCropChange = (crop: string) => {
    setSelectedCrop(crop);
    if (sampleImages[crop]) {
      setPreviewImage(sampleImages[crop]);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white rounded-3xl p-6 border border-gray-100 shadow-soft">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🌿</span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Crop Doctor
            </h1>
            <span className="px-2.5 py-0.5 bg-amber-100 text-amber-900 text-xs font-bold rounded-full border border-amber-300">
              Demo AI Analysis
            </span>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Upload leaf photos to simulate neural network pathogen diagnosis and recommended treatment regimens
          </p>
        </div>

        {/* Clear Disclaimer */}
        <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs">
          <Info className="w-4 h-4 flex-shrink-0" />
          <span>Demo AI simulation for educational demonstrations.</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Image Upload & Trigger */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-soft space-y-5">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
              Diagnose Crop Leaves
            </h3>

            {/* Crop Selector */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase">
                Select Crop Cultivar
              </label>
              <div className="grid grid-cols-3 gap-2 mt-1.5">
                {['Cotton', 'Wheat', 'Tomato'].map((crop) => (
                  <button
                    key={crop}
                    type="button"
                    onClick={() => handleCropChange(crop)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                      selectedCrop === crop
                        ? 'bg-primary text-white shadow-sm'
                        : 'bg-cream text-gray-700 border border-gray-200 hover:bg-light-green/40'
                    }`}
                  >
                    {crop}
                  </button>
                ))}
              </div>
            </div>

            {/* Image Preview Box */}
            <div className="relative aspect-video rounded-2xl overflow-hidden border-2 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center">
              <img
                src={previewImage}
                alt="Selected crop leaf"
                className="w-full h-full object-cover"
              />

              {isScanning && (
                <div className="absolute inset-0 bg-primary/40 backdrop-blur-xs flex flex-col items-center justify-center text-white">
                  <div className="w-12 h-12 rounded-full border-4 border-white border-t-transparent animate-spin mb-2" />
                  <p className="text-xs font-bold tracking-wider uppercase animate-pulse">
                    AI Scanning Neural Features...
                  </p>
                </div>
              )}

              <div className="absolute bottom-2 right-2 flex items-center space-x-1.5 bg-black/60 px-2.5 py-1 rounded-lg text-white text-[11px]">
                <Camera className="w-3.5 h-3.5" />
                <span>Leaf Sample</span>
              </div>
            </div>

            {/* Upload Button */}
            <div className="flex gap-2">
              <label className="flex-1 py-2.5 px-4 rounded-xl border border-gray-200 bg-cream hover:bg-gray-100 text-xs font-bold text-gray-700 text-center cursor-pointer transition-colors flex items-center justify-center space-x-1.5">
                <Upload className="w-4 h-4 text-gray-500" />
                <span>Upload Crop Image</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const url = URL.createObjectURL(file);
                      setPreviewImage(url);
                    }
                  }}
                />
              </label>

              <button
                type="button"
                onClick={handleAnalyze}
                disabled={isScanning}
                className="flex-1 py-2.5 px-4 rounded-xl bg-primary hover:bg-primary-dark text-white text-xs font-bold transition-all shadow-md shadow-primary/20 flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4 text-secondary" />
                <span>{isScanning ? 'Analyzing...' : 'Analyze Crop'}</span>
              </button>
            </div>
          </div>

          {/* Past History */}
          {history.length > 0 && (
            <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-soft">
              <div className="flex items-center space-x-2 mb-3">
                <History className="w-4 h-4 text-gray-400" />
                <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wide">
                  Recent Diagnoses
                </h4>
              </div>
              <div className="space-y-2">
                {history.slice(0, 3).map((h, i) => (
                  <div
                    key={h._id || i}
                    onClick={() => setReport(h)}
                    className="p-2.5 rounded-xl border border-gray-100 hover:bg-light-green/30 cursor-pointer flex items-center justify-between text-xs transition-colors"
                  >
                    <div>
                      <p className="font-bold text-gray-900">{h.cropName} - {h.diseaseName}</p>
                      <p className="text-[11px] text-gray-400">Confidence: {h.confidence}% • {h.severity}</p>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-800">
                      Demo AI
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: AI Analysis Result */}
        <div className="lg:col-span-7">
          {report ? (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-soft space-y-6">
              {/* Demo AI Analysis Badge Banner */}
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start space-x-3">
                <ShieldAlert className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                    Demo AI Analysis
                  </h4>
                  <p className="text-xs text-amber-800 mt-0.5 leading-relaxed">
                    This diagnostic report is generated via the Krishi Digital demonstration AI interface. Always verify with your local Krishi Vigyan Kendra (KVK) agronomist prior to large-scale chemical application.
                  </p>
                </div>
              </div>

              {/* Diagnosis Primary Card */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-cream border border-gray-100">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                    Detected Disease
                  </span>
                  <h3 className="text-2xl font-black text-gray-900 mt-0.5">
                    {report.diseaseName}
                  </h3>
                  {report.scientificName && (
                    <p className="text-xs italic text-gray-500">{report.scientificName}</p>
                  )}
                </div>

                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                      Confidence
                    </span>
                    <p className="text-xl font-black text-primary">{report.confidence}%</p>
                  </div>
                  <div className="h-8 w-px bg-gray-200" />
                  <div className="text-right">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                      Severity
                    </span>
                    <p className="text-xs font-extrabold px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 mt-0.5">
                      {report.severity}
                    </p>
                  </div>
                </div>
              </div>

              {/* Recommendations */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-3 flex items-center space-x-1.5">
                  <CheckCircle className="w-4 h-4 text-secondary" />
                  <span>Immediate Cultural & Sanitation Measures</span>
                </h4>
                <div className="space-y-2">
                  {report.recommendations.map((rec, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl bg-white border border-gray-100 flex items-start space-x-2.5 text-xs text-gray-700 shadow-xs"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-secondary flex-shrink-0 mt-1.5" />
                      <span>{rec}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Chemical & Organic Control */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {report.chemicalControl && report.chemicalControl.length > 0 && (
                  <div className="p-4 rounded-2xl bg-cream border border-gray-100">
                    <h5 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">
                      🧪 Chemical Control
                    </h5>
                    <ul className="space-y-1.5 text-xs text-gray-600">
                      {report.chemicalControl.map((c, i) => (
                        <li key={i} className="leading-snug">• {c}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {report.organicControl && report.organicControl.length > 0 && (
                  <div className="p-4 rounded-2xl bg-light-green/30 border border-secondary/20">
                    <h5 className="text-xs font-bold text-primary uppercase tracking-wider mb-2">
                      🌿 Organic Bio-Control
                    </h5>
                    <ul className="space-y-1.5 text-xs text-gray-700">
                      {report.organicControl.map((o, i) => (
                        <li key={i} className="leading-snug">• {o}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 text-gray-400 text-sm">
              Upload a crop photo on the left and click &ldquo;Analyze Crop&rdquo; to generate diagnostic analysis.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
