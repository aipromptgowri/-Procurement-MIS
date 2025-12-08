import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  subValue?: string;
  icon: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, subValue, icon, trend, trendValue }) => {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <h3 className="text-2xl font-bold text-gray-900 mt-1">{value}</h3>
          {subValue && <p className="text-sm text-gray-400 mt-1">{subValue}</p>}
        </div>
        <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
          {icon}
        </div>
      </div>
      {trend && (
        <div className="mt-4 flex items-center text-xs">
          <span
            className={`font-medium ${
              trend === 'up'
                ? 'text-green-600'
                : trend === 'down'
                ? 'text-red-600'
                : 'text-gray-600'
            }`}
          >
            {trendValue}
          </span>
          <span className="text-gray-400 ml-1">vs last week</span>
        </div>
      )}
    </div>
  );
};

export default StatCard;