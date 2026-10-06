import React, { useState, useEffect } from 'react';
import {
  Tractor,
  Plus,
  Edit2,
  Trash2,
  MapPin,
  Droplets,
  Layers,
  Sparkles,
  Wheat,
  X,
  Check,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { farmService } from '../services/farmService';
import { cropService } from '../services/cropService';
import { Farm, Crop } from '../types';
import { DigitalFarmMap } from '../components/farm/DigitalFarmMap';
import { EmptyState } from '../components/common/EmptyState';
import { SkeletonLoader } from '../components/common/SkeletonLoader';

export const MyFarmPage: React.FC = () => {
  const { user } = useAuth();

  const [farms, setFarms] = useState<Farm[]>([]);
  const [crops, setCrops] = useState<Crop[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFarm, setEditingFarm] = useState<Farm | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    farmName: '',
    location: '',
    state: 'Gujarat',
    district: 'Ahmedabad',
    village: 'Sanand',
    area: '4.5',
    soilType: 'Black Cotton Soil',
    irrigationType: 'Drip Irrigation',
    waterSource: 'Narmada Canal & Borewell',
    latitude: '22.9868',
    longitude: '72.3787',
  });

  const fetchFarms = async () => {
    try {
      setIsLoading(true);
      const [farmRes, cropRes] = await Promise.allSettled([
        farmService.getFarms(true),
        cropService.getCrops(),
      ]);

      if (farmRes.status === 'fulfilled' && farmRes.value.success) {
        setFarms(farmRes.value.data);
      }
      if (cropRes.status === 'fulfilled' && cropRes.value.success) {
        setCrops(cropRes.value.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFarms();
  }, []);

  const openCreateModal = () => {
    setEditingFarm(null);
    setFormData({
      farmName: '',
      location: '',
      state: user?.state || 'Gujarat',
      district: user?.district || 'Ahmedabad',
      village: user?.village || 'Sanand',
      area: '3.5',
      soilType: 'Black Cotton Soil',
      irrigationType: 'Drip Irrigation',
      waterSource: 'Borewell & Canal',
      latitude: '23.0225',
      longitude: '72.5714',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (farm: Farm) => {
    setEditingFarm(farm);
    setFormData({
      farmName: farm.farmName,
      location: farm.location,
      state: farm.state,
      district: farm.district,
      village: farm.village,
      area: String(farm.area),
      soilType: farm.soilType,
      irrigationType: farm.irrigationType,
      waterSource: farm.waterSource,
      latitude: String(farm.latitude),
      longitude: String(farm.longitude),
    });
    setIsModalOpen(true);
  };

  const handleDeleteFarm = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this digital farm record?')) return;
    try {
      await farmService.deleteFarm(id);
      setToastMessage('✓ Farm deleted successfully.');
      setTimeout(() => setToastMessage(''), 3000);
      fetchFarms();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Could not delete farm');
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingFarm) {
        await farmService.updateFarm(editingFarm._id, {
          ...formData,
          area: Number(formData.area),
          latitude: Number(formData.latitude),
          longitude: Number(formData.longitude),
        });
        setToastMessage('✓ Farm updated successfully.');
      } else {
        await farmService.createFarm({
          ...formData,
          area: Number(formData.area),
          latitude: Number(formData.latitude),
          longitude: Number(formData.longitude),
        });
        setToastMessage('✓ Farm registered successfully.');
      }
      setIsModalOpen(false);
      setTimeout(() => setToastMessage(''), 3000);
      fetchFarms();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error saving farm details');
    } finally {
      setIsSubmitting(false);
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
            <Tractor className="w-6 h-6 text-primary" />
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              My Digital Farm Registry
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Digitally map plot boundaries, telemetry sensors, soil typology, and irrigation networks
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-5 py-3 rounded-2xl bg-primary text-white font-bold text-xs sm:text-sm hover:bg-primary-dark transition-all flex items-center space-x-2 shadow-md shadow-primary/20"
        >
          <Plus className="w-4 h-4" />
          <span>Register New Farm</span>
        </button>
      </div>

      {/* Interactive Simulated Digital Farm Map */}
      <DigitalFarmMap
        farmName={farms[0]?.farmName || 'Surya Green Farm - Field 1'}
        totalArea={farms.reduce((a, b) => a + b.area, 0) || 5.0}
      />

      {/* Farms List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">
            Registered Farm Plots ({farms.length})
          </h3>
          <span className="text-xs text-gray-500">Connected to MongoDB</span>
        </div>

        {isLoading ? (
          <SkeletonLoader rows={3} height="h-28" />
        ) : farms.length === 0 ? (
          <EmptyState
            icon="🌾"
            title="No farms registered yet"
            description="Add your first farm plot to start monitoring soil health, weather, and automated drip irrigation."
            actionText="Register First Farm"
            onAction={openCreateModal}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {farms.map((farm) => {
              const farmCrops = crops.filter((c) =>
                typeof c.farmId === 'object' ? c.farmId?._id === farm._id : c.farmId === farm._id
              );

              return (
                <div
                  key={farm._id}
                  className="bg-white rounded-3xl p-6 border border-gray-100 shadow-soft hover:shadow-soft-lg transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="text-base font-bold text-gray-900">{farm.farmName}</h4>
                          <span className="px-2 py-0.5 bg-light-green text-primary text-[10px] font-bold rounded-full">
                            {farm.area} Acres
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1 flex items-center space-x-1">
                          <MapPin className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                          <span>{farm.village}, {farm.district}, {farm.state}</span>
                        </p>
                      </div>

                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => openEditModal(farm)}
                          className="p-2 text-gray-400 hover:text-primary hover:bg-gray-100 rounded-xl transition-colors"
                          title="Edit Farm"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteFarm(farm._id)}
                          className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                          title="Delete Farm"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Metadata Badges */}
                    <div className="grid grid-cols-2 gap-2 mt-4 text-xs">
                      <div className="p-2.5 rounded-xl bg-cream border border-gray-100">
                        <p className="text-[10px] text-gray-500 font-semibold uppercase">Soil Type</p>
                        <p className="font-bold text-gray-800 mt-0.5 truncate">{farm.soilType}</p>
                      </div>
                      <div className="p-2.5 rounded-xl bg-cream border border-gray-100">
                        <p className="text-[10px] text-gray-500 font-semibold uppercase">Irrigation</p>
                        <p className="font-bold text-gray-800 mt-0.5 truncate">{farm.irrigationType}</p>
                      </div>
                      <div className="p-2.5 rounded-xl bg-cream border border-gray-100">
                        <p className="text-[10px] text-gray-500 font-semibold uppercase">Water Source</p>
                        <p className="font-bold text-gray-800 mt-0.5 truncate">{farm.waterSource}</p>
                      </div>
                      <div className="p-2.5 rounded-xl bg-cream border border-gray-100">
                        <p className="text-[10px] text-gray-500 font-semibold uppercase">GPS Coordinates</p>
                        <p className="font-bold text-gray-800 mt-0.5">
                          {farm.latitude.toFixed(3)}, {farm.longitude.toFixed(3)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Active Crops in this Farm */}
                  <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-1.5 text-gray-600 font-medium">
                      <Wheat className="w-4 h-4 text-secondary" />
                      <span>{farmCrops.length} Active Crops Registered</span>
                    </div>
                    <span className="text-[11px] text-primary font-bold">
                      {farm.sensorsCount || 3} IoT Sensors Active
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Farm Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 my-8">
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-gray-100">
              <div className="flex items-center space-x-2.5">
                <Tractor className="w-6 h-6 text-primary" />
                <h3 className="text-lg font-bold text-gray-900">
                  {editingFarm ? 'Edit Farm Details' : 'Register New Agricultural Plot'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase">Farm Name *</label>
                <input
                  type="text"
                  required
                  value={formData.farmName}
                  onChange={(e) => setFormData({ ...formData, farmName: e.target.value })}
                  placeholder="e.g. Surya Green Farm - Field 1"
                  className="mt-1 w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-gray-200 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase">Location / Address *</label>
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g. Sanand Taluka, Near Narmada Branch"
                  className="mt-1 w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-gray-200 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase">State</label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="mt-1 w-full px-3 py-2 text-xs rounded-xl border border-gray-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase">District</label>
                  <input
                    type="text"
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    className="mt-1 w-full px-3 py-2 text-xs rounded-xl border border-gray-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase">Village *</label>
                  <input
                    type="text"
                    required
                    value={formData.village}
                    onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                    className="mt-1 w-full px-3 py-2 text-xs rounded-xl border border-gray-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase">Land Area (Acres) *</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={formData.area}
                    onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                    className="mt-1 w-full px-3 py-2 text-xs rounded-xl border border-gray-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase">Soil Type</label>
                  <select
                    value={formData.soilType}
                    onChange={(e) => setFormData({ ...formData, soilType: e.target.value })}
                    className="mt-1 w-full px-3 py-2 text-xs rounded-xl border border-gray-200 bg-white"
                  >
                    <option value="Black Cotton Soil">Black Cotton Soil (કાળી જમીન)</option>
                    <option value="Alluvial Loam">Alluvial Loam (કાંપવાળી જમીન)</option>
                    <option value="Sandy Loam">Sandy Loam (ગોરાડુ જમીન)</option>
                    <option value="Red Laterite Soil">Red Laterite Soil (લાલ જમીન)</option>
                    <option value="Clayey Loam">Clayey Loam (ચીકણી માટી)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase">Irrigation Type</label>
                  <select
                    value={formData.irrigationType}
                    onChange={(e) => setFormData({ ...formData, irrigationType: e.target.value })}
                    className="mt-1 w-full px-3 py-2 text-xs rounded-xl border border-gray-200 bg-white"
                  >
                    <option value="Drip Irrigation">Drip Irrigation (ટપક પદ્ધતિ)</option>
                    <option value="Sprinkler Irrigation">Sprinkler Irrigation (ફુવારા પદ્ધતિ)</option>
                    <option value="Sub-surface Drip">Sub-surface Drip</option>
                    <option value="Furrow / Flood">Furrow / Flood Irrigation</option>
                    <option value="Rainfed (Non-irrigated)">Rainfed (Non-irrigated)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase">Water Source</label>
                  <input
                    type="text"
                    value={formData.waterSource}
                    onChange={(e) => setFormData({ ...formData, waterSource: e.target.value })}
                    placeholder="e.g. Borewell & Canal"
                    className="mt-1 w-full px-3 py-2 text-xs rounded-xl border border-gray-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase">Latitude</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={formData.latitude}
                    onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                    className="mt-1 w-full px-3 py-2 text-xs rounded-xl border border-gray-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase">Longitude</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={formData.longitude}
                    onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                    className="mt-1 w-full px-3 py-2 text-xs rounded-xl border border-gray-200"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 text-xs font-bold text-white bg-primary hover:bg-primary-dark rounded-xl shadow-md disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : editingFarm ? 'Save Changes' : 'Register Farm'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
