import React, { useState, useEffect } from 'react';
import {
  Droplets,
  Calendar,
  Clock,
  Radio,
  Gauge,
  Thermometer,
  CloudSun,
  Activity,
  Play,
  Pause,
  Plus,
  Check,
  X,
  AlertTriangle,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { irrigationService } from '../services/irrigationService';
import { farmService } from '../services/farmService';
import { IrrigationData, Farm } from '../types';
import { SkeletonLoader } from '../components/common/SkeletonLoader';

export const IrrigationPage: React.FC = () => {
  const [irrigation, setIrrigation] = useState<IrrigationData | null>(null);
  const [farms, setFarms] = useState<Farm[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isToggling, setIsToggling] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Schedule Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [scheduleForm, setScheduleForm] = useState({
    farmId: '',
    zoneName: 'Zone A - Main Field',
    waterAmountLitres: '1200',
    scheduledTime: '6:00 AM – 8:00 AM',
    scheduledDate: new Date().toISOString().split('T')[0],
  });

  const loadIrrigationData = async () => {
    try {
      setIsLoading(true);
      const [irrigRes, farmRes] = await Promise.allSettled([
        irrigationService.getIrrigation(),
        farmService.getFarms(true),
      ]);

      if (irrigRes.status === 'fulfilled' && irrigRes.value.success) {
        if (irrigRes.value.data.length > 0) {
          setIrrigation(irrigRes.value.data[0]);
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
    loadIrrigationData();
  }, []);

  const handleToggleDemoIrrigation = async () => {
    setIsToggling(true);
    try {
      const res = await irrigationService.toggleDemoIrrigation();
      if (res.success && res.data) {
        setIrrigation(res.data);
        setToastMessage(res.message);
        setTimeout(() => setToastMessage(''), 3500);
      }
    } catch (err: any) {
      alert('Could not toggle demo pump');
    } finally {
      setIsToggling(false);
    }
  };

  const handleCreateSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await irrigationService.scheduleIrrigation({
        farmId: scheduleForm.farmId || (farms[0] ? farms[0]._id : undefined),
        zoneName: scheduleForm.zoneName,
        waterAmountLitres: Number(scheduleForm.waterAmountLitres),
        scheduledTime: scheduleForm.scheduledTime,
        scheduledDate: scheduleForm.scheduledDate,
      });

      if (res.success && res.data) {
        setIrrigation(res.data);
        setToastMessage('✓ Irrigation schedule saved to MongoDB.');
        setIsModalOpen(false);
        setTimeout(() => setToastMessage(''), 3000);
      }
    } catch (err: any) {
      alert('Failed to save irrigation schedule');
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
            <Droplets className="w-6 h-6 text-cyan-600" />
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Smart IoT Irrigation
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Automated soil moisture sensing, solenoid pump control, and scheduled drip water budgeting
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => {
              if (farms.length > 0) setScheduleForm({ ...scheduleForm, farmId: farms[0]._id });
              setIsModalOpen(true);
            }}
            className="px-4 py-2.5 rounded-xl border border-gray-200 bg-cream hover:bg-gray-100 text-xs font-bold text-gray-800 transition-colors flex items-center space-x-1.5"
          >
            <Calendar className="w-4 h-4 text-primary" />
            <span>Schedule Irrigation</span>
          </button>

          <button
            onClick={handleToggleDemoIrrigation}
            disabled={isToggling}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs text-white shadow-md flex items-center space-x-1.5 transition-all ${
              irrigation?.status === 'Irrigating'
                ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-600/20'
                : 'bg-primary hover:bg-primary-dark shadow-primary/20'
            }`}
          >
            {irrigation?.status === 'Irrigating' ? (
              <>
                <Pause className="w-4 h-4" />
                <span>Stop Demo Pump</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                <span>Start Demo Irrigation</span>
              </>
            )}
          </button>
        </div>
      </div>

      {isLoading ? (
        <SkeletonLoader rows={4} height="h-28" />
      ) : irrigation ? (
        <>
          {/* Main Status & Recommended Dose Card */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Moisture Status Card */}
            <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-soft flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                    Live Field Sensor Feedback
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-extrabold flex items-center space-x-1.5 ${
                      irrigation.status === 'Irrigating'
                        ? 'bg-blue-100 text-blue-800 animate-pulse'
                        : irrigation.soilMoisture < 40
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    <span>
                      {irrigation.status === 'Irrigating'
                        ? '💧 Irrigating Now'
                        : irrigation.soilMoisture < 40
                        ? '🔴 Irrigation Required'
                        : '🟢 Moisture Optimal'}
                    </span>
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-6 my-4">
                  <div>
                    <span className="text-xs text-gray-500 font-semibold">Current Soil Moisture</span>
                    <p className={`text-5xl font-black mt-1 ${irrigation.soilMoisture < 40 ? 'text-rose-600' : 'text-primary'}`}>
                      {irrigation.soilMoisture}%
                    </p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 font-semibold">Target Requirement</span>
                    <p className="text-5xl font-black text-gray-700 mt-1">
                      {irrigation.requiredMoisture}%
                    </p>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden mt-2">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      irrigation.soilMoisture < 40 ? 'bg-rose-500' : 'bg-secondary'
                    }`}
                    style={{ width: `${Math.min(100, (irrigation.soilMoisture / 80) * 100)}%` }}
                  />
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                <span>Field: {irrigation.farmName}</span>
                <span>Active Line: {irrigation.zoneName}</span>
              </div>
            </div>

            {/* Right: Recommended Dose Card */}
            <div className="lg:col-span-6 bg-gradient-to-br from-primary to-primary-dark rounded-3xl p-6 sm:p-8 text-white shadow-soft-lg flex flex-col justify-between">
              <div>
                <span className="px-3 py-1 bg-white/10 text-secondary text-xs font-bold rounded-full uppercase tracking-wider">
                  Automated Water Budget
                </span>

                <div className="mt-6 space-y-4">
                  <div>
                    <span className="text-xs text-emerald-200">Recommended Water Volume</span>
                    <p className="text-4xl sm:text-5xl font-black text-white mt-1">
                      {irrigation.waterAmountLitres.toLocaleString()}{' '}
                      <span className="text-2xl font-bold text-emerald-200">Litres</span>
                    </p>
                  </div>

                  <div>
                    <span className="text-xs text-emerald-200">Optimal Irrigation Window</span>
                    <p className="text-xl font-bold text-white mt-1 flex items-center space-x-2">
                      <Clock className="w-5 h-5 text-secondary" />
                      <span>{irrigation.scheduledTime}</span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 text-xs text-emerald-100/90 leading-relaxed">
                Early morning drip application minimizes midday evaporation loss by up to 28% and ensures deep root penetration for Bt Cotton.
              </div>
            </div>
          </div>

          {/* 5 IoT Sensor Cards */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3 flex items-center space-x-2">
              <Radio className="w-4 h-4 text-primary" />
              <span>Real-Time Wireless IoT Telemetry</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-soft text-center">
                <Droplets className="w-5 h-5 text-cyan-600 mx-auto mb-1" />
                <span className="text-[10px] font-bold text-gray-400 uppercase">Soil Moisture</span>
                <p className="text-xl font-black text-gray-900 mt-0.5">{irrigation.sensors.soilMoisture}%</p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-soft text-center">
                <Thermometer className="w-5 h-5 text-amber-600 mx-auto mb-1" />
                <span className="text-[10px] font-bold text-gray-400 uppercase">Soil Temp</span>
                <p className="text-xl font-black text-gray-900 mt-0.5">{irrigation.sensors.temperature}°C</p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-soft text-center">
                <CloudSun className="w-5 h-5 text-sky-600 mx-auto mb-1" />
                <span className="text-[10px] font-bold text-gray-400 uppercase">Air Humidity</span>
                <p className="text-xl font-black text-gray-900 mt-0.5">{irrigation.sensors.humidity}%</p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-soft text-center">
                <Gauge className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                <span className="text-[10px] font-bold text-gray-400 uppercase">Water Tank</span>
                <p className="text-xl font-black text-gray-900 mt-0.5">{irrigation.sensors.waterTankLevel}%</p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-soft text-center col-span-2 sm:col-span-1">
                <Activity className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
                <span className="text-[10px] font-bold text-gray-400 uppercase">Flow Rate</span>
                <p className="text-xl font-black text-gray-900 mt-0.5">{irrigation.sensors.flowRate} L/min</p>
              </div>
            </div>
          </div>

          {/* Moisture Timeline Line Chart */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-soft">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-gray-900">
                  Soil Moisture Depletion & Irrigation Timeline
                </h3>
                <p className="text-xs text-gray-500">
                  Hourly sensor telemetry logged from capacitive FDR probes
                </p>
              </div>
              <span className="text-xs font-bold text-primary bg-light-green/60 px-2.5 py-1 rounded-lg">
                Threshold: 55%
              </span>
            </div>

            <div className="h-72 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={irrigation.historyData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#64748b' }} />
                  <YAxis domain={[10, 80]} tick={{ fontSize: 11, fill: '#64748b' }} unit="%" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="moisture"
                    name="Moisture (%)"
                    stroke="#166534"
                    strokeWidth={3}
                    dot={{ fill: '#22C55E', r: 5 }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      ) : null}

      {/* Schedule Irrigation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-gray-100 my-8 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-5">
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-bold text-gray-900">Schedule Drip Irrigation</h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleCreateSchedule} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase">Farm Zone</label>
                <input
                  type="text"
                  required
                  value={scheduleForm.zoneName}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, zoneName: e.target.value })}
                  placeholder="e.g. Zone A - North Field"
                  className="mt-1 w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-gray-200"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase">Water Volume (Litres)</label>
                <input
                  type="number"
                  required
                  value={scheduleForm.waterAmountLitres}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, waterAmountLitres: e.target.value })}
                  className="mt-1 w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-gray-200"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase">Preferred Time Window</label>
                <input
                  type="text"
                  required
                  value={scheduleForm.scheduledTime}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, scheduledTime: e.target.value })}
                  placeholder="e.g. 6:00 AM – 8:00 AM"
                  className="mt-1 w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-gray-200"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase">Scheduled Date</label>
                <input
                  type="date"
                  required
                  value={scheduleForm.scheduledDate}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, scheduledDate: e.target.value })}
                  className="mt-1 w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-gray-200"
                />
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
                  className="px-5 py-2 text-xs font-bold text-white bg-primary hover:bg-primary-dark rounded-xl shadow-md"
                >
                  Confirm & Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
