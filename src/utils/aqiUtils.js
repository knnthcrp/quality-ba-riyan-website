export const getAqiInfo = (aqi) => {
  if (aqi <= 50) return { label: 'Good', color: 'bg-emerald-500', text: 'text-emerald-500',  message: 'Air quality is excellent — perfect time for outdoor activities!' };
  if (aqi <= 100) return { label: 'Moderate', color: 'bg-yellow-400', text: 'text-yellow-400', message: 'Air quality is acceptable — safe for most people.' };
  if (aqi <= 150) return { label: 'Unhealthy for Sensitive Groups', color: 'bg-orange-500', text: 'text-orange-500', message: 'Sensitive individuals may experience health effects. General public is not likely to be affected.' };
  if (aqi <= 200) return { label: 'Unhealthy', color: 'bg-red-500', text: 'text-red-500', message: 'Everyone may begin to experience health effects; members of sensitive groups may experience more serious health effects.' };
  if (aqi <= 300) return { label: 'Very Unhealthy', color: 'bg-purple-500', text: 'text-purple-500', message: 'Health warnings of emergency conditions. The entire population is more likely to be affected.' };
  return { label: 'Hazardous', color: 'bg-rose-900', text: 'text-rose-900', message: 'Health alert: everyone may experience more serious health effects.' };
};
