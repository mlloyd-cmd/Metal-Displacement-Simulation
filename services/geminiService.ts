import { GoogleGenAI } from "@google/genai";

// Initialize Gemini Client
// The API key must be provided in the environment variable API_KEY.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const checkAnswers = async (answers: any) => {
  try {
    const model = "gemini-2.5-flash";
    const prompt = `
      You are a Chemistry Lab Teaching Assistant evaluating a student's Digital Lab Report for the "Metal Displacement: Zinc + Copper(II) Sulfate" experiment.
      
      The Reaction: Zn(s) + CuSO4(aq) -> ZnSO4(aq) + Cu(s)
      
      Student's Input Data:
      ${JSON.stringify(answers, null, 2)}
      
      Task:
      Review the student's answers. 
      1. Check if their observations (Color changes: Blue -> Pale/Clear; Metal: Grey -> Red/Brown coating; Temp: Increases) are consistent with the chemistry.
      2. Check if their analysis of redox (Electron transfer, half-equations) is correct.
      3. Provide constructive feedback. Point out specific errors but be encouraging.
      4. If they haven't filled out a field, kindly prompt them to observe the simulation.

      Format your response as a concise markdown list of feedback points. Start with a brief overall grade/assessment (e.g., "Great job!", "Needs review").
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });

    return response.text;
  } catch (error) {
    console.error("Error calling Gemini:", error);
    return "Error connecting to the Lab Assistant. Please try again.";
  }
};

export const askTutor = async (question: string, contextData: any) => {
  try {
    const model = "gemini-2.5-flash";
    const prompt = `
      You are a helpful Chemistry Tutor during a lab simulation.
      Current Simulation State: Temp: ${contextData.temperature.toFixed(1)}°C, Time: ${contextData.elapsedTime}s.
      
      The student asks: "${question}"
      
      Provide a short, clear explanation suitable for a high school chemistry student. Focus on the displacement reaction between Zinc and Copper Sulfate.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });

    return response.text;
  } catch (error) {
    console.error("Gemini Tutor Error:", error);
    return "I'm having trouble thinking right now. Ask me again in a moment.";
  }
};