export interface DataPoint {
  time: number; // in seconds
  temperature: number; // in Celsius
  concentrationCu: number; // Relative concentration (0-1)
  concentrationZn: number; // Relative concentration (0-1)
}

export interface SimulationState {
  isRunning: boolean;
  isComplete: boolean;
  elapsedTime: number; // seconds
  temperature: number;
}

export interface WorksheetAnswers {
  solutionInitial: string;
  solutionFinal: string;
  metalInitial: string;
  metalFinal: string;
  tempInitial: string;
  tempFinal: string;
  analysisQ1: string; // Concentration change
  analysisQ2a: string; // Charge of Cu
  analysisQ2b: string; // Gain/Lose electrons
  analysisQ3: string; // Half equation Cu
  analysisQ4: string; // Zinc electrons
  analysisQ5: string; // Half equation Zn
  analysisQ6: string; // Full equation
  analysisQ7: string; // Conclusion
  extensionQ1: string; // Exo/Endo
  extensionQ2: string; // Prediction
}

export type WorksheetField = keyof WorksheetAnswers;