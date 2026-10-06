import React, { useState } from 'react';
import { Sprout, Droplets, Radio, Sun, Eye, Info, CheckCircle2 } from 'lucide-react';

interface ZoneInfo {
  id: string;
  name: string;
  type: string;
  area: string;
  crop: string;
  soilMoisture: number;
  health: number;
  status: string;
  details: string;
}

export const DigitalFarmMap: React.FC<{ farmName?: string; totalArea?: number }> = ({
  farmName = 'Surya Green Farm Plot',
  totalArea = 5.0,
}) => {
  const [selectedZone, setSelectedZone] = useState<ZoneInfo | null>(null);

  const zones: Record<string, ZoneInfo> = {
    cotton: {
      id: 'cotton',
      name: 'North-East Zone: Cotton Field',
      type: 'Cash Crop Sector',
      area: '3.0 Acres',
      crop: 'Bt Cotton (G.Cot-Hy-12)',
      soilMoisture: 32,
      health: 82,
      status: 'Flowering & Squaring Stage',
      details: 'Equipped with inline drippers (2 LPH). Soil moisture is at 32%; scheduled irrigation recommended tomorrow morning.',
    },
    vegetable: {
      id: 'vegetable',
      name: 'South-West Zone: Vegetable Field',
      type: 'Horticulture Sector',
      area: '1.5 Acres',
      crop: 'Hybrid Tomato & Bell Pepper',
      soilMoisture: 58,
      health: 88,
      status: 'Fruiting Phase',
      details: 'Staked with bamboo frames. Healthy foliage; automated fertigation cycle completed yesterday.',
    },
    watertank: {
      id: 'watertank',
      name: 'Central Water Hub & Solar Tank',
      type: 'Irrigation Storage',
      area: '0.2 Acres',
      crop: 'Water Reservoir',
      soilMoisture: 100,
      health: 95,
      status: 'Capacity: 78% (38,000 Litres)',
      details: 'Connected to deep community borewell and Narmada lift canal. Automated float switch active.',
    },
    sensors: {
      id: 'sensors',
      name: 'IoT Telemetry Array & Weather Mast',
      type: 'Agri-IoT Station',
      area: 'Sensor Network',
      crop: 'Sensors: pH, NPK, Moisture, Solar Radiation',
      soilMoisture: 45,
      health: 98,
      status: 'All 4 Transceivers Online',
      details: 'Transmitting soil moisture, ambient temperature (31°C), and humidity telemetry to Krishi Digital Cloud every 15 minutes.',
    },
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-soft">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-secondary animate-pulse" />
            <h3 className="text-base font-bold text-gray-900">
              Digital Farm Twin Map: {farmName}
            </h3>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            Interactive simulated satellite layout • Total Area: {totalArea} Acres • Click on any zone to inspect
          </p>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          <span className="flex items-center space-x-1.5 text-gray-600 bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-100">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Optimal</span>
          </span>
          <span className="flex items-center space-x-1.5 text-gray-600 bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-100">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span>Attention</span>
          </span>
          <span className="flex items-center space-x-1.5 text-gray-600 bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-100">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            <span>Water Facility</span>
          </span>
        </div>
      </div>

      {/* Simulated Interactive SVG Map Layout */}
      <div className="relative w-full aspect-[16/9] min-h-[340px] max-h-[460px] bg-[#E8EFE8] rounded-2xl p-4 overflow-hidden border-2 border-emerald-900/10 shadow-inner">
        {/* Subtle grid pattern background */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(#166534 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
          }}
        />

        <div className="grid grid-cols-12 grid-rows-12 gap-3 h-full relative z-10">
          {/* Cotton Field Area */}
          <div
            onClick={() => setSelectedZone(zones.cotton)}
            className={`col-span-8 row-span-6 bg-gradient-to-br from-emerald-100/90 to-emerald-200/70 border-2 rounded-2xl p-4 cursor-pointer transition-all duration-300 flex flex-col justify-between group hover:shadow-lg ${
              selectedZone?.id === 'cotton'
                ? 'border-primary ring-4 ring-primary/20 scale-[1.01]'
                : 'border-emerald-600/40 hover:border-primary'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-white/80 rounded-xl text-primary shadow-sm">
                  <Sprout className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-emerald-950 uppercase tracking-wide">
                    🌾 COTTON FIELD
                  </h4>
                  <p className="text-[11px] text-emerald-800 font-medium">3.0 Acres • Bt Cotton Hy-12</p>
                </div>
              </div>
              <span className="px-2 py-0.5 bg-amber-100 text-amber-800 font-bold text-[10px] rounded-full border border-amber-300">
                Moisture: 32% (Needs Water)
              </span>
            </div>

            <div className="flex items-end justify-between">
              <div className="flex items-center space-x-2 text-[11px] text-emerald-900 font-semibold bg-white/60 px-2.5 py-1 rounded-lg backdrop-blur-xs">
                <span>Health: 82%</span>
                <span>•</span>
                <span>Flowering Stage</span>
              </div>
              <span className="text-xs text-primary font-bold flex items-center space-x-1 group-hover:translate-x-1 transition-transform">
                <span>Inspect Field</span>
                <Eye className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>

          {/* Central Water Tank */}
          <div
            onClick={() => setSelectedZone(zones.watertank)}
            className={`col-span-4 row-span-7 bg-gradient-to-br from-blue-100/90 to-cyan-200/70 border-2 rounded-2xl p-4 cursor-pointer transition-all duration-300 flex flex-col justify-between group hover:shadow-lg ${
              selectedZone?.id === 'watertank'
                ? 'border-blue-600 ring-4 ring-blue-500/20 scale-[1.01]'
                : 'border-blue-400/50 hover:border-blue-600'
            }`}
          >
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-white/80 rounded-xl text-blue-600 shadow-sm">
                <Droplets className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-blue-950 uppercase tracking-wide">
                  💧 WATER TANK & PUMP
                </h4>
                <p className="text-[11px] text-blue-800 font-medium">Solar Lift Reservoir</p>
              </div>
            </div>

            <div className="space-y-1.5 my-auto">
              <div className="flex justify-between text-[11px] text-blue-900 font-bold">
                <span>Tank Storage</span>
                <span>78% Full</span>
              </div>
              <div className="w-full bg-white/80 h-2 rounded-full overflow-hidden">
                <div className="bg-blue-500 h-full rounded-full transition-all" style={{ width: '78%' }} />
              </div>
              <p className="text-[10px] text-blue-700">Discharge Flow: 24 L/min</p>
            </div>

            <div className="text-right">
              <span className="text-xs text-blue-800 font-bold flex items-center justify-end space-x-1 group-hover:translate-x-1 transition-transform">
                <span>Telemetry</span>
                <Eye className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>

          {/* Vegetable Field */}
          <div
            onClick={() => setSelectedZone(zones.vegetable)}
            className={`col-span-7 row-span-6 bg-gradient-to-br from-lime-100/90 to-green-200/70 border-2 rounded-2xl p-4 cursor-pointer transition-all duration-300 flex flex-col justify-between group hover:shadow-lg ${
              selectedZone?.id === 'vegetable'
                ? 'border-lime-700 ring-4 ring-lime-500/20 scale-[1.01]'
                : 'border-lime-500/40 hover:border-lime-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-white/80 rounded-xl text-lime-800 shadow-sm">
                  <Sprout className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-lime-950 uppercase tracking-wide">
                    🌱 VEGETABLE FIELD
                  </h4>
                  <p className="text-[11px] text-lime-900 font-medium">1.5 Acres • Tomato & Peppers</p>
                </div>
              </div>
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold text-[10px] rounded-full border border-emerald-300">
                Moisture: 58% (Optimal)
              </span>
            </div>

            <div className="flex items-end justify-between">
              <div className="text-[11px] text-lime-900 font-semibold bg-white/60 px-2.5 py-1 rounded-lg backdrop-blur-xs">
                Health: 88% • Trellis Staked
              </div>
              <span className="text-xs text-lime-900 font-bold flex items-center space-x-1 group-hover:translate-x-1 transition-transform">
                <span>Inspect Field</span>
                <Eye className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>

          {/* IoT Sensor & Weather Station */}
          <div
            onClick={() => setSelectedZone(zones.sensors)}
            className={`col-span-5 row-span-5 bg-gradient-to-br from-amber-50/90 to-orange-100/70 border-2 rounded-2xl p-3.5 cursor-pointer transition-all duration-300 flex flex-col justify-between group hover:shadow-lg ${
              selectedZone?.id === 'sensors'
                ? 'border-amber-600 ring-4 ring-amber-500/20 scale-[1.01]'
                : 'border-amber-400/40 hover:border-amber-600'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 bg-white/80 rounded-xl text-amber-600 shadow-sm">
                  <Radio className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-amber-950 uppercase">
                    📡 SENSOR ARRAY
                  </h4>
                  <p className="text-[10px] text-amber-800">4 Transceivers Active</p>
                </div>
              </div>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 sensor-pulse" />
            </div>

            <div className="text-[10px] text-amber-900 font-medium space-y-0.5">
              <div className="flex justify-between">
                <span>Ambient Temp:</span>
                <span className="font-bold">31°C</span>
              </div>
              <div className="flex justify-between">
                <span>Soil EC:</span>
                <span className="font-bold">0.45 dS/m</span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[11px] text-amber-800 font-bold flex items-center justify-end space-x-1 group-hover:translate-x-1 transition-transform">
                <span>View Signals</span>
                <Eye className="w-3 h-3" />
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Selected Zone Detail Card */}
      {selectedZone && (
        <div className="mt-4 p-4 rounded-2xl bg-cream border border-gray-200/80 animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-primary text-white shadow-sm">
                <CheckCircle2 className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900">{selectedZone.name}</h4>
                <p className="text-xs text-gray-500">
                  {selectedZone.type} • {selectedZone.area}
                </p>
              </div>
            </div>
            <button
              onClick={() => setSelectedZone(null)}
              className="text-xs text-gray-400 hover:text-gray-700 font-medium px-2 py-1 border border-gray-200 rounded-lg bg-white"
            >
              Close
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-3 border-t border-gray-200/60">
            <div>
              <p className="text-[10px] text-gray-500 uppercase font-semibold">Active Cultivar</p>
              <p className="text-xs font-bold text-gray-900 mt-0.5">{selectedZone.crop}</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-500 uppercase font-semibold">Soil Moisture</p>
              <p className={`text-xs font-bold mt-0.5 ${selectedZone.soilMoisture < 40 ? 'text-amber-600' : 'text-emerald-700'}`}>
                {selectedZone.soilMoisture}%
              </p>
            </div>
            <div>
              <p className="text-[10px] text-gray-500 uppercase font-semibold">Health Score</p>
              <p className="text-xs font-bold text-emerald-700 mt-0.5">{selectedZone.health}%</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-500 uppercase font-semibold">Status / Phase</p>
              <p className="text-xs font-bold text-gray-800 mt-0.5">{selectedZone.status}</p>
            </div>
          </div>

          <p className="mt-3 text-xs text-gray-600 bg-white/70 p-2.5 rounded-xl border border-gray-100 flex items-start space-x-2">
            <Info className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
            <span>{selectedZone.details}</span>
          </p>
        </div>
      )}
    </div>
  );
};
