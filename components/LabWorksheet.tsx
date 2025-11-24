import React, { useState } from 'react';
import { WorksheetAnswers, WorksheetField } from '../types';
import { checkAnswers } from '../services/geminiService';
import { CheckCircle, Loader2, MessageSquare } from 'lucide-react';

interface LabWorksheetProps {
  answers: WorksheetAnswers;
  onAnswerChange: (field: WorksheetField, value: string) => void;
}

const LabWorksheet: React.FC<LabWorksheetProps> = ({ answers, onAnswerChange }) => {
  const [isChecking, setIsChecking] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleCheck = async () => {
    setIsChecking(true);
    setFeedback(null);
    const result = await checkAnswers(answers);
    setFeedback(result);
    setIsChecking(false);
  };

  const InputSection = ({ title, children }: { title: string, children?: React.ReactNode }) => (
    <div className="mb-8 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
      <h3 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">{title}</h3>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );

  const TextArea = ({ label, field, placeholder, rows = 2 }: { label: string, field: WorksheetField, placeholder?: string, rows?: number }) => (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
      <textarea
        value={answers[field]}
        onChange={(e) => onAnswerChange(field, e.target.value)}
        className="w-full p-3 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-slate-50 focus:bg-white"
        placeholder={placeholder}
        rows={rows}
      />
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto pb-20">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Lab Notebook</h2>
        <button
          onClick={handleCheck}
          disabled={isChecking}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
        >
          {isChecking ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
          {isChecking ? "Analyzing..." : "Check Answers with AI"}
        </button>
      </div>

      {feedback && (
        <div className="mb-8 p-4 bg-indigo-50 border border-indigo-100 rounded-xl animate-in fade-in slide-in-from-top-4">
          <div className="flex items-start gap-3">
            <MessageSquare className="w-5 h-5 text-indigo-600 mt-1" />
            <div className="prose prose-sm prose-indigo max-w-none">
              <h4 className="text-indigo-900 font-semibold m-0">AI Teaching Assistant Feedback</h4>
              <div className="whitespace-pre-wrap text-slate-700 mt-2 font-medium leading-relaxed">
                {feedback}
              </div>
            </div>
          </div>
        </div>
      )}

      <InputSection title="5. Data Collection">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-semibold text-slate-500 text-sm uppercase tracking-wider">Before Reaction (Initial)</h4>
            <TextArea label="Appearance of Solution" field="solutionInitial" placeholder="e.g., Clear blue liquid..." />
            <TextArea label="Appearance of Metal" field="metalInitial" placeholder="e.g., Shiny grey strip..." />
            <TextArea label="Temperature (°C)" field="tempInitial" placeholder="e.g., 20.0" rows={1} />
          </div>
          <div className="space-y-4">
             <h4 className="font-semibold text-slate-500 text-sm uppercase tracking-wider">After 5 Minutes (Final)</h4>
             <TextArea label="Appearance of Solution" field="solutionFinal" placeholder="Describe changes..." />
             <TextArea label="Appearance of Metal" field="metalFinal" placeholder="Describe deposit..." />
             <TextArea label="Temperature (°C)" field="tempFinal" placeholder="Peak temperature..." rows={1} />
          </div>
        </div>
      </InputSection>

      <InputSection title="6. Analysis & Interpretation (Part A: Copper)">
        <TextArea label="1. Did the concentration of Copper(II) ions increase or decrease?" field="analysisQ1" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextArea label="2a. Charge of neutral copper atom?" field="analysisQ2a" rows={1} />
          <TextArea label="2b. Did the ion gain or lose electrons?" field="analysisQ2b" rows={1} />
        </div>
        <TextArea label="3. Write the half-equation for Copper" field="analysisQ3" placeholder="e.g., Cu2+ + ... -> ..." />
      </InputSection>

      <InputSection title="Part B: Zinc">
        <TextArea label="4. Did Zinc atoms gain or lose electrons?" field="analysisQ4" rows={1} />
        <TextArea label="5. Write the half-equation for Zinc" field="analysisQ5" placeholder="e.g., Zn -> ... + ..." />
      </InputSection>

      <InputSection title="Part C: Redox & Conclusion">
        <TextArea label="6. Full reaction equation" field="analysisQ6" />
        <TextArea label="7. Conclusion: Why is this an 'electron transfer' reaction?" field="analysisQ7" />
      </InputSection>

      <InputSection title="7. Extension Questions">
        <TextArea label="1. Was this reaction Exothermic or Endothermic?" field="extensionQ1" rows={1} />
        <TextArea label="2. Hypothesis: Copper metal into Zinc Sulfate?" field="extensionQ2" />
      </InputSection>
    </div>
  );
};

export default LabWorksheet;