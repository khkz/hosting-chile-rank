import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Users } from 'lucide-react';

interface Activity {
  id: string;
  name: string;
  city: string;
  provider: string;
  minutesAgo: number;
}

const CITIES = ['Santiago', 'Valparaíso', 'Concepción', 'La Serena', 'Antofagasta', 'Temuco', 'Viña del Mar', 'Rancagua'];
const NAMES = ['Juan', 'María', 'Carlos', 'Ana', 'Pedro', 'Francisca', 'Diego', 'Camila', 'Andrés', 'Valentina'];
const PROVIDERS = ['HostingPlus', 'EcoHosting', 'HostGator', 'HostName'];

const generateActivity = (): Activity => ({
  id: Math.random().toString(36).substr(2, 9),
  name: NAMES[Math.floor(Math.random() * NAMES.length)],
  city: CITIES[Math.floor(Math.random() * CITIES.length)],
  provider: PROVIDERS[Math.floor(Math.random() * PROVIDERS.length)],
  minutesAgo: Math.floor(Math.random() * 45) + 1
});

const SocialProofFeed = () => {
  const [activities, setActivities] = useState<Activity[]>([
    generateActivity(),
    generateActivity(),
    generateActivity()
  ]);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let showTimeout: NodeJS.Timeout;
    let hideTimeout: NodeJS.Timeout;
    let activityInterval: NodeJS.Timeout;

    const startVisibilityCycle = () => {
      setVisible(true);
      
      activityInterval = setInterval(() => {
        setActivities(prev => {
          const newActivity = generateActivity();
          return [newActivity, ...prev.slice(0, 2)];
        });
      }, 20000);
      
      hideTimeout = setTimeout(() => {
        setVisible(false);
        clearInterval(activityInterval);
        
        showTimeout = setTimeout(startVisibilityCycle, 60000);
      }, 30000);
    };

    const initialDelay = setTimeout(startVisibilityCycle, 10000);

    return () => {
      clearTimeout(initialDelay);
      clearTimeout(showTimeout);
      clearTimeout(hideTimeout);
      clearInterval(activityInterval);
    };
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-28 md:bottom-6 left-4 md:left-6 z-30 max-w-xs md:max-w-sm">
      <Card className="bg-white/95 backdrop-blur-sm border border-gray-100 shadow-sm p-2.5 animate-fade-in">
        <div className="flex items-start gap-3">
          <div className="bg-gray-100 rounded-full p-2 mt-0.5">
            <Users className="w-4 h-4 text-gray-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-foreground mb-1">
              Actividad reciente
            </p>
            <div className="space-y-2">
              {activities.map((activity) => (
                <div 
                  key={activity.id}
                  className="text-xs text-muted-foreground animate-fade-in"
                >
                  <span className="font-medium text-foreground">{activity.name}</span> de{' '}
                  <span className="font-medium">{activity.city}</span> contrató{' '}
                  <span className="font-semibold text-gray-900">{activity.provider}</span>
                  <span className="text-muted-foreground/80 ml-1">
                    hace {activity.minutesAgo} min
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SocialProofFeed;
