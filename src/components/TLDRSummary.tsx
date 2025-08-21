import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Clock, Users, Shield } from 'lucide-react';

interface TLDRData {
  title: string;
  keyPoints: string[];
  stats?: {
    label: string;
    value: string;
    icon: React.ReactNode;
  }[];
  sources?: {
    title: string;
    url: string;
  }[];
}

interface TLDRSummaryProps {
  data: TLDRData;
}

const TLDRSummary: React.FC<TLDRSummaryProps> = ({ data }) => {
  return (
    <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-900">
          <Clock className="h-5 w-5" />
          TL;DR - {data.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Key Points */}
        <div>
          <h4 className="font-semibold text-blue-800 mb-2">Puntos clave:</h4>
          <ul className="space-y-1">
            {data.keyPoints.map((point, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-blue-700">
                <span className="text-blue-500 mt-1">•</span>
                {point}
              </li>
            ))}
          </ul>
        </div>

        {/* Stats */}
        {data.stats && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {data.stats.map((stat, index) => (
              <div key={index} className="bg-white/60 p-3 rounded-lg text-center">
                <div className="flex justify-center mb-1">{stat.icon}</div>
                <div className="text-lg font-bold text-blue-900">{stat.value}</div>
                <div className="text-xs text-blue-600">{stat.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Sources */}
        {data.sources && (
          <div>
            <h4 className="font-semibold text-blue-800 mb-2">Fuentes:</h4>
            <div className="space-y-1">
              {data.sources.map((source, index) => (
                <a
                  key={index}
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 hover:text-blue-800 underline block"
                >
                  {source.title}
                </a>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TLDRSummary;