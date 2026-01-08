
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { AnalysisResult, UserPersona } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const analyzeMessage = async (
  input: string | { data: string; mimeType: string },
  persona?: UserPersona
): Promise<AnalysisResult> => {
  const isImage = typeof input !== 'string';
  
  const personaContext = persona 
    ? `The user is in the ${persona.ageGroup} age group and considers their technological experience as "${persona.familiarity}". 
       Adjust your tone: ${persona.familiarity === 'beginner' ? 'Use extremely simple Hebrew terms, very encouraging, like a patient teacher.' : 'Be clear and educational in Hebrew, but acknowledge their existing knowledge.'}`
    : '';

  const systemInstruction = `You are "Dori," an AI Digital Mentor for seniors in Israel. 
  ${personaContext}
  Your goal is not just to scan messages, but to teach the user how to spot deceptive patterns themselves.
  CRITICAL: All generated text (summary, reasons, titles, warnings) MUST BE IN HEBREW.
  
  Generate a 'simulation' object with a 'steps' array. 
  This simulation MUST exist regardless of whether the input is a scam or safe.
  
  IF THE MESSAGE IS A SCAM:
  - Mark 'isTrap: true' for fake buttons/links.
  - Provide 'doriWarning' in Hebrew explaining the educational trick.
  - Prompt: "A slightly suspicious but clear and educational delivery or bank interface."
  
  IF THE MESSAGE IS SAFE:
  - Mark 'isTrap: false' for all elements.
  - Provide 'safetyReason' in Hebrew for ALL fields and 'urlSafetyReason' for the siteUrl. 
  - Mention specific safety markers: "Verified SSL certificate," "Correct official domain," "No threatening language."
  - Prompt: "A bright, clean, trustworthy professional interface."
  
  COMMON:
  - Add a 'visualVibePrompt'. High-quality, professional.
  - Avoid technical jargon in Hebrew. Use friendly terms like "Security Seal" (חותם בטיחות), "Verified Link" (קישור מאומת).`;

  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      isScam: { type: Type.BOOLEAN },
      threatLevel: { type: Type.STRING, enum: ['safe', 'warning', 'danger'] },
      summary: { type: Type.STRING },
      traps: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            type: { type: Type.STRING },
            reason: { type: Type.STRING },
            severity: { type: Type.STRING, enum: ['high', 'medium'] }
          },
          required: ['id', 'type', 'reason', 'severity']
        }
      },
      simulationType: { type: Type.STRING, enum: ['bank', 'package', 'lottery', 'family', 'generic'] },
      simulation: {
        type: Type.OBJECT,
        properties: {
          brandName: { type: Type.STRING },
          visualVibePrompt: { type: Type.STRING },
          steps: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                title: { type: Type.STRING },
                subtitle: { type: Type.STRING },
                siteUrl: { type: Type.STRING },
                urlIsTrap: { type: Type.BOOLEAN },
                urlDoriWarning: { type: Type.STRING },
                urlSafetyReason: { type: Type.STRING },
                headerColor: { type: Type.STRING },
                doriIntro: { type: Type.STRING },
                fields: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      label: { type: Type.STRING },
                      placeholder: { type: Type.STRING },
                      type: { type: Type.STRING, enum: ['text', 'password', 'button', 'info'] },
                      isTrap: { type: Type.BOOLEAN },
                      doriWarning: { type: Type.STRING },
                      safetyReason: { type: Type.STRING }
                    },
                    required: ['id', 'label', 'type', 'isTrap']
                  }
                }
              },
              required: ['id', 'title', 'subtitle', 'siteUrl', 'headerColor', 'doriIntro', 'fields']
            }
          }
        },
        required: ['brandName', 'visualVibePrompt', 'steps']
      }
    },
    required: ['isScam', 'threatLevel', 'summary', 'traps', 'simulationType', 'simulation']
  };

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: isImage ? { parts: [{ inlineData: input }, { text: "Explain this message like a friendly mentor in Hebrew and prepare the practice lab." }] } : `Mentor me on this in Hebrew: "${input}"`,
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema,
    },
  });

  return JSON.parse(response.text || '{}') as AnalysisResult;
};

export const generateSandboxImage = async (prompt: string): Promise<string | undefined> => {
  try {
    const aiInstance = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
    const response = await aiInstance.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: `${prompt}. Clean, professional Hebrew UI context, cinematic lighting.` }]
      },
      config: {
        imageConfig: { aspectRatio: "16:9" }
      }
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
  } catch (err) {
    console.error("Image generation failed", err);
  }
  return undefined;
};

export const getDoriVoice = async (text: string): Promise<string | undefined> => {
  const aiInstance = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  const response = await aiInstance.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text: `Say clearly and kindly in Hebrew: ${text}` }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: 'Kore' },
        },
      },
    },
  });

  return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
};
