import { GoogleGenAI, Type } from "@google/genai";
import { KaizenSuggestion, WasteAnalysis, GembaChecklist, A3Report, EightWastesReport, IshikawaDiagram, PDCAPlan } from "../types";

const apiKey = process.env.API_KEY;
// Fallback if no key is present to prevent immediate crash, though functionality will fail.
const ai = new GoogleGenAI({ apiKey: apiKey || 'dummy-key' });

export const improveText = async (text: string): Promise<string> => {
  const model = "gemini-3-flash-preview";
  const prompt = `
    Act as a professional Arabic editor.
    Correct the spelling and grammar of the following Arabic text.
    Ensure it flows naturally and maintains a professional tone suitable for business/manufacturing context.
    Return ONLY the corrected text without any explanations or markdown.

    Text: "${text}"
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });
    return response.text?.trim() || text;
  } catch (error) {
    console.error("Text improvement error:", error);
    return text;
  }
};

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

export const generateGembaChecklist = async (areaDescription: string): Promise<GembaChecklist> => {
    const model = "gemini-3-flash-preview";
    const prompt = `
        You are a Lean Manager. Create a Gemba Walk checklist for the following area: "${areaDescription}".
        Language: Arabic.
        Structure the checklist into key Lean categories (e.g., Safety, 5S, Flow, Equipment).
        Return JSON.
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
                        areaName: { type: Type.STRING },
                        focusArea: { type: Type.STRING },
                        categories: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    categoryName: { type: Type.STRING },
                                    items: { type: Type.ARRAY, items: { type: Type.STRING } }
                                },
                                required: ["categoryName", "items"]
                            }
                        }
                    },
                    required: ["areaName", "focusArea", "categories"]
                }
            }
        });
        const text = response.text;
        if (!text) throw new Error("No response");
        return JSON.parse(text) as GembaChecklist;
    } catch (error) {
        console.error("Gemba error", error);
        throw error;
    }
};

export const generateA3Report = async (problem: string): Promise<A3Report> => {
    const model = "gemini-3-flash-preview";
    const prompt = `
        Act as a Lean Expert. Based on this problem description: "${problem}", generate a draft A3 Problem Solving Report in Arabic.
        Ensure the "Implementation Plan" is a list of steps.
        Return JSON.
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
                        theme: { type: Type.STRING, description: "Theme/Title of A3" },
                        background: { type: Type.STRING },
                        currentCondition: { type: Type.STRING },
                        goal: { type: Type.STRING },
                        rootCauseAnalysis: { type: Type.STRING },
                        countermeasures: { type: Type.STRING },
                        implementationPlan: { type: Type.ARRAY, items: { type: Type.STRING } },
                        followUp: { type: Type.STRING }
                    },
                    required: ["theme", "background", "currentCondition", "goal", "rootCauseAnalysis", "countermeasures", "implementationPlan", "followUp"]
                }
            }
        });
        const text = response.text;
        if (!text) throw new Error("No response");
        return JSON.parse(text) as A3Report;
    } catch (error) {
        console.error("A3 error", error);
        throw error;
    }
};

export const generateEightWastesReport = async (observations: Record<string, string>): Promise<EightWastesReport> => {
  const model = "gemini-3-flash-preview";
  const prompt = `
    Analyze the following audit observations for the "8 Wastes of Lean" (DOWNTIME).
    The input is a JSON object where keys are waste types and values are user observations.
    
    User Observations: ${JSON.stringify(observations)}
    
    Task:
    1. Analyze the observations to identify the most critical issues.
    2. Provide an executive summary in Arabic.
    3. For each waste type with an observation, provide an analysis and specific action items in Arabic.
    4. Assign a priority (High/Medium/Low) based on the severity implied in the observation.
    5. Calculate an overall "Health Score" (0-100) where 100 is waste-free.

    Return JSON matching the schema.
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
            executiveSummary: { type: Type.STRING },
            wasteBreakdown: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  wasteType: { type: Type.STRING },
                  analysis: { type: Type.STRING },
                  actionItems: { type: Type.ARRAY, items: { type: Type.STRING } },
                  priority: { type: Type.STRING, enum: ["High", "Medium", "Low"] }
                },
                required: ["wasteType", "analysis", "actionItems", "priority"]
              }
            },
            overallHealthScore: { type: Type.NUMBER }
          },
          required: ["executiveSummary", "wasteBreakdown", "overallHealthScore"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    return JSON.parse(text) as EightWastesReport;
  } catch (error) {
    console.error("8 Wastes Analysis error:", error);
    throw error;
  }
};

export const generateIshikawa = async (problem: string): Promise<IshikawaDiagram> => {
  const model = "gemini-3-flash-preview";
  const prompt = `
    Act as a Quality Control Expert. 
    Create an Ishikawa (Fishbone) diagram analysis for the following problem: "${problem}".
    Language: Arabic.
    Categorize potential root causes into the standard 6Ms:
    1. Man (الإنسان/العمالة)
    2. Machine (الآلات)
    3. Material (المواد)
    4. Method (الطريقة)
    5. Measurement (القياس)
    6. Environment (البيئة)

    Return JSON matching the schema.
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
            problem: { type: Type.STRING },
            categories: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  category: { type: Type.STRING },
                  causes: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ["category", "causes"]
              }
            }
          },
          required: ["problem", "categories"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response");
    return JSON.parse(text) as IshikawaDiagram;
  } catch (error) {
    console.error("Ishikawa error", error);
    throw error;
  }
};

export const generatePDCAPlan = async (goal: string): Promise<PDCAPlan> => {
  const model = "gemini-3-flash-preview";
  const prompt = `
    Act as a Lean Project Manager.
    Create a structured PDCA (Plan-Do-Check-Act) cycle plan for the following objective/problem: "${goal}".
    Language: Arabic.
    
    Structure the response into 4 distinct phases with concrete steps.
    Return JSON.
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
            plan: {
              type: Type.OBJECT,
              properties: {
                objective: { type: Type.STRING },
                steps: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["objective", "steps"]
            },
            do: {
              type: Type.OBJECT,
              properties: {
                actions: { type: Type.ARRAY, items: { type: Type.STRING } },
                resources: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["actions", "resources"]
            },
            check: {
              type: Type.OBJECT,
              properties: {
                kpis: { type: Type.ARRAY, items: { type: Type.STRING } },
                reviewDate: { type: Type.STRING }
              },
              required: ["kpis", "reviewDate"]
            },
            act: {
              type: Type.OBJECT,
              properties: {
                standardization: { type: Type.STRING },
                futureImprovements: { type: Type.STRING }
              },
              required: ["standardization", "futureImprovements"]
            }
          },
          required: ["title", "plan", "do", "check", "act"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response");
    return JSON.parse(text) as PDCAPlan;
  } catch (error) {
    console.error("PDCA error", error);
    throw error;
  }
};