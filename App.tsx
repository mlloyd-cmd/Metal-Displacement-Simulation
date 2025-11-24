import React, { useState, useEffect, useRef } from 'react';
import { Beaker, Play, RotateCcw, BrainCircuit, BookOpen, Activity, ArrowRight, Maximize2, Minimize2 } from 'lucide-react';
import BeakerSimulation from './components/BeakerSimulation';
import DataCharts from './components/DataCharts';
import LabWorksheet from './components/LabWorksheet';
import { SimulationState, DataPoint, WorksheetAnswers, WorksheetField } from './types';
import { askTutor } from './services/geminiService';

const INITIAL_TEMP = 20.0;
const MAX_TEMP_RISE = 5.0; // Rises to 25.0
const REACTION_DURATION = 300; // 5 minutes in seconds
const RATE_CONSTANT = 0.015;

const App: React.FC = () => {
  // --- State ---
  const [view, setView] = useState<'lab' | 'notebook'>('lab');
  
  // Embed detection
  const [isEmbedded, setIsEmbedded] = useState(false);
  useEffect(() => {
    // Check if running in an iframe
    try {
      if (window.self !== window.top) {
        setIsEmbedded(true);
      }
    } catch (e) {
      setIsEmbedded(true);
    }
  }, []);

  const [simState, setSimState] = useState<SimulationState>({
    isRunning: false,
    isComplete: false,
    elapsedTime: 0,
    temperature: INITIAL_TEMP
  });

  const [dataPoints, setDataPoints] = useState<DataPoint[]>([
    { time: 0, temperature: INITIAL_TEMP, concentrationCu: 1, concentrationZn: 0 }
  ]);

  const [answers, setAnswers] = useState<WorksheetAnswers>({
    solutionInitial: '', solutionFinal: '', metalInitial: '', metalFinal: '',
    tempInitial: '', tempFinal: '', analysisQ1: '', analysisQ2a: '',
    analysisQ2b: '', analysisQ3: '', analysisQ4: '', analysisQ5: '',
    analysisQ6: '', analysisQ7: '', extensionQ1: '', extensionQ2: ''
  });

  const [tutorQuery, setTutorQuery] = useState('');
  const [tutorResponse, setTutorResponse] = useState<string | null>(null);
  const [isTutorThinking, setIsTutorThinking] = useState(false);

  const timerRef = useRef<number | null>(null);

  // --- Simulation Logic ---
  useEffect(() => {
    if (simState.isRunning && !simState.isComplete) {
      timerRef.current = window.setInterval(() => {
        setSimState(prev => {
          const newTime = prev.elapsedTime + 1;
          
          if (newTime >= REACTION_DURATION) {
             if(timerRef.current) clearInterval(timerRef.current);
             return { ...prev, isRunning: false, isComplete: true, elapsedTime: REACTION_DURATION };
          }

          // Calculate physics
          const progress = 1 - Math.exp(-RATE_CONSTANT * newTime);
          const currentTemp = INITIAL_TEMP + (MAX_TEMP_RISE * progress);
          
          // Update Charts
          setDataPoints(currPoints => {
            const newPoint: DataPoint = {
              time: newTime,
              temperature: parseFloat(currentTemp.toFixed(2)),
              concentrationCu: parseFloat((1 - progress).toFixed(3)),
              concentrationZn: parseFloat(progress.toFixed(3))
            };
            return [...currPoints, newPoint];
          });

          return { ...prev, elapsedTime: newTime, temperature: currentTemp };
        });
      }, 100); // 10x speed
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [simState.isRunning, simState.isComplete]);

  // --- Handlers ---
  const toggleReaction = () => {
    if (simState.isComplete) return;
    setSimState(prev => ({ ...prev, isRunning: !prev.isRunning }));
  };

  const resetSimulation = () => {
    setSimState({
      isRunning: false,
      isComplete: false,
      elapsedTime: 0,
      temperature: INITIAL_TEMP
    });
    setDataPoints([{ time: 0, temperature: INITIAL_TEMP, concentrationCu: 1, concentrationZn: 0 }]);
  };

  const handleAnswerChange = (field: WorksheetField, value: string) => {
    setAnswers(prev => ({ ...prev, [field]: value }));
  };

  const handleAskTutor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tutorQuery.trim()) return;
    setIsTutorThinking(true);
    const response = await askTutor(tutorQuery, simState);
    setTutorResponse(response);
    setIsTutorThinking(false);
    setTutorQuery('');
  };

  // --- Render ---
  // Using h-full and flex-col to create an "App Shell" layout that fits perfectly in iframes
  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
      
      {/* Navbar */}
      <nav className={`bg-white border-b border-slate-200 flex items-center justify-between sticky top-0 z-50 shadow-sm transition-all ${isEmbedded ? 'px-3 py-2' : 'px-6 py-4'}`}>
        <div className="flex items-center gap-3">
          <div className={`bg-indigo-600 rounded-lg text-white ${isEmbedded ? 'p-1.5' : 'p-2'}`}>
            <Beaker size={isEmbedded ? 18 : 24} />
          </div>
          <div>
            <h1 className={`${isEmbedded ? 'text-base' : 'text-xl'} font-bold text-slate-800`}>Metal Displacement Lab</h1>
            {!isEmbedded && <p className="text-xs text-slate-500">Unit 4: Redox Reactions</p>}
          </div>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-lg">
          <button
            onClick={() => setView('lab')}
            className={`flex items-center gap-2 rounded-md font-medium transition-all ${
              isEmbedded ? 'px-3 py-1.5 text-xs' : 'px-4 py-2 text-sm'
            } ${view === 'lab' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <Activity size={isEmbedded ? 14 : 16} />
            {isEmbedded ? 'Sim' : 'Simulation & Data'}
          </button>
          <button
            onClick={() => setView('notebook')}
            className={`flex items-center gap-2 rounded-md font-medium transition-all ${
              isEmbedded ? 'px-3 py-1.5 text-xs' : 'px-4 py-2 text-sm'
            } ${view === 'notebook' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <BookOpen size={isEmbedded ? 14 : 16} />
            {isEmbedded ? 'Notebook' : 'Lab Notebook'}
          </button>
        </div>
      </nav>

      {/* Main Content Area - Scrollable */}
      <main className={`flex-1 w-full max-w-7xl mx-auto overflow-y-auto ${isEmbedded ? 'p-3' : 'p-6'}`}>
        
        {view === 'lab' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Col: Simulation Visual (4 cols) */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col items-center">
                <h2 className="text-lg font-semibold text-slate-700 self-start mb-4">Visual Observation</h2>
                <BeakerSimulation simulationState={simState} />
                
                <div className="mt-8 w-full flex items-center gap-4">
                  <button
                    onClick={toggleReaction}
                    disabled={simState.isComplete}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-white transition-all transform active:scale-95 ${
                      simState.isComplete 
                        ? 'bg-slate-400 cursor-not-allowed' 
                        : simState.isRunning 
                          ? 'bg-amber-500 hover:bg-amber-600 shadow-lg shadow-amber-200' 
                          : 'bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200'
                    }`}
                  >
                    {simState.isRunning ? 'Pause' : simState.isComplete ? 'Reaction Complete' : 'Start Reaction'}
                    {!simState.isRunning && !simState.isComplete && <Play size={18} fill="currentColor" />}
                  </button>
                  
                  <button
                    onClick={resetSimulation}
                    className="p-3 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
                    title="Reset Experiment"
                  >
                    <RotateCcw size={20} />
                  </button>
                </div>

                <div className="mt-4 text-xs text-slate-400 text-center">
                  Experiment running at 10x speed
                </div>
              </div>

              {/* AI Tutor Mini-Chat */}
              <div className="bg-indigo-900 rounded-2xl shadow-lg p-6 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                   <BrainCircuit size={120} />
                </div>
                <h3 className="text-lg font-bold flex items-center gap-2 mb-4 relative z-10">
                   <BrainCircuit size={20} className="text-indigo-300" />
                   Lab Assistant
                </h3>
                
                <div className="h-32 overflow-y-auto mb-4 text-sm text-indigo-100 scrollbar-thin">
                  {tutorResponse ? (
                    <p className="animate-in fade-in">{tutorResponse}</p>
                  ) : (
                    <p className="opacity-60 italic">Ask me anything about the reaction! Why is it turning blue? What is happening to the atoms?</p>
                  )}
                </div>

                <form onSubmit={handleAskTutor} className="relative z-10">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={tutorQuery}
                      onChange={(e) => setTutorQuery(e.target.value)}
                      placeholder="Ask a question..."
                      className="w-full bg-indigo-800/50 border border-indigo-700 rounded-lg px-3 py-2 text-sm text-white placeholder-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400"
                    />
                    <button 
                      type="submit"
                      disabled={isTutorThinking}
                      className="bg-indigo-500 hover:bg-indigo-400 text-white p-2 rounded-lg transition-colors"
                    >
                      {isTutorThinking ? <Activity className="animate-spin" size={16} /> : <ArrowRight size={16} />}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Right Col: Charts & Stats (8 cols) */}
            <div className="lg:col-span-8 flex flex-col h-full">
              <div className="mb-6">
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Time Elapsed</div>
                    <div className="text-2xl font-mono font-bold text-slate-800 mt-1">
                      {Math.floor(simState.elapsedTime / 60)}:{(simState.elapsedTime % 60).toString().padStart(2, '0')}
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                     <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Temperature</div>
                     <div className="text-2xl font-mono font-bold text-red-600 mt-1">
                        {simState.temperature.toFixed(1)}°C
                     </div>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                     <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</div>
                     <div className={`text-lg font-bold mt-1 ${simState.isComplete ? 'text-green-600' : simState.isRunning ? 'text-amber-600' : 'text-slate-500'}`}>
                        {simState.isComplete ? 'Complete' : simState.isRunning ? 'Reacting...' : 'Ready'}
                     </div>
                  </div>
                </div>
                <DataCharts data={dataPoints} />
              </div>
              
              {/* Prompt to Notebook */}
              <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 flex items-center justify-between mt-auto">
                 <div className="flex items-center gap-3">
                    <div className="bg-white p-2 rounded-full shadow-sm text-indigo-600">
                      <BookOpen size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-indigo-900">Record your data</h4>
                      <p className="text-sm text-indigo-700">Go to the Lab Notebook tab to record observations.</p>
                    </div>
                 </div>
                 <button 
                   onClick={() => setView('notebook')}
                   className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                 >
                   Open Notebook
                 </button>
              </div>
            </div>

          </div>
        )}

        {view === 'notebook' && (
           <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-8">
             <LabWorksheet answers={answers} onAnswerChange={handleAnswerChange} />
           </div>
        )}

      </main>
    </div>
  );
};

export default App;