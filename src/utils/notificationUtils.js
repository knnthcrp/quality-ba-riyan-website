export const requestNotificationPermission = async () => {
  if (!('Notification' in window)) {
    console.warn('This browser does not support desktop notification');
    return false;
  }
  
  if (Notification.permission === 'granted') {
    return true;
  }
  
  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }
  
  return false;
};

export const sendAqiNotification = (aqiValue, city) => {
  // Only alert if Unhealthy (AQI > 100)
  if (Notification.permission === 'granted' && aqiValue > 100) {
    const text = `Caution! The AQI in ${city} has reached ${aqiValue}. Limit outdoor activities.`;
    new Notification('Quality ba riyan Alert', {
      body: text,
      icon: '/vite.svg', // Placeholder
    });
  }
};
