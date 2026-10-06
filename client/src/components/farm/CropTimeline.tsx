import React from 'react';
import { GrowthStage } from '../../types';
import { Check, Clock } from 'lucide-react';

interface CropTimelineProps {
  currentStage: GrowthStage;
  plantingDate?: string;
  expectedHarvest?: string;
}

const STAGES: GrowthStage[] = [
  'Planting',
  'Germination',
  'Vegetative',
  'Flowering',
  'Fruiting',
  'Harvest',
];

export const CropTimeline: React.FC<CropTimelineProps> = ({
  currentStage,
  plantingDate,
  expectedHarvest,
}) => {
  const currentIndex = STAGES.indexOf(currentStage);

  return (
    <div className="w-full bg-white rounded-2xl p-5 border border-gray-100 shadow-soft">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
            Phenological Growth Lifecycle
          </h4>
          <p className="text-xs text-gray-500">
            Currently at: <span className="font-bold text-primary">{currentStage}</span> stage
          </p>
        </div>
        {plantingDate && expectedHarvest && (
          <div className="text-right text-[11px] text-gray-500 hidden sm:block">
            <span>Planted: {new Date(plantingDate).toLocaleDateString()}</span>
            <span className="mx-1.5">•</span>
            <span>Harvest: {new Date(expectedHarvest).toLocaleDateString()}</span>
          </div>
        )}
      </div>

      {/* Progress Track */}
      <div className="relative mt-6 mb-4">
        {/* Background line */}
        <div className="absolute top-1/2 left-0 right-0 h-1.5 -translate-y-1/2 bg-gray-200 rounded-full" />
        {/* Active line */}
        <div
          className="absolute top-1/2 left-0 h-1.5 -translate-y-1/2 bg-secondary rounded-full transition-all duration-500"
          style={{
            width: `${(Math.max(0, currentIndex) / (STAGES.length - 1)) * 100}%`,
          }}
        />

        {/* Stage Nodes */}
        <div className="relative flex justify-between">
          {STAGES.map((stage, idx) => {
            const isCompleted = idx < currentIndex;
            const isCurrent = idx === currentIndex;
            const isUpcoming = idx > currentIndex;

            return (
              <div key={stage} className="flex flex-col items-center">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    isCurrent
                      ? 'bg-primary text-white ring-4 ring-light-green scale-125 shadow-md'
                      : isCompleted
                      ? 'bg-secondary text-white'
                      : 'bg-white border-2 border-gray-300 text-gray-400'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-3.5 h-3.5" />
                  ) : isCurrent ? (
                    <Clock className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <span>{idx + 1}</span>
                  )}
                </div>
                <span
                  className={`text-[11px] mt-2 font-medium tracking-tight text-center ${
                    isCurrent
                      ? 'text-primary font-bold'
                      : isCompleted
                      ? 'text-gray-700 font-semibold'
                      : 'text-gray-400'
                  }`}
                >
                  {stage}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
