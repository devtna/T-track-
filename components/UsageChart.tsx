import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { ChartData } from '../types';

interface UsageChartProps {
  data: ChartData[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-base-100 dark:bg-dark-bg-secondary p-3 rounded-lg shadow-lg border border-base-200 dark:border-dark-border">
          <p className="text-sm font-bold text-text-primary dark:text-dark-text-primary">{`${label}`}</p>
          <p className="text-sm text-brand-primary">{`Smokes: ${payload[0].value}`}</p>
        </div>
      );
    }
  
    return null;
};

const UsageChart: React.FC<UsageChartProps> = ({ data }) => {
  const isDark = document.documentElement.classList.contains('dark');
  const tickColor = isDark ? '#94a3b8' : '#475569';
  const gridColor = isDark ? '#334155' : '#e2e8f0';
  const axisLineColor = isDark ? '#334155' : '#e2e8f0';

  return (
    <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
            <BarChart
                data={data}
                margin={{
                    top: 5,
                    right: 20,
                    left: -10,
                    bottom: 5,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                <XAxis dataKey="name" tick={{ fill: tickColor }} axisLine={{ stroke: axisLineColor }} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fill: tickColor }} axisLine={{ stroke: axisLineColor }} tickLine={false} />
                <Tooltip
                    cursor={{ fill: 'rgba(209, 250, 229, 0.5)', fillOpacity: isDark ? 0.2 : 1 }}
                    content={<CustomTooltip />}
                />
                <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
        </ResponsiveContainer>
    </div>
  );
};

export default UsageChart;