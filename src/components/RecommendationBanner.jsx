import React from 'react';
import { getAqiInfo } from '../utils/aqiUtils';
import { ShieldAlert, ShieldCheck } from 'lucide-react';

const RecommendationBanner = ({ aqiData, loading }) => {
  if (loading) return null;

  const aqiValue = aqiData?.aqi ?? aqiData?.current?.pollution?.aqius ?? 0;
  const info = getAqiInfo(aqiValue);
  const isGood = aqiValue <= 50;

  return (
    <section
      aria-label="Health recommendation"
      aria-live="polite"
      className={`mt-8 w-full bg-zinc-900/60 backdrop-blur-sm border ${info.border} rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6 transition-colors duration-1000 shadow-lg`}
    >
      <div className="flex items-center gap-4">
        <div className={`p-4 rounded-full bg-zinc-800/80 border ${info.border}`} aria-hidden="true">
          {isGood
            ? <ShieldCheck size={32} className={info.text} aria-hidden="true" />
            : <ShieldAlert size={32} className={info.text} aria-hidden="true" />
          }
        </div>
        <div className="flex flex-col">
          {/* Icon + label so meaning isn't color-only */}
          <h3 className={`text-xl font-bold ${info.text} flex items-center gap-2`}>
            <span aria-hidden="true">{info.icon}</span>
            Health Recommendation
          </h3>
          <p className="text-zinc-300 font-medium mt-1">{info.message}</p>
        </div>
      </div>

      {!isGood && (
        <button
          className={`px-6 py-3 rounded-xl font-bold border ${info.border} ${info.text} bg-zinc-800/80 hover:bg-zinc-700/80 transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950`}
          aria-label="View safety guidelines for current air quality level"
        >
          View Safety Guidelines
        </button>
      )}
    </section>
  );
};

export default RecommendationBanner;
