import { GoogleGenAI, Type } from "@google/genai";
import { KaizenSuggestion, WasteAnalysis } from "../types";

const apiKey = process.env.API_KEY;
// Fallback if no key is present to prevent immediate crash, though functionality will fail.
const ai = new GoogleGenAI({ apiKey: apiKey || 'dummy-key' });

export const generateKaizenIdeas = async (problemDescription: string): Promise<KaizenSuggestion> => {
  const model = "gemini-3-flash-preview";
  
  const prompt = `
    You are a Lean Six Sigma Master Black Belt expert. 
    Analyze the following problem description provided in Arabic or English, and generate a structured Kaizen improvement proposal in Arabic.
    
    Problem: ${problemDescription}
    
    Return the response in JSON format matching this schema:
    {
      "title": "Short catchy title in Arabic",
      "problemStatement": "Clear definition of the problem in Arabic",
      "rootCause": "Potential root cause in Arabic",
      "countermeasure": "Proposed solution/countermeasure in Arabic",
      "expectedBenefit": "Quantitative or qualitative benefit in Arabic",
      "effort": "Low" | "Medium" | "High",
      "impact": "Low" | "Medium" | "High"
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.OBJECT,
            properties: {
                title: { type: Type.STRING },
                problemStatement: { type: Type.STRING },
                rootCause: { type: Type.STRING },
                countermeasure: { type: Type.STRING },
                expectedBenefit: { type: Type.STRING },
                effort: { type: Type.STRING, enum: ["Low", "Medium", "High"] },
                impact: { type: Type.STRING, enum: ["Low", "Medium", "High"] }
            },
            required: ["title", "problemStatement", "rootCause", "countermeasure", "expectedBenefit", "effort", "impact"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    return JSON.parse(text) as KaizenSuggestion;
  } catch (error) {
    console.error("Kaizen generation error:", error);
    throw error;
  }
};

export const analyzeWasteImage = async (base64Image: string): Promise<WasteAnalysis> => {
  const model = "gemini-2.5-flash-image"; // Optimized for vision tasks
  
  const prompt = `
    Analyze this workspace image for Lean Manufacturing "7 Wastes" (Muda) and 5S compliance issues.
    Provide the analysis in Arabic.
    
    Identify specific wastes such as:
    1. Defects (عيوب)
    2. Overproduction (إفراط في الإنتاج)
    3. Waiting (انتظار)
    4. Non-Utilized Talent (مواهب غير مستغلة)
    5. Transportation (نقل)
    6. Inventory (مخزون)
    7. Motion (حركة)
    8. Extra-Processing (معالجة زائدة)
    
    Also check for 5S violations (Sort, Set in order, Shine, Standardize, Sustain).

    Return JSON:
    {
      "detectedWastes": [
        {
          "type": "Name of waste in Arabic",
          "description": "Specific observation in Arabic",
          "severity": "Low" | "Medium" | "High",
          "recommendation": "Actionable 5S/Lean advice in Arabic"
        }
      ],
      "overallScore": number (0 to 100, where 100 is perfect Lean state),
      "summary": "Executive summary of the image analysis in Arabic"
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: {
        parts: [
          { inlineData: { mimeType: "image/jpeg", data: base64Image } },
          { text: prompt }
        ]
      },
      config: {
        // responseMimeType: "application/json" // Note: gemini-2.5-flash-image might support JSON mode, but let's be safe and parse text if needed. 
        // We will try JSON mode.
        responseMimeType: "application/json"
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    return JSON.parse(text) as WasteAnalysis;
  } catch (error) {
    console.error("Waste analysis error:", error);
    throw error;
  }
};

export const continueFiveWhys = async (history: {role: string, parts: {text: string}[]}[], userMessage: string): Promise<string> => {
    const model = "gemini-3-flash-preview";

    // Append user message to history for the Chat object
    // But since we are stateless in this service function, we recreate chat or use generateContent with full history.
    // For simplicity with Chat API:
    
    const chat = ai.chats.create({
        model,
        history: [
            {
                role: "user",
                parts: [{ text: "Start a '5 Whys' root cause analysis session with me in Arabic. Ask me one 'Why' question at a time based on my problem. Keep it professional and empathetic. When we reach the root cause, summarize it." }]
            },
            {
                role: "model",
                parts: [{ text: "حسناً، أنا جاهز للبدء. من فضلك، صف لي المشكلة التي تواجهها لنبدأ في تحليل 'الخمسة لماذا'." }]
            },
            ...history
        ],
        config: {
            maxOutputTokens: 500,
        }
    });

    const result = await chat.sendMessage({ message: userMessage });
    return result.text || "حدث خطأ في المعالجة.";
};
