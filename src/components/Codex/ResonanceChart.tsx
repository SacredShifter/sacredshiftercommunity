import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';

interface ResonanceChartProps {
  data: { timestamp: string; count: number }[] | null | undefined;
}

const ResonanceChart: React.FC<ResonanceChartProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        No resonance data available yet.
      </div>
    );
  }

  const formattedData = data.map(item => ({
    ...item,
    time: format(new Date(item.timestamp), 'MMM d'),
  }));

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={formattedData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
          <XAxis dataKey="time" stroke="rgba(255, 255, 255, 0.5)" />
          <YAxis allowDecimals={false} stroke="rgba(255, 255, 255, 0.5)" />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              borderColor: 'rgba(255, 255, 255, 0.2)',
            }}
          />
          <Legend />
          <Line type="monotone" dataKey="count" name="Resonance" stroke="#8884d8" activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ResonanceChart;
