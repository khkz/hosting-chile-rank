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
    // Show after 3 seconds
    const showTimer = setTimeout(() => setVisible(true), 3000);

    // Add new activity every 15-25 seconds
    const activityInterval = setInterval(() => {
      setActivities(prev => {
        const newActivity = generateActivity();
        return [newActivity, ...prev.slice(0, 2)];
      });
    }, Math.random() * 10000 + 15000);

    return () => {
      clearTimeout(showTimer);
      clearInterval(activityInterval);
    };
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-24 md:bottom-6 left-4 md:left-6 z-30 max-w-sm">
      <Card className="bg-white/95 backdrop-blur-sm border-border shadow-xl p-3 animate-fade-in">
        <div className="flex items-start gap-3">
          <div className="bg-primary/10 rounded-full p-2 mt-0.5">
            <Users className="w-4 h-4 text-primary" />
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
                  <span className="font-semibold text-primary">{activity.provider}</span>
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
