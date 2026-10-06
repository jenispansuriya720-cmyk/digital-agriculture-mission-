import React, { useState, useEffect } from 'react';
import {
  TestTube2,
  Upload,
  CheckCircle,
  AlertCircle,
  FileText,
  Activity,
  Sparkles,
  Layers,
  ArrowRight,
  X,
  Check,
} from 'lucide-react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { soilService } from '../services/soilService';
import { farmService } from '../services/farmService';
import { SoilReport, Farm } from '../types';
import { SkeletonLoader } from '../components/common/SkeletonLoader';

export const SoilHealthPage: React.FC = () => {
  const [reports, setReports] = useState<SoilReport[]>([]);
  const [farms, setFarms] = useState<Farm[]>([]);
  const [selectedReport, setSelectedReport] = useState<SoilReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Form
  const [formData, setFormData] = useState({
    farmId: '',
    pH: '6.8',
    nitrogen: '280',
    phosphorus: '42',
    potassium: '310',
    moisture: '68',
    organicCarbon: '0.75',
    electricalConductivity: '0.45',
  });

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [soilRes, farmRes] = await Promise.allSettled([
        soilService.getSoilReports(),
        farmService.getFarms(true),
      ]);

      if (soilRes.status === 'fulfilled' && soilRes.value.success) {
        setReports(soilRes.value.data);
        if (soilRes.value.data.length > 0) {
          setSelectedReport(soilRes.value.data[0]);
        }
      }
      if (farmRes.status === 'fulfilled' && farmRes.value.success) {
        setFarms(farmRes.value.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUploadReport = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await soilService.createSoilReport({
        farmId: formData.farmId || (farms[0] ? farms[0]._id : undefined),
        pH: Number(formData.pH),
        nitrogen: Number(formData.nitrogen),
        phosphorus: Number(formData.phosphorus),
        potassium: Number(formData.potassium),
        moisture: Number(formData.moisture),
        organicCarbon: Number(formData.organicCarbon),
        electricalConductivity: Number(formData.electricalConductivity),
      });

      if (res.success && res.data) {
        setToastMessage('✓ Soil health test analyzed and saved.');
        setIsModalOpen(false);
        setTimeout(() => setToastMessage(''), 3000);
        await loadData();
        setSelectedReport(res.data);
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error saving soil report');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Prepare radar chart data
  const radarData = selectedReport
    ? [
        { metric: 'pH Balance', value: Math.min(100, (selectedReport.pH / 7.0) * 85), fullMark: 100 },
        { metric: 'Nitrogen (N)', value: Math.min(100, (selectedReport.nitrogen / 350) * 100), fullMark: 100 },
        { metric: 'Phosphorus (P)', value: Math.min(100, (selectedReport.phosphorus / 50) * 100), fullMark: 100 },
        { metric: 'Potassium (K)', value: Math.min(100, (selectedReport.potassium / 350) * 100), fullMark: 100 },
        { metric: 'Moisture', value: selectedReport.moisture, fullMark: 100 },
        { metric: 'Organic Carbon', value: Math.min(100, (selectedReport.organicCarbon / 1.0) * 100), fullMark: 100 },
      ]
    : [];

  const barData = selectedReport
    ? [
        { name: 'Nitrogen (kg/ha)', current: selectedReport.nitrogen, target: 280 },
        { name: 'Phosphorus (kg/ha)', current: selectedReport.phosphorus, target: 45 },
        { name: 'Potassium (kg/ha)', current: selectedReport.potassium, target: 300 },
      ]
    : [];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 p-4 rounded-2xl bg-primary text-white shadow-xl flex items-center space-x-2 text-xs font-bold animate-in fade-in">
          <Check className="w-4 h-4 text-secondary" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white rounded-3xl p-6 border border-gray-100 shadow-soft">
        <div>
          <div className="flex items-center space-x-2">
            <TestTube2 className="w-6 h-6 text-primary" />
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Soil Health & Nutrient Intelligence
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Digitized Soil Health Card (SHC) metrics: N-P-K, pH, moisture saturation, and organic carbon
          </p>
        </div>

        <button
          onClick={() => {
            if (farms.length > 0) setFormData({ ...formData, farmId: farms[0]._id });
            setIsModalOpen(true);
          }}
          className="px-5 py-3 rounded-2xl bg-primary text-white font-bold text-xs sm:text-sm hover:bg-primary-dark transition-all flex items-center space-x-2 shadow-md shadow-primary/20"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Soil Report</span>
        </button>
      </div>

      {isLoading ? (
        <SkeletonLoader rows={4} height="h-28" />
      ) : selectedReport ? (
        <>
          {/* Soil Health Score Banner */}
          <div className="bg-gradient-to-br from-emerald-800 to-primary-dark rounded-3xl p-8 text-white shadow-soft-lg flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-2 text-center md:text-left">
              <span className="px-3 py-1 bg-secondary text-primary-dark font-extrabold text-xs rounded-full uppercase tracking-wider">
                Government Certified Lab Audit
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold">
                Overall Soil Health Score
              </h2>
              <p className="text-xs sm:text-sm text-emerald-100 max-w-xl">
                Your farm soil exhibits excellent organic fertility, well-balanced nitrogen-phosphorus ratio, and optimal micro-nutrient absorption capability.
              </p>
            </div>

            <div className="flex items-center space-x-4 bg-white/10 p-5 rounded-3xl border border-white/10 backdrop-blur-xs flex-shrink-0">
              <div className="text-center">
                <span className="text-5xl sm:text-6xl font-black text-secondary">
                  {selectedReport.overallScore}%
                </span>
                <p className="text-xs font-bold text-emerald-200 uppercase tracking-wider mt-1">
                  {selectedReport.rating}
                </p>
              </div>
            </div>
          </div>

          {/* 6 Key Chemical & Physical Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-soft text-center">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">pH Level</span>
              <p className="text-2xl font-black text-gray-900 mt-1">{selectedReport.pH}</p>
              <span className="text-[10px] font-bold text-emerald-700 bg-light-green px-2 py-0.5 rounded-full inline-block mt-1">
                Near Neutral
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-soft text-center">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Nitrogen (N)</span>
              <p className="text-2xl font-black text-gray-900 mt-1">{selectedReport.nitrogen}</p>
              <p className="text-[10px] text-gray-500 mt-1">kg/ha (Optimal)</p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-soft text-center">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Phosphorus (P)</span>
              <p className="text-2xl font-black text-gray-900 mt-1">{selectedReport.phosphorus}</p>
              <p className="text-[10px] text-gray-500 mt-1">kg/ha (Good)</p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-soft text-center">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Potassium (K)</span>
              <p className="text-2xl font-black text-gray-900 mt-1">{selectedReport.potassium}</p>
              <p className="text-[10px] text-gray-500 mt-1">kg/ha (Rich)</p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-soft text-center">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Moisture</span>
              <p className="text-2xl font-black text-gray-900 mt-1">{selectedReport.moisture}%</p>
              <span className="text-[10px] font-bold text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded-full inline-block mt-1">
                Optimal
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-soft text-center">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Organic Carbon</span>
              <p className="text-2xl font-black text-gray-900 mt-1">{selectedReport.organicCarbon}%</p>
              <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full inline-block mt-1">
                High Fertile
              </span>
            </div>
          </div>

          {/* Charts Row: Radar Chart + NPK Comparison */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Soil Radar Balance */}
            <div className="lg:col-span-6 bg-white rounded-3xl p-6 border border-gray-100 shadow-soft">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-base font-bold text-gray-900">
                  Nutrient Harmony Radar
                </h3>
                <span className="text-xs text-gray-400">Target: 100% Equilibrium</span>
              </div>
              <p className="text-xs text-gray-500 mb-4">
                Multi-dimensional visualization of current soil parameters relative to target agronomic benchmarks.
              </p>

              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                    <PolarGrid stroke="#e2e8f0" />
                    <PolarAngleAxis dataKey="metric" tick={{ fill: '#475569', fontSize: 11 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} />
                    <Radar
                      name="Soil Score"
                      dataKey="value"
                      stroke="#166534"
                      fill="#22C55E"
                      fillOpacity={0.4}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* NPK Target Comparison Bar Chart */}
            <div className="lg:col-span-6 bg-white rounded-3xl p-6 border border-gray-100 shadow-soft">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-base font-bold text-gray-900">
                  NPK Benchmark Comparison
                </h3>
                <span className="text-xs text-gray-400">Values in kg/hectare</span>
              </div>
              <p className="text-xs text-gray-500 mb-4">
                Comparison of actual laboratory measurements against standard state agricultural university benchmarks.
              </p>

              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} />
                    <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                    />
                    <Bar dataKey="current" name="Your Soil (kg/ha)" fill="#166534" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="target" name="Benchmark (kg/ha)" fill="#cbd5e1" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Expert Recommendations */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-soft">
            <div className="flex items-center space-x-2 mb-4">
              <Sparkles className="w-5 h-5 text-primary" />
              <h3 className="text-base font-bold text-gray-900">
                Actionable Soil Recommendations
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {selectedReport.recommendations.map((rec, i) => (
                <div
                  key={i}
                  className="p-4 rounded-2xl bg-cream border border-gray-100 flex items-start space-x-3 text-xs text-gray-700"
                >
                  <CheckCircle className="w-4 h-4 text-secondary flex-shrink-0 mt-0.5" />
                  <span className="leading-relaxed font-medium">{rec}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : null}

      {/* Upload Soil Test Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-gray-100 my-8 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-5">
              <div className="flex items-center space-x-2">
                <TestTube2 className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-bold text-gray-900">Upload Soil Lab Report</h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleUploadReport} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase">pH (e.g. 6.8)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={formData.pH}
                    onChange={(e) => setFormData({ ...formData, pH: e.target.value })}
                    className="mt-1 w-full px-3 py-2 text-xs rounded-xl border border-gray-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase">Nitrogen (kg/ha)</label>
                  <input
                    type="number"
                    required
                    value={formData.nitrogen}
                    onChange={(e) => setFormData({ ...formData, nitrogen: e.target.value })}
                    className="mt-1 w-full px-3 py-2 text-xs rounded-xl border border-gray-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase">Phosphorus (kg/ha)</label>
                  <input
                    type="number"
                    required
                    value={formData.phosphorus}
                    onChange={(e) => setFormData({ ...formData, phosphorus: e.target.value })}
                    className="mt-1 w-full px-3 py-2 text-xs rounded-xl border border-gray-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase">Potassium (kg/ha)</label>
                  <input
                    type="number"
                    required
                    value={formData.potassium}
                    onChange={(e) => setFormData({ ...formData, potassium: e.target.value })}
                    className="mt-1 w-full px-3 py-2 text-xs rounded-xl border border-gray-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase">Soil Moisture (%)</label>
                  <input
                    type="number"
                    required
                    value={formData.moisture}
                    onChange={(e) => setFormData({ ...formData, moisture: e.target.value })}
                    className="mt-1 w-full px-3 py-2 text-xs rounded-xl border border-gray-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase">Organic Carbon (%)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.organicCarbon}
                    onChange={(e) => setFormData({ ...formData, organicCarbon: e.target.value })}
                    className="mt-1 w-full px-3 py-2 text-xs rounded-xl border border-gray-200"
                  />
                </div>
              </div>

              <div className="p-4 border-2 border-dashed border-gray-200 rounded-2xl text-center bg-gray-50/50">
                <FileText className="w-8 h-8 text-gray-400 mx-auto mb-1" />
                <p className="text-xs font-bold text-gray-700">Attach Lab Test PDF / Image</p>
                <p className="text-[11px] text-gray-400 mt-0.5">Scanned Soil Health Card from District KVK</p>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 text-xs font-bold text-white bg-primary hover:bg-primary-dark rounded-xl shadow-md disabled:opacity-50"
                >
                  {isSubmitting ? 'Analyzing...' : 'Save & Calculate Score'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
