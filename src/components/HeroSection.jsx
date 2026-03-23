import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { getAqiInfo } from '../utils/aqiUtils';
import { Search, MapPin } from 'lucide-react';

const HeroSection = ({ 
  aqiData, 
  loading, 
  error, 
  locationName = 'Locating...', 
  searchQuery, 
  setSearchQuery, 
  handleSearch 
}) => {
  const containerRef = useRef(null);
  
  const aqiValue = aqiData?.current?.pollution?.aqius || 0;
  const aqiInfo = getAqiInfo(aqiValue);
  const displayAqi = loading ? '--' : aqiValue;

  useEffect(() => {
    if (containerRef.current && !loading) {
      gsap.fromTo(
        containerRef.current.querySelectorAll('.animate-enter'),
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out' }
      );
    }
  }, [loading, aqiValue]);

  return (
    <div ref={containerRef} className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-12">
      
      {/* Left Side */}
      <div className="flex flex-col gap-6 w-full max-w-xl">
        <div className="animate-enter flex items-center gap-2 text-zinc-400 font-medium bg-zinc-900/50 w-fit px-4 py-2 rounded-full border border-zinc-800">
          <MapPin size={18} className="text-emerald-400" />
          <span>{locationName}</span>
        </div>

        <h2 className="animate-enter text-5xl md:text-7xl font-extrabold tracking-tight leading-tight">
          Current <br/>Air Quality
        </h2>

        {/* AQI Big Display */}
        <div className="animate-enter flex items-end gap-4 mt-4">
          <div className={`text-8xl md:text-9xl font-black ${aqiInfo.text} leading-none tracking-tighter`}>
            {displayAqi}
          </div>
          <div className="pb-3 flex flex-col">
            <span className="text-xl font-bold text-zinc-300">AQI</span>
            <span className={`text-sm font-semibold px-2 py-1 rounded-md bg-zinc-900 border border-zinc-800 ${aqiInfo.text} mt-1 w-fit`}>
              {loading ? 'Analyzing...' : aqiInfo.label}
            </span>
          </div>
        </div>

        <p className="animate-enter text-lg text-zinc-400 max-w-lg mt-2 font-medium">
          {loading ? 'Fetching latest data from sensors...' : aqiInfo.message}
        </p>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="animate-enter relative flex items-center mt-6 w-full group">
          <Search size={20} className="absolute left-4 text-zinc-500 group-focus-within:text-emerald-400 transition-colors" />
          <input 
            type="text" 
            placeholder="Search by city (e.g., Makati)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-900/80 border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all font-medium"
          />
          <button type="submit" className="absolute right-2 px-6 py-2 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold rounded-xl transition-colors">
            Check AQI
          </button>
        </form>
        {error && <p className="animate-enter text-rose-500 text-sm">{error}</p>}
      </div>

      {/* Right Side 3D Placeholder */}
      <div className="animate-enter h-[500px] w-full bg-zinc-900/60 backdrop-blur-sm rounded-[2rem] border border-zinc-800/80 flex flex-col items-center justify-center relative overflow-hidden group shadow-2xl shadow-emerald-900/10">
        <div className={`absolute inset-0 bg-gradient-to-tr ${aqiInfo.color.replace('bg-', 'from-')}/10 to-transparent transition-colors duration-1000`}></div>
        
        {/* Decorative Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20"></div>

        <div className="z-10 bg-zinc-950/80 px-6 py-3 rounded-full border border-zinc-800 backdrop-blur-md">
          <p className="text-zinc-300 font-mono text-sm group-hover:text-emerald-400 transition-colors flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            3D Spline Scene Placeholder
          </p>
        </div>
        <p className="z-10 text-zinc-600 text-xs mt-4 mt-2 max-w-[200px] text-center">
          (Interactive Metro Manila map will be rendered here)
        </p>
      </div>
      
    </div>
  );
};

export default HeroSection;
