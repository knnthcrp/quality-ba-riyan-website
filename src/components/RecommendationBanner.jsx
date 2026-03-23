import React from 'react';
import { getAqiInfo } from '../utils/aqiUtils';
import { ShieldAlert, ShieldCheck } from 'lucide-react';

const RecommendationBanner = ({ aqiData, loading }) => {
  if (loading) return null;

  const aqiValue = aqiData?.current?.pollution?.aqius || 0;
  const info = getAqiInfo(aqiValue);
  
  const isGood = aqiValue <= 50;

  return (
    <div className={`mt-8 w-full ${info.color.replace('bg-', 'bg-').replace('500', '500/10')} border ${info.color.replace('bg-', 'border-').replace('500', '500/30')} rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6 transition-colors duration-1000`}>
      <div className="flex items-center gap-4">
        <div className={`p-4 rounded-full ${info.color.replace('bg-', 'bg-').replace('500', '500/20')}`}>
          {isGood ? <ShieldCheck size={32} className={info.text} /> : <ShieldAlert size={32} className={info.text} />}
        </div>
        <div className="flex flex-col">
          <h3 className={`text-xl font-bold ${info.text}`}>Health Recommendation</h3>
          <p className="text-zinc-300 font-medium mt-1">{info.message}</p>
        </div>
      </div>
      {!isGood && (
        <button className={`px-6 py-3 rounded-xl font-bold text-zinc-950 ${info.color} hover:opacity-90 transition-opacity whitespace-nowrap`}>
          View Safety Guidelines
        </button>
      )}
    </div>
  );
};

export default RecommendationBanner;
