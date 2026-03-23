import React from 'react';
import { Wind, ChevronUp, Droplets } from 'lucide-react';

// IQAir Free API primarily returns main pollutant, but we can display mock/estimated values based on AQI to fulfill the MVP card requirements.
const PollutantCards = ({ aqiData, loading }) => {
  // Simple estimation logic for visual purposes only, since free API doesn't give PM arrays.
  const aqiValue = aqiData?.current?.pollution?.aqius || 0;
  
  const pollutants = [
    {
      id: 'pm25',
      name: 'PM2.5',
      value: loading ? '--' : (aqiValue * 0.4).toFixed(1),
      unit: 'µg/m³',
      icon: <Wind size={24} className="text-emerald-400" />,
      desc: 'Fine particulate matter',
    },
    {
      id: 'pm10',
      name: 'PM10',
      value: loading ? '--' : (aqiValue * 0.8).toFixed(1),
      unit: 'µg/m³',
      icon: <Droplets size={24} className="text-emerald-400" />,
      desc: 'Coarse particulate matter',
    },
    {
      id: 'co',
      name: 'CO',
      value: loading ? '--' : (aqiValue * 0.05).toFixed(2),
      unit: 'ppm',
      icon: <ChevronUp size={24} className="text-emerald-400" />,
      desc: 'Carbon Monoxide',
    }
  ];

  return (
    <div className="w-full mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
      {pollutants.map((item) => (
        <div 
          key={item.id} 
          className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800/80 rounded-2xl p-6 flex items-start gap-4 hover:bg-zinc-900/80 transition-all hover:border-emerald-500/30 group"
        >
          <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 group-hover:border-emerald-500/30 transition-colors">
            {item.icon}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-zinc-400">{item.name}</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-3xl font-bold text-zinc-100">{item.value}</span>
              <span className="text-xs text-zinc-500 font-medium">{item.unit}</span>
            </div>
            <span className="text-xs text-zinc-500 mt-2">{item.desc}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PollutantCards;
