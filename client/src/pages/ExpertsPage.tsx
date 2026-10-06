import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  Star,
  MessageSquare,
  Sparkles,
  Calendar,
  Send,
  Upload,
  CheckCircle,
  Clock,
  User,
  X,
  Check,
} from 'lucide-react';
import { expertService } from '../services/expertService';
import { consultationService } from '../services/consultationService';
import { useAuth } from '../context/AuthContext';
import { Expert, Consultation } from '../types';
import { SkeletonLoader } from '../components/common/SkeletonLoader';

export const ExpertsPage: React.FC = () => {
  const { user } = useAuth();

  const [experts, setExperts] = useState<Expert[]>([]);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedExpert, setSelectedExpert] = useState<Expert | null>(null);

  // Form
  const [problemTitle, setProblemTitle] = useState('');
  const [category, setCategory] = useState<'Crop' | 'Soil' | 'Pest' | 'Irrigation' | 'Fertilizer'>('Crop');
  const [crop, setCrop] = useState(user?.primaryCrop || 'Cotton');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [expRes, consRes] = await Promise.allSettled([
        expertService.getExperts(),
        consultationService.getMyConsultations(),
      ]);

      if (expRes.status === 'fulfilled' && expRes.value.success) {
        setExperts(expRes.value.data);
      }
      if (consRes.status === 'fulfilled' && consRes.value.success) {
        setConsultations(consRes.value.data);
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

  const handleAskQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!problemTitle.trim() || !description.trim()) {
      alert('Please fill in problem title and description.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await consultationService.createConsultation({
        problemTitle,
        category,
        crop,
        description,
        expertId: selectedExpert ? selectedExpert._id : undefined,
      });

      if (res.success && res.data) {
        setToastMessage('✓ Advisory query submitted to scientist.');
        setProblemTitle('');
        setDescription('');
        setSelectedExpert(null);
        setTimeout(() => setToastMessage(''), 3000);
        await loadData();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error submitting question');
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
            <GraduationCap className="w-6 h-6 text-primary" />
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Agricultural Scientists & Advisory
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Directly ask agronomy specialists, soil chemists, entomologists, and irrigation engineers
          </p>
        </div>

        <a
          href="#ask-form"
          className="px-5 py-3 rounded-2xl bg-primary text-white font-bold text-xs sm:text-sm hover:bg-primary-dark transition-all flex items-center space-x-2 shadow-md shadow-primary/20"
        >
          <MessageSquare className="w-4 h-4 text-secondary" />
          <span>Ask a Question Now</span>
        </a>
      </div>

      {/* Expert Cards Grid */}
      <div>
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">
          Verified Extension Scientists & Specialists
        </h3>

        {isLoading ? (
          <SkeletonLoader rows={3} height="h-44" />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {experts.map((exp) => (
              <div
                key={exp._id}
                className="bg-white rounded-3xl p-6 border border-gray-100 shadow-soft hover:shadow-soft-lg transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start space-x-3.5 mb-4">
                    <img
                      src={exp.avatar}
                      alt={exp.name}
                      className="w-14 h-14 rounded-2xl object-cover border-2 border-primary/20 flex-shrink-0"
                    />
                    <div>
                      <h4 className="text-sm font-extrabold text-gray-900">{exp.name}</h4>
                      <p className="text-xs text-primary font-bold mt-0.5">{exp.specialization}</p>
                      <div className="flex items-center space-x-1 mt-1">
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                        <span className="text-xs font-bold text-gray-800">{exp.rating}</span>
                        <span className="text-[10px] text-gray-400">({exp.reviewsCount} reviews)</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                    {exp.bio}
                  </p>

                  <div className="mt-4 pt-3 border-t border-gray-100 grid grid-cols-2 gap-2 text-[11px] text-gray-600">
                    <div>
                      <span className="text-gray-400 block text-[10px]">Experience</span>
                      <strong className="text-gray-900">{exp.experienceYears} Years</strong>
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[10px]">Consultations</span>
                      <strong className="text-gray-900">{exp.consultationsDone}+</strong>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-gray-100 flex items-center space-x-2">
                  <a
                    href="#ask-form"
                    onClick={() => setSelectedExpert(exp)}
                    className="flex-1 py-2 px-3 text-center rounded-xl bg-light-green text-primary hover:bg-primary hover:text-white font-bold text-xs transition-colors shadow-xs"
                  >
                    Ask Question
                  </a>
                  <button
                    onClick={() => {
                      setSelectedExpert(exp);
                      alert(`Consultation booked with ${exp.name}. You can submit your problem description below.`);
                    }}
                    className="flex-1 py-2 px-3 text-center rounded-xl bg-cream hover:bg-gray-100 text-gray-700 font-bold text-xs border border-gray-200 transition-colors"
                  >
                    Book Call
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Ask an Agriculture Expert Form */}
      <div id="ask-form" className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-100 shadow-soft">
        <div className="max-w-2xl mb-6">
          <div className="flex items-center space-x-2 text-xs font-bold text-primary uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4 text-secondary" />
            <span>Kisan Tele-Consultation Form</span>
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
            Ask an Agriculture Expert
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            {selectedExpert
              ? `Direct query assigned to: ${selectedExpert.name} (${selectedExpert.specialization})`
              : 'Submit detailed crop symptoms to receive verified University advisory solutions within 24 hours.'}
          </p>
        </div>

        <form onSubmit={handleAskQuestion} className="space-y-4 max-w-3xl">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase">
              Problem Title / Subject *
            </label>
            <input
              type="text"
              required
              value={problemTitle}
              onChange={(e) => setProblemTitle(e.target.value)}
              placeholder="e.g. Yellowing and crinkling observed on upper Bt cotton leaves"
              className="mt-1.5 w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-gray-200 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase">
                Advisory Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="mt-1.5 w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-gray-200 bg-white outline-none focus:border-primary font-medium"
              >
                <option value="Crop">Crop (પાક)</option>
                <option value="Soil">Soil (જમીન)</option>
                <option value="Pest">Pest & Disease (રોગ અને જીવાત)</option>
                <option value="Irrigation">Irrigation (પિયત)</option>
                <option value="Fertilizer">Fertilizer (ખાતર)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase">
                Affected Crop *
              </label>
              <input
                type="text"
                required
                value={crop}
                onChange={(e) => setCrop(e.target.value)}
                placeholder="e.g. Cotton, Groundnut, Tomato"
                className="mt-1.5 w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-gray-200 outline-none focus:border-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase">
              Detailed Field Symptoms & Query Description *
            </label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe when the symptoms started, current weather conditions, watering frequency, and any previous chemical sprays used..."
              className="mt-1.5 w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-gray-200 outline-none focus:border-primary font-medium"
            />
          </div>

          <div className="p-4 border-2 border-dashed border-gray-200 rounded-2xl bg-cream text-center">
            <Upload className="w-6 h-6 text-gray-400 mx-auto mb-1" />
            <p className="text-xs font-bold text-gray-700">Attach Leaf / Soil Image (Optional)</p>
            <p className="text-[11px] text-gray-400 mt-0.5">High-resolution closeups help scientists diagnose faster</p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="py-3 px-6 rounded-xl bg-primary text-white font-bold text-xs sm:text-sm hover:bg-primary-dark transition-all shadow-md shadow-primary/20 flex items-center space-x-2 disabled:opacity-50"
          >
            <Send className="w-4 h-4 text-secondary" />
            <span>{isSubmitting ? 'Submitting Question...' : 'Submit Question to Expert'}</span>
          </button>
        </form>
      </div>

      {/* Consultation History */}
      {consultations.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
            My Advisory Questions & Responses ({consultations.length})
          </h3>

          <div className="space-y-4">
            {consultations.map((c) => (
              <div
                key={c._id}
                className="bg-white rounded-3xl p-6 border border-gray-100 shadow-soft space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-light-green text-primary">
                      {c.category}
                    </span>
                    <span className="text-xs font-semibold text-gray-500">• Crop: {c.crop}</span>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                      c.status === 'Answered'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {c.status}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-gray-900">{c.problemTitle}</h4>
                <p className="text-xs text-gray-600 leading-relaxed">{c.description}</p>

                {c.expertReply && (
                  <div className="mt-3 p-4 rounded-2xl bg-cream border border-gray-200/80 space-y-2">
                    <div className="flex items-center space-x-2">
                      <GraduationCap className="w-4 h-4 text-primary" />
                      <span className="text-xs font-bold text-gray-900">
                        {c.expertReply.expertName}
                      </span>
                      <span className="text-[10px] text-gray-400">
                        • {new Date(c.expertReply.repliedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs text-gray-700 leading-relaxed">
                      {c.expertReply.advice}
                    </p>
                    {c.expertReply.suggestedTreatment && (
                      <div className="pt-2 border-t border-gray-200/60 text-xs">
                        <span className="font-bold text-primary">Suggested Treatment: </span>
                        <span className="text-gray-800">{c.expertReply.suggestedTreatment}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
