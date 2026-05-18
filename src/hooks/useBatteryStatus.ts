import { useState, useEffect } from 'react';

export function useBatteryStatus() {
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
  const [isCharging, setIsCharging] = useState<boolean | null>(null);

  useEffect(() => {
    // Check if the Battery Status API is available
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        const updateStatus = () => {
          setBatteryLevel(Math.round(battery.level * 100));
          setIsCharging(battery.charging);
        };

        updateStatus();

        battery.addEventListener('levelchange', updateStatus);
        battery.addEventListener('chargingchange', updateStatus);

        return () => {
          battery.removeEventListener('levelchange', updateStatus);
          battery.removeEventListener('chargingchange', updateStatus);
        };
      });
    }
  }, []);

  return { batteryLevel, isCharging };
}
