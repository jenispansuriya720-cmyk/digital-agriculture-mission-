import React, { useState, useEffect } from 'react';
import {
  Wheat,
  Plus,
  Calendar,
  Droplets,
  Activity,
  CheckCircle,
  Clock,
  Sparkles,
  Edit2,
  Trash2,
  X,
  Check,
} from 'lucide-react';
import { cropService } from '../services/cropService';
import { farmService } from '../services/farmService';
import { Crop, Farm, GrowthStage } from '../types';
import { CropTimeline } from '../components/farm/CropTimeline';
import { EmptyState } from '../components/common/EmptyState';
import { SkeletonLoader } from '../components/common/SkeletonLoader';

const AVAILABLE_CROPS = [
  { name: 'Cotton', icon: '🌱', variety: 'Bt Cotton Hy-12' },
  { name: 'Wheat', icon: '🌾', variety: 'GW-496 Lokwan' },
  { name: 'Rice', icon: '🌾', variety: 'Gujarat Rice-17' },
  { name: 'Groundnut', icon: '🥜', variety: 'TG-37A Spanish' },
  { name: 'Maize', icon: '🌽', variety: 'African Tall / Sweet' },
  { name: 'Tomato', icon: '🍅', variety: 'Abhinav F1 Hybrid' },
  { name: 'Onion', icon: '🧅', variety: 'Agrifound Dark Red' },
  { name: 'Potato', icon: '🥔', variety: 'Kufri Pukhraj' },
];

