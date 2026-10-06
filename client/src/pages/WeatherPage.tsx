import React, { useState, useEffect } from 'react';
import {
  CloudSun,
  Droplets,
  Wind,
  Sun,
  Sunrise,
  Sunset,
  AlertTriangle,
  MapPin,
  Calendar,
  CloudRain,
  ShieldAlert,
  Search,
} from 'lucide-react';
import { weatherService } from '../services/weatherService';
import { WeatherData } from '../types';
import { SkeletonLoader } from '../components/common/SkeletonLoader';

export const WeatherPage: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [district, setDistrict] = useState('Ahmedabad');
  const [searchTerm, setSearchTerm] = useState('Ahmedabad');
  const [isLoading, setIsLoading] = useState(true);

  const fetchWeather = async (targetDistrict: string) => {
    try {
      setIsLoading(true);
      const res = await weatherService.getWeather(targetDistrict);
      if (res.success && res.data) {
        setWeather(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather(district);
  }, [district]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setDistrict(searchTerm.trim());
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white rounded-3xl p-6 border border-gray-100 shadow-soft">
        <div>
          <div className="flex items-center space-x-2">
            <CloudSun className="w-6 h-6 text-sky-600" />
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Agrometeorology & Weather Advisory
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Real-time weather station readings, rainfall probabilities, and agronomic warnings
          </p>
        </div>

        {/* District Switcher */}
        <form onSubmit={handleSearch} className="flex items-center space-x-2">
          <div className="relative">
            <MapPin className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search district e.g. Rajkot"
              className="pl-9 pr-3 py-2 text-xs rounded-xl border border-gray-200 outline-none focus:border-primary w-48 sm:w-56"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary-dark transition-colors shadow-xs"
          >
            Update
          </button>
        </form>
      </div>

      {isLoading ? (
        <SkeletonLoader rows={4} height="h-28" />
      ) : weather ? (
        <>
          {/* Current Weather Big Card */}
          <div className="bg-gradient-to-br from-emerald-800 to-primary-dark rounded-3xl p-8 text-white shadow-soft-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 -translate-y-8 translate-x-8 w-96 h-96 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              <div className="md:col-span-6 space-y-2">
                <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/10 text-secondary text-xs font-bold uppercase tracking-wider">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{weather.district}, {weather.state}</span>
                </div>
                <div className="flex items-baseline space-x-4 pt-1">
                  <span className="text-6xl sm:text-7xl font-black tracking-tight font-sans">
                    {weather.temperature}°C
                  </span>
                  <div>
                    <span className="text-3xl">{weather.conditionIcon}</span>
                    <p className="text-lg font-bold text-emerald-100">{weather.condition}</p>
                  </div>
                </div>
                <p className="text-xs text-emerald-200 max-w-md pt-1">
                  Optimal conditions for crop spraying and field tillage until tomorrow morning.
                </p>
              </div>

              {/* 6 Core Param Grid */}
              <div className="md:col-span-6 grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10">
                  <div className="flex items-center space-x-2 text-emerald-300 text-xs">
                    <Droplets className="w-4 h-4" />
                    <span>Humidity</span>
                  </div>
                  <p className="text-lg font-black mt-1">{weather.humidity}%</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10">
                  <div className="flex items-center space-x-2 text-emerald-300 text-xs">
                    <Wind className="w-4 h-4" />
                    <span>Wind Speed</span>
                  </div>
                  <p className="text-lg font-black mt-1">{weather.windSpeed} km/h</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10">
                  <div className="flex items-center space-x-2 text-emerald-300 text-xs">
                    <CloudRain className="w-4 h-4" />
                    <span>Rain Prob.</span>
                  </div>
                  <p className="text-lg font-black mt-1">{weather.rainProbability}%</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10">
                  <div className="flex items-center space-x-2 text-emerald-300 text-xs">
                    <Sun className="w-4 h-4" />
                    <span>UV Index</span>
                  </div>
                  <p className="text-lg font-black mt-1">{weather.uvIndex} (Very High)</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10">
                  <div className="flex items-center space-x-2 text-emerald-300 text-xs">
                    <Sunrise className="w-4 h-4" />
                    <span>Sunrise</span>
                  </div>
                  <p className="text-sm font-black mt-1">{weather.sunrise}</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10">
                  <div className="flex items-center space-x-2 text-emerald-300 text-xs">
                    <Sunset className="w-4 h-4" />
                    <span>Sunset</span>
                  </div>
                  <p className="text-sm font-black mt-1">{weather.sunset}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Agricultural Weather Alerts */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3 flex items-center space-x-2">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              <span>Agrometeorological Advisories & Warnings</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {weather.alerts && weather.alerts.length > 0 ? (
                weather.alerts.map((alert, idx) => (
                  <div
                    key={idx}
                    className={`p-5 rounded-3xl border shadow-soft flex items-start space-x-4 ${
                      alert.type === 'warning'
                        ? 'bg-amber-50/80 border-amber-200 text-amber-950'
                        : alert.type === 'danger'
                        ? 'bg-rose-50/80 border-rose-200 text-rose-950'
                        : 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                    }`}
                  >
                    <div className="p-2.5 rounded-2xl bg-white shadow-xs flex-shrink-0">
                      <AlertTriangle className={`w-5 h-5 ${
                        alert.type === 'warning' ? 'text-amber-600' : alert.type === 'danger' ? 'text-rose-600' : 'text-emerald-600'
                      }`} />
                    </div>
                    <div>
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-extrabold">{alert.title}</h4>
                        <span className="text-[10px] font-semibold opacity-75">
                          {alert.validUntil}
                        </span>
                      </div>
                      <p className="text-xs mt-1.5 opacity-90 leading-relaxed">
                        {alert.description}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 rounded-2xl bg-white border border-gray-100 text-xs text-gray-500">
                  No active weather warnings. Conditions are favorable for normal farming operations.
                </div>
              )}
            </div>
          </div>

          {/* 7-Day Forecast */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-soft">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-base font-bold text-gray-900">
                  7-Day Agrometeorological Forecast
                </h3>
                <p className="text-xs text-gray-500">
                  Designed for scheduling sowing, irrigations, and post-harvest drying
                </p>
              </div>
              <Calendar className="w-5 h-5 text-gray-400" />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
              {weather.forecast.map((f, i) => (
                <div
                  key={i}
                  className="p-4 rounded-2xl bg-cream border border-gray-100 text-center hover:border-primary/40 transition-colors flex flex-col justify-between"
                >
                  <div>
                    <p className="text-xs font-bold text-gray-800">{f.day}</p>
                    <p className="text-[10px] text-gray-400">{f.date}</p>
                    <div className="my-3 text-3xl">{f.icon}</div>
                    <p className="text-sm font-extrabold text-gray-900">{f.tempMax}°C</p>
                    <p className="text-xs text-gray-400 font-medium">{f.tempMin}°C</p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-gray-200/60">
                    <p className="text-[10px] font-bold text-sky-700">
                      💧 {f.rainProb}% Rain
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
};
