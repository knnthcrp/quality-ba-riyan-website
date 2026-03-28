import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { getAqiInfo } from '../utils/aqiUtils';
import { Search, MapPin, Clock } from 'lucide-react';
import { formatRelativeTime } from '../utils/timeUtils';
import MetroManilaMap3D from './MetroManilaMap3D';

const HeroSection = ({
  aqiData,
  loading,
  error,
  locationName = 'Locating...',
  searchQuery,
  setSearchQuery,
  handleSearch,
  lastUpdated
}) => {
  const containerRef = useRef(null);
  const [tick, setTick] = React.useState(0);

  // Auto-update relative time every minute
  useEffect(() => {
    if (!lastUpdated) return;
    
    const interval = setInterval(() => {
      setTick(t => t + 1);
    }, 60000);
    
    return () => clearInterval(interval);
  }, [lastUpdated]);

  // Support both standardized backend format and raw IQAir format
  const aqiValue = aqiData?.aqi ?? aqiData?.current?.pollution?.aqius ?? 0;
  const aqiInfo = getAqiInfo(aqiValue);
  const displayAqi = loading ? '--' : aqiValue;

  useEffect(() => {
    if (containerRef.current && !loading) {
      // Animate the left side text
      gsap.fromTo(
        containerRef.current.querySelectorAll('.animate-enter'),
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out' }
      );
    }
  }, [loading, aqiValue]);

  const onCitySelect = (cityName) => {
    setSearchQuery(cityName);
    // Trigger search after a slight delay for state update
    setTimeout(() => {
      const form = document.querySelector('form');
      if (form) {
        form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
      }
    }, 50);
  };

  return (
    <div ref={containerRef} className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center pt-0 pb-12">

      {/* Left Side */}
      <div className="flex flex-col gap-4 w-full max-w-xl">
        <div className="animate-enter flex items-center gap-2 text-zinc-400 font-medium bg-zinc-900/50 w-fit px-4 py-2 rounded-full border border-zinc-800">
          <MapPin size={18} className="text-emerald-400" />
          <span>{locationName}</span>
        </div>

        <h2 className="animate-enter text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
          Current Air Quality
        </h2>

        {/* AQI Big Display */}
        <div className="animate-enter flex items-end gap-3 mt-2">
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

        <p className="animate-enter text-base text-zinc-400 max-w-lg mt-1 font-medium italic">
          {loading ? 'Fetching latest data from sensors...' : aqiInfo.message}
        </p>

        {/* Last Updated & Source Attribution */}
        {!loading && lastUpdated && (
          <div className="animate-enter flex flex-col gap-1.5 mt-2">
            <div className="flex items-center gap-1.5 text-zinc-500 text-sm">
              <Clock size={14} />
              <span>Last updated: {formatRelativeTime(lastUpdated)}</span>
            </div>
            <div className="text-xs text-zinc-600 font-medium">
              Source: IQAir AirVisual API
            </div>
          </div>
        )}

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="animate-enter relative flex items-center mt-4 w-full group">
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

      {/* Right Side Interactive 2.5D Map */}
      <div className="animate-enter h-[600px] w-full bg-zinc-900/40 rounded-[3rem] border border-zinc-800/80 relative group shadow-2xl shadow-emerald-950/20 hidden lg:flex items-center justify-center">
        {/* Dynamic Glow Background */}
        <div className={`absolute inset-0 bg-gradient-to-tr ${aqiInfo.color.replace('bg-', 'from-')}/5 to-transparent transition-colors duration-1000 pointer-events-none rounded-[3rem]`}></div>
        
        {/* 2.5D Map Component */}
        <div className="w-full h-full flex items-center justify-center">
          <MetroManilaMap3D onCitySelect={onCitySelect} selectedCityName={locationName} />
        </div>
      </div>

    </div>
  );
};

export default HeroSection;