export const CropsPage: React.FC = () => {
  const [crops, setCrops] = useState<Crop[]>([]);
  const [farms, setFarms] = useState<Farm[]>([]);
  const [selectedCrop, setSelectedCrop] = useState<Crop | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    farmId: '',
    cropName: 'Cotton',
    variety: 'Bt Cotton (G.Cot-Hy-12)',
    plantingDate: '2026-06-15',
    expectedHarvest: '2026-11-20',
    growthStage: 'Flowering' as GrowthStage,
    healthScore: '85',
    area: '3.0',
    irrigationRequirement: '600-750 mm (Medium to High)',
    notes: 'Monitored with digital leaf sensors.',
  });

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [cropsRes, farmsRes] = await Promise.allSettled([
        cropService.getCrops(),
        farmService.getFarms(true),
      ]);

      if (cropsRes.status === 'fulfilled' && cropsRes.value.success) {
        setCrops(cropsRes.value.data);
        if (cropsRes.value.data.length > 0 && !selectedCrop) {
          setSelectedCrop(cropsRes.value.data[0]);
        }
      }
      if (farmsRes.status === 'fulfilled' && farmsRes.value.success) {
        setFarms(farmsRes.value.data);
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

  const handleSelectCrop = (crop: Crop) => {
    setSelectedCrop(crop);
  };

  const handleToggleFertilizerStep = async (cropId: string, stepIndex: number) => {
    if (!selectedCrop) return;
    const updatedSchedule = [...selectedCrop.fertilizerSchedule];
    updatedSchedule[stepIndex].completed = !updatedSchedule[stepIndex].completed;

    try {
      await cropService.updateCrop(cropId, { fertilizerSchedule: updatedSchedule });
      setSelectedCrop({ ...selectedCrop, fertilizerSchedule: updatedSchedule });
      setCrops((prev) =>
        prev.map((c) => (c._id === cropId ? { ...c, fertilizerSchedule: updatedSchedule } : c))
      );
      setToastMessage('✓ Fertilizer schedule step updated.');
      setTimeout(() => setToastMessage(''), 2500);
    } catch (err) {}
  };

  const handleCreateCropSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await cropService.createCrop({
        ...formData,
        healthScore: Number(formData.healthScore),
        area: Number(formData.area),
      });
      if (res.success && res.data) {
        setToastMessage('✓ Crop registered successfully.');
        setIsModalOpen(false);
        setTimeout(() => setToastMessage(''), 3000);
        await loadData();
        setSelectedCrop(res.data);
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to add crop');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCrop = async (id: string) => {
    if (!window.confirm('Delete this crop record?')) return;
    try {
      await cropService.deleteCrop(id);
      setToastMessage('✓ Crop removed.');
      setTimeout(() => setToastMessage(''), 3000);
      loadData();
      setSelectedCrop(null);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Could not delete crop');
    }
  };

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
            <Wheat className="w-6 h-6 text-primary" />
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Crop Lifecycle & Management
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Monitor phenological growth phases, fertilizer dosage timetables, and yield forecasts
          </p>
        </div>

        <button
          onClick={() => {
            if (farms.length > 0) setFormData({ ...formData, farmId: farms[0]._id });
            setIsModalOpen(true);
          }}
          className="px-5 py-3 rounded-2xl bg-primary text-white font-bold text-xs sm:text-sm hover:bg-primary-dark transition-all flex items-center space-x-2 shadow-md shadow-primary/20"
        >
          <Plus className="w-4 h-4" />
          <span>Add Crop to Farm</span>
        </button>
      </div>

      {/* Top Standard Crop Badges */}
      <div>
        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
          Supported Mission Cultivars
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {AVAILABLE_CROPS.map((cr) => (
            <div
              key={cr.name}
              className="p-3 bg-white rounded-2xl border border-gray-100 shadow-xs text-center hover:border-primary/50 transition-colors"
            >
              <span className="text-2xl">{cr.icon}</span>
              <p className="text-xs font-bold text-gray-900 mt-1">{cr.name}</p>
              <p className="text-[10px] text-gray-400 truncate">{cr.variety}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Layout: Crops Grid & Detail Inspection */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Registered Crops List */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
              Active Crops ({crops.length})
            </h3>
            <span className="text-xs text-gray-400">Select to inspect</span>
          </div>

          {isLoading ? (
            <SkeletonLoader rows={4} height="h-20" />
          ) : crops.length === 0 ? (
            <EmptyState
              icon="🌱"
              title="No crops recorded"
              description="Add your first sown crop to begin scheduling irrigation and fertilizers."
              actionText="Add Crop"
              onAction={() => setIsModalOpen(true)}
            />
          ) : (
            <div className="space-y-3">
              {crops.map((c) => {
                const isSelected = selectedCrop?._id === c._id;
                return (
                  <div
                    key={c._id}
                    onClick={() => handleSelectCrop(c)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 flex items-center justify-between ${
                      isSelected
                        ? 'bg-light-green/40 border-primary ring-2 ring-primary/20 shadow-sm'
                        : 'bg-white border-gray-100 hover:border-primary/40 shadow-xs'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl p-2 bg-white rounded-xl shadow-xs border border-gray-100">
                        {c.icon || '🌱'}
                      </span>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="text-sm font-bold text-gray-900">{c.cropName}</h4>
                          <span className="text-[10px] px-2 py-0.5 bg-white text-primary font-bold rounded-full border border-gray-100">
                            {c.area} Acres
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">{c.variety}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-bold text-emerald-700 bg-white px-2 py-1 rounded-lg border border-gray-100">
                        {c.healthScore}% Health
                      </span>
                      <p className="text-[10px] text-gray-400 mt-1 font-semibold">
                        {c.growthStage} Stage
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Selected Crop Details & Timeline */}
        <div className="lg:col-span-7">
          {selectedCrop ? (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-soft space-y-6">
              {/* Detail Header */}
              <div className="flex items-start justify-between pb-4 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <span className="text-4xl p-2.5 bg-light-green/60 rounded-2xl">
                    {selectedCrop.icon || '🌱'}
                  </span>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h2 className="text-xl font-extrabold text-gray-900">
                        {selectedCrop.cropName}
                      </h2>
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full">
                        Score: {selectedCrop.healthScore}%
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 font-medium mt-0.5">
                      Variety: {selectedCrop.variety} • Cultivated Area: {selectedCrop.area} Acres
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteCrop(selectedCrop._id)}
                  className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                  title="Delete Crop Record"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Crop Lifecycle Timeline */}
              <CropTimeline
                currentStage={selectedCrop.growthStage}
                plantingDate={selectedCrop.plantingDate}
                expectedHarvest={selectedCrop.expectedHarvest}
              />

              {/* Agronomic Parameters Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-2xl bg-cream border border-gray-100">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    Sowing Date
                  </span>
                  <p className="text-xs font-bold text-gray-900 mt-0.5">
                    {new Date(selectedCrop.plantingDate).toLocaleDateString()}
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-cream border border-gray-100">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    Expected Harvest
                  </span>
                  <p className="text-xs font-bold text-gray-900 mt-0.5">
                    {new Date(selectedCrop.expectedHarvest).toLocaleDateString()}
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-cream border border-gray-100">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    Water Needs
                  </span>
                  <p className="text-xs font-bold text-gray-900 mt-0.5 truncate">
                    {selectedCrop.irrigationRequirement}
                  </p>
                </div>
              </div>

              {/* Fertilizer Schedule */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center space-x-1.5">
                    <Sparkles className="w-4 h-4 text-primary" />
                    <span>Agronomic Fertilizer Schedule</span>
                  </h4>
                  <span className="text-[11px] text-gray-400">Click to mark applied</span>
                </div>

                <div className="space-y-2">
                  {selectedCrop.fertilizerSchedule.map((step, idx) => (
                    <div
                      key={step.stage + idx}
                      onClick={() => handleToggleFertilizerStep(selectedCrop._id, idx)}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                        step.completed
                          ? 'bg-light-green/30 border-secondary/40 text-gray-900'
                          : 'bg-white border-gray-100 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-5 h-5 rounded-lg flex items-center justify-center text-xs font-bold ${
                            step.completed
                              ? 'bg-secondary text-white'
                              : 'border border-gray-300 text-gray-400'
                          }`}
                        >
                          {step.completed && <Check className="w-3.5 h-3.5" />}
                        </div>
                        <div>
                          <p className="text-xs font-bold">{step.stage} ({step.date})</p>
                          <p className="text-[11px] text-gray-500">{step.details}</p>
                        </div>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          step.completed
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {step.completed ? 'Applied' : 'Pending'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes */}
              {selectedCrop.notes && (
                <div className="p-3.5 rounded-2xl bg-cream border border-gray-100 text-xs text-gray-600">
                  <span className="font-bold text-gray-800">Agronomist Notes: </span>
                  {selectedCrop.notes}
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 text-gray-400 text-sm">
              Select a crop from the left to view its growth timeline and fertilizer schedule.
            </div>
          )}
        </div>
      </div>

      {/* Add Crop Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-gray-100 my-8 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-5">
              <h3 className="text-lg font-bold text-gray-900">Add Crop to Farm</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleCreateCropSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase">Crop Name *</label>
                <select
                  value={formData.cropName}
                  onChange={(e) => setFormData({ ...formData, cropName: e.target.value })}
                  className="mt-1 w-full px-3 py-2.5 text-xs sm:text-sm rounded-xl border border-gray-200 bg-white"
                >
                  <option value="Cotton">Cotton (કપાસ)</option>
                  <option value="Wheat">Wheat (ઘઉં)</option>
                  <option value="Rice">Rice / Paddy (ડાંગર)</option>
                  <option value="Groundnut">Groundnut (મગફળી)</option>
                  <option value="Maize">Maize (મકાઈ)</option>
                  <option value="Tomato">Tomato (ટામેટા)</option>
                  <option value="Onion">Onion (ડુંગળી)</option>
                  <option value="Potato">Potato (બટાટા)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase">Variety *</label>
                <input
                  type="text"
                  required
                  value={formData.variety}
                  onChange={(e) => setFormData({ ...formData, variety: e.target.value })}
                  placeholder="e.g. Shanker-6 Hybrid"
                  className="mt-1 w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-gray-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase">Planting Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.plantingDate}
                    onChange={(e) => setFormData({ ...formData, plantingDate: e.target.value })}
                    className="mt-1 w-full px-3 py-2 text-xs rounded-xl border border-gray-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase">Harvest Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.expectedHarvest}
                    onChange={(e) => setFormData({ ...formData, expectedHarvest: e.target.value })}
                    className="mt-1 w-full px-3 py-2 text-xs rounded-xl border border-gray-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase">Growth Stage</label>
                  <select
                    value={formData.growthStage}
                    onChange={(e) => setFormData({ ...formData, growthStage: e.target.value as GrowthStage })}
                    className="mt-1 w-full px-3 py-2 text-xs rounded-xl border border-gray-200 bg-white"
                  >
                    <option value="Planting">Planting</option>
                    <option value="Germination">Germination</option>
                    <option value="Vegetative">Vegetative</option>
                    <option value="Flowering">Flowering</option>
                    <option value="Fruiting">Fruiting</option>
                    <option value="Harvest">Harvest</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase">Planted Area (Acres)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.area}
                    onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                    className="mt-1 w-full px-3 py-2 text-xs rounded-xl border border-gray-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase">Irrigation Requirement</label>
                <input
                  type="text"
                  value={formData.irrigationRequirement}
                  onChange={(e) => setFormData({ ...formData, irrigationRequirement: e.target.value })}
                  placeholder="e.g. 500-650 mm (Drip 3x/week)"
                  className="mt-1 w-full px-3 py-2 text-xs rounded-xl border border-gray-200"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-100">
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
                  {isSubmitting ? 'Adding...' : 'Save Crop'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
