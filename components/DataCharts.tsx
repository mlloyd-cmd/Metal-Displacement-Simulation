import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { DataPoint } from '../types';

interface DataChartsProps {
  data: DataPoint[];
}

const DataCharts: React.FC<DataChartsProps> = ({ data }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
      {/* Temperature Chart */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col h-64">
        <h3 className="text-sm font-semibold text-slate-700 mb-2">Temperature vs. Time (Exothermic)</h3>
        <div className="flex-1 w-full min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                dataKey="time" 
                label={{ value: 'Time (s)', position: 'insideBottomRight', offset: -5 }} 
                tick={{fontSize: 12}}
              />
              <YAxis 
                domain={[15, 35]} 
                label={{ value: 'Temp (°C)', angle: -90, position: 'insideLeft' }} 
                tick={{fontSize: 12}}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                itemStyle={{ fontSize: '12px' }}
              />
              <Line 
                type="monotone" 
                dataKey="temperature" 
                stroke="#ef4444" 
                strokeWidth={2} 
                dot={false} 
                name="Temperature"
                animationDuration={300}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Concentration Chart */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col h-64">
        <h3 className="text-sm font-semibold text-slate-700 mb-2">Ion Concentration Trends</h3>
        <div className="flex-1 w-full min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                dataKey="time" 
                label={{ value: 'Time (s)', position: 'insideBottomRight', offset: -5 }}
                tick={{fontSize: 12}}
              />
              <YAxis 
                label={{ value: 'Rel. Conc.', angle: -90, position: 'insideLeft' }} 
                tick={{fontSize: 12}}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                itemStyle={{ fontSize: '12px' }}
              />
              <Legend verticalAlign="top" height={36}/>
              <Line 
                type="monotone" 
                dataKey="concentrationCu" 
                stroke="#3b82f6" 
                strokeWidth={2} 
                dot={false} 
                name="[Cu²⁺] (Blue)"
                animationDuration={300}
              />
              <Line 
                type="monotone" 
                dataKey="concentrationZn" 
                stroke="#64748b" 
                strokeWidth={2} 
                dot={false} 
                name="[Zn²⁺] (Colorless)"
                strokeDasharray="5 5"
                animationDuration={300}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DataCharts;