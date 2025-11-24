import React, { useMemo } from 'react';
import { SimulationState } from '../types';

interface BeakerSimulationProps {
  simulationState: SimulationState;
}

const BeakerSimulation: React.FC<BeakerSimulationProps> = ({ simulationState }) => {
  const { elapsedTime } = simulationState;
  const maxTime = 300; // 5 minutes
  const progress = Math.min(elapsedTime / maxTime, 1);

  // Color interpolation for solution: Blue -> Pale/Clear
  // Blue: rgba(59, 130, 246, 0.8) -> Pale: rgba(219, 234, 254, 0.4)
  const solutionOpacity = 0.8 - (0.6 * progress);
  const solutionColor = `rgba(59, 130, 246, ${solutionOpacity})`;

  // Metal strip appearance
  // Base Zinc: Slate-400 (#94a3b8)
  // Deposit Copper: Amber-700 (#b45309)
  // We'll overlay a mask or simply change color/texture
  
  return (
    <div className="relative flex flex-col items-center justify-end h-64 w-full max-w-xs mx-auto">
      {/* Thermometer */}
      <div className="absolute top-0 right-4 flex flex-col items-center z-20">
        <div className="bg-white border border-gray-300 rounded shadow p-1 mb-2 text-xs font-mono">
          {simulationState.temperature.toFixed(1)}°C
        </div>
        <div className="w-4 h-48 bg-gray-100 rounded-full border border-gray-300 relative overflow-hidden">
           {/* Mercury/Alcohol */}
           <div 
             className="absolute bottom-0 w-full bg-red-500 transition-all duration-500 ease-out"
             style={{ height: `${(simulationState.temperature / 50) * 100}%` }}
           />
        </div>
        <div className="w-8 h-8 bg-red-500 rounded-full -mt-2 border-2 border-gray-100 z-10"></div>
      </div>

      {/* Beaker Container */}
      <div className="relative w-48 h-56 border-x-4 border-b-4 border-gray-300/80 rounded-b-3xl bg-white/10 backdrop-blur-sm shadow-xl overflow-hidden z-10">
        
        {/* Liquid */}
        <div 
          className="absolute bottom-0 left-0 right-0 h-40 transition-colors duration-1000 ease-linear"
          style={{ backgroundColor: solutionColor }}
        >
           {/* Bubbles (Subtle) */}
           {simulationState.isRunning && (
             <div className="absolute inset-0 w-full h-full animate-pulse opacity-30 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiIGZpbGw9IiNmZmYiLz48L3N2Zz4=')]"></div>
           )}
        </div>

        {/* Metal Strip (Zinc) */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-48 bg-slate-400 rounded-t-sm shadow-inner flex items-end justify-center overflow-hidden">
            <div className="absolute top-2 text-[10px] text-slate-600 font-bold">Zn</div>
            
            {/* Copper Deposit Overlay */}
            <div 
              className="w-full bg-amber-800 opacity-90 transition-all duration-[300ms] ease-linear"
              style={{ 
                height: `${progress * 50}%`, // Covers bottom half over time
                maskImage: 'url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1IiBoZWlnaHQ9IjUiPjxyZWN0IHdpZHRoPSI1IiBoZWlnaHQ9IjUiIGZpbGw9IndoaXRlIi8+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiIGZpbGw9ImJsYWNrIi8+PC9zdmc+")',
                maskSize: '4px 4px' // Grunge texture effect
              }} 
            />
        </div>

      </div>
      
      {/* Beaker Reflection/Gloss */}
      <div className="absolute bottom-0 w-48 h-56 rounded-b-3xl pointer-events-none shadow-[inset_0_-10px_20px_rgba(255,255,255,0.4)] z-20 border-x-4 border-b-4 border-transparent"></div>
      
      <div className="mt-4 text-sm font-medium text-slate-500">Virtual Reaction Chamber</div>
    </div>
  );
};

export default BeakerSimulation;