import React, { useState, useEffect } from 'react';
import SmoothScroll from './components/SmoothScroll';
import useGeolocation from './hooks/useGeolocation';
import HeroSection from './components/HeroSection';
import PollutantCards from './components/PollutantCards';
import RecommendationBanner from './components/RecommendationBanner';
import { getNearestCityData, getCityDataByName } from './services/iqairService';
import { requestNotificationPermission, sendAqiNotification } from './utils/notificationUtils';
import { Bell, BellOff } from 'lucide-react';

function App() {
  const { location, error: geoError, loading: geoLoading } = useGeolocation();
  
  const [aqiData, setAqiData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [locationName, setLocationName] = useState('Locating...');
  const [searchQuery, setSearchQuery] = useState('');
  const [lastUpdated, setLastUpdated] = useState(null);
  
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  // Fetch nearest city data based on geolocation
  useEffect(() => {
    const fetchLocalData = async () => {
      if (location) {
        setLoading(true);
        setError(null);
        try {
          const data = await getNearestCityData(location.lat, location.lon);
          setAqiData(data);
          setLocationName(data.city);
          setLastUpdated(new Date());
        } catch (err) {
          setError('Failed to fetch local AQI data. API key may be pending or rate limit exceeded.');
        } finally {
          setLoading(false);
        }
      } else if (!geoLoading && geoError) {
        // If geolocation fails or user denies, default to Manila
        setLoading(true);
        try {
          const data = await getCityDataByName('Manila');
          setAqiData(data);
          setLocationName(`${data.city}, ${data.state} (Default)`);
          setLastUpdated(new Date());
        } catch (err) {
          setError('Failed to fetch default City AQI data.');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchLocalData();
  }, [location, geoError, geoLoading]);

  // Notifications logic
  useEffect(() => {
    // Check current permission on load
    if ('Notification' in window && Notification.permission === 'granted') {
      setNotificationsEnabled(true);
    }
  }, []);

  useEffect(() => {
    if (notificationsEnabled && aqiData) {
      const aqiValue = aqiData?.aqi ?? aqiData?.current?.pollution?.aqius ?? 0;
      sendAqiNotification(aqiValue, aqiData.city);
    }
    
    // Set up interval check (e.g. every 1 hour = 3600000ms)
    // For MVP demonstration, simulated as 1 hr.
    const interval = setInterval(() => {
      if (notificationsEnabled && aqiData) {
        const aqiValue = aqiData?.aqi ?? aqiData.current?.pollution?.aqius ?? 0;
        sendAqiNotification(aqiValue, aqiData.city);
      }
    }, 3600000);

    return () => clearInterval(interval);
  }, [aqiData, notificationsEnabled]);

  const handleToggleNotifications = async () => {
    if (!notificationsEnabled) {
      const granted = await requestNotificationPermission();
      setNotificationsEnabled(granted);
      if (granted && aqiData) {
         const aqiValue = aqiData?.aqi ?? aqiData.current?.pollution?.aqius ?? 0;
         sendAqiNotification(aqiValue, aqiData.city);
      }
    } else {
      setNotificationsEnabled(false);
      // Note: we can't 'revoke' permission in browser, just stop sending them.
    }
  };

  // Handle Search Functionality
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const data = await getCityDataByName(searchQuery);
      setAqiData(data);
      setLocationName(data.city);
      setLastUpdated(new Date());
    } catch (err) {
      setError(`Could not find air quality data for "${searchQuery}". Ensure it's a valid PH city.`);
    } finally {
      setLoading(false);
      setSearchQuery('');
    }
  };

  return (
    <SmoothScroll>
      <div className="min-h-screen bg-zinc-950 text-slate-50 flex flex-col font-sans selection:bg-emerald-500/30">
        
        {/* Navbar */}
        <header className="w-full py-4 px-8 flex justify-between items-center bg-zinc-950/80 backdrop-blur-md sticky top-0 z-50 border-b border-zinc-800/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.5)]">
              <div className="w-3 h-3 bg-zinc-950 rounded-full animate-pulse"></div>
            </div>
            <h1 className="text-xl font-bold tracking-tight">Quality ba riyan?</h1>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-zinc-400">
            <a href="#" className="hover:text-emerald-400 transition-colors">Dashboard</a>
            <button 
              onClick={handleToggleNotifications}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-colors ${notificationsEnabled ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400' : 'border-zinc-800 hover:border-zinc-700'}`}
              title="Toggle AQI > 100 Alerts"
            >
              {notificationsEnabled ? <Bell size={16} /> : <BellOff size={16} />}
              <span>Alerts</span>
            </button>
          </nav>
        </header>

        {/* Main Content */}
        <main className="flex-grow flex flex-col px-4 sm:px-8 pt-8 md:pt-12 pb-4 max-w-7xl mx-auto w-full relative">
          
          <HeroSection 
            aqiData={aqiData}
            loading={loading || geoLoading}
            error={error}
            locationName={locationName}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            handleSearch={handleSearch}
            lastUpdated={lastUpdated}
          />

          <RecommendationBanner 
            aqiData={aqiData} 
            loading={loading || geoLoading} 
          />

          <PollutantCards 
            aqiData={aqiData} 
            loading={loading || geoLoading} 
          />
          
        </main>

        {/* Footer */}
        <footer className="w-full py-8 text-center text-zinc-600 text-sm mt-auto border-t border-zinc-800/50">
          <p>Mockup built for Quality Ba Riyan (QBR) MVP. Data fetching via IQAir API.</p>
        </footer>

      </div>
    </SmoothScroll>
  );
}

export default App;
