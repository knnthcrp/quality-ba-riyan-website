import React from 'react';
import { Wind, ChevronUp, Droplets } from 'lucide-react';

const PollutantCards = ({ aqiData, loading }) => {
  const aqiValue = aqiData?.aqi ?? aqiData?.current?.pollution?.aqius ?? 0;

  const pollutants = [
    {
      id: 'pm25',
      name: 'PM2.5',
      value: loading ? '--' : (aqiData?.pollutants?.pm2_5 ?? (aqiValue * 0.4).toFixed(1)),
      unit: 'µg/m³',
      icon: <Wind size={24} className="text-emerald-400" aria-hidden="true" />,
      desc: 'Fine particulate matter',
    },
    {
      id: 'pm10',
      name: 'PM10',
      value: loading ? '--' : (aqiData?.pollutants?.pm10 ?? (aqiValue * 0.8).toFixed(1)),
      unit: 'µg/m³',
      icon: <Droplets size={24} className="text-emerald-400" aria-hidden="true" />,
      desc: 'Coarse particulate matter',
    },
    {
      id: 'co',
      name: 'CO',
      value: loading ? '--' : (aqiData?.pollutants?.co ?? (aqiValue * 0.05).toFixed(2)),
      unit: 'ppm',
      icon: <ChevronUp size={24} className="text-emerald-400" aria-hidden="true" />,
      desc: 'Carbon Monoxide',
    }
  ];

  return (
    // region role gives screen readers a landmark for the pollutant section
    <section
      aria-label="Pollutant levels"
      className="w-full mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
    >
      {pollutants.map((item) => (
        <article
          key={item.id}
          aria-label={`${item.desc}: ${item.value} ${item.unit}`}
          className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800/80 rounded-2xl p-6 flex items-start gap-4 hover:bg-zinc-900/80 transition-all hover:border-emerald-500/30 group"
        >
          <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 group-hover:border-emerald-500/30 transition-colors">
            {item.icon}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-zinc-400">{item.name}</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-3xl font-bold text-zinc-100">{item.value}</span>
              <span className="text-xs text-zinc-500 font-medium" aria-label={item.unit}>{item.unit}</span>
            </div>
            <span className="text-xs text-zinc-500 mt-2">{item.desc}</span>
          </div>
        </article>
      ))}
    </section>
  );
};

export default PollutantCards;
