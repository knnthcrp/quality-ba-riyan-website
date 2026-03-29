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
  searchError,
  isSearching,
  locationName = 'Locating...',
  searchQuery,
  setSearchQuery,
  handleSearch,
  triggerSearch,
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
    // Use triggerSearch from hook for validated, consistent search
    if (triggerSearch) {
      triggerSearch(cityName);
    } else {
      setSearchQuery(cityName);
      setTimeout(() => {
        const form = document.querySelector('form');
        if (form) form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
      }, 50);
    }
  };

  return (
    <div ref={containerRef} className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center pt-0 pb-12">

      {/* Left Side */}
      <div className="flex flex-col gap-4 w-full max-w-xl">
        {/* Location pill */}
        <div
          className="animate-enter flex items-center gap-2 text-zinc-400 font-medium bg-zinc-900/50 w-fit px-4 py-2 rounded-full border border-zinc-800"
          aria-label={`Current location: ${locationName}`}
        >
          <MapPin size={18} className="text-emerald-400" aria-hidden="true" />
          <span>{locationName}</span>
        </div>

        <h2 className="animate-enter text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
          Current Air Quality
        </h2>

        {/* AQI Big Display — role=status so screen readers announce updates */}
        <div
          className="animate-enter flex items-end gap-3 mt-2"
          role="status"
          aria-live="polite"
          aria-atomic="true"
          aria-label={loading ? 'Loading air quality data' : aqiInfo.ariaLabel(aqiValue)}
        >
          <div
            className={`text-8xl md:text-9xl font-black ${aqiInfo.text} leading-none tracking-tighter`}
            aria-hidden="true" /* number spoken via parent aria-label */
          >
            {displayAqi}
          </div>
          <div className="pb-3 flex flex-col">
            <span className="text-xl font-bold text-zinc-300" aria-hidden="true">AQI</span>
            {/* Label badge: icon + text so meaning survives color-blindness */}
            <span className={`inline-flex items-center gap-1 text-sm font-semibold px-2 py-1 rounded-md bg-zinc-900 border ${aqiInfo.border} ${aqiInfo.text} mt-1 w-fit`}>
              {!loading && <span aria-hidden="true">{aqiInfo.icon}</span>}
              {loading ? 'Analyzing…' : aqiInfo.label}
            </span>
          </div>
        </div>

        <p className="animate-enter text-base text-zinc-400 max-w-lg mt-1 font-medium italic" aria-hidden="true">
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
        <form onSubmit={handleSearch} className="animate-enter relative flex items-center mt-4 w-full group" noValidate>
          <Search size={20} className="absolute left-4 text-zinc-500 group-focus-within:text-emerald-400 transition-colors" />
          <input
            type="text"
            placeholder="Search by city (e.g., Makati)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            disabled={isSearching}
            aria-label="Search city AQI"
            aria-describedby={searchError ? 'search-error' : undefined}
            className={`w-full bg-zinc-900/80 border rounded-2xl py-4 pl-12 pr-32 text-zinc-100 placeholder:text-zinc-600 focus:outline-none transition-all font-medium disabled:opacity-60 disabled:cursor-not-allowed ${searchError
              ? 'border-rose-500/60 focus:border-rose-500/60 focus:ring-1 focus:ring-rose-500/40'
              : 'border-zinc-800 focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50'
              }`}
          />
          <button
            type="submit"
            disabled={isSearching || loading}
            aria-label={isSearching ? 'Searching, please wait' : 'Check air quality for entered city'}
            className="absolute right-2 px-5 py-2 bg-emerald-500 hover:bg-emerald-400 disabled:bg-zinc-700 disabled:cursor-not-allowed text-zinc-950 disabled:text-zinc-500 font-bold rounded-xl transition-colors flex items-center gap-2 min-w-[90px] justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
          >
            {isSearching ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                <span>Searching</span>
              </>
            ) : (
              <span>Check AQI</span>
            )}
          </button>
        </form>

        {/* Inline feedback: search error or global error */}
        {(searchError || error) && (
          <div
            id="search-error"
            role="alert"
            className="animate-enter flex items-start gap-2 text-rose-400 text-sm bg-rose-500/10 border border-rose-500/20 rounded-xl px-4 py-3 mt-1"
          >
            <svg className="shrink-0 mt-0.5" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>{searchError || error}</span>
          </div>
        )}
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
