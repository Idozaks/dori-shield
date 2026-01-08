
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { AnalysisResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const analyzeMessage = async (
  input: string | { data: string; mimeType: string }
): Promise<AnalysisResult> => {
  const isImage = typeof input !== 'string';
  
  const systemInstruction = `You are "Dori," an AI Safety Shield for seniors. 
  Analyze the provided text or image.
  
  Generate a 'simulation' object with a 'steps' array. 
  This simulation MUST exist regardless of whether the input is a scam or safe.
  
  IF THE MESSAGE IS A SCAM:
  - Mark 'isTrap: true' for fake buttons/links.
  - Provide 'doriWarning' explaining the trick.
  - Prompt: "A dark, slightly ominous office or suspicious delivery hub."
  
  IF THE MESSAGE IS SAFE:
  - Mark 'isTrap: false' for all elements.
  - CRITICAL: Provide 'safetyReason' for ALL fields and 'urlSafetyReason' for the siteUrl. 
  - Be technical but clear: Mention "HTTPS / SSL Encryption," "Matches Official Domain Registry," "Verified Sender ID," and "No Urgency/Threats detected."
  - Prompt: "A bright, clean, trustworthy professional office with soft morning light."
  
  COMMON:
  - Add a 'visualVibePrompt'. Cinematic photography, blurred background, no text.
  - Avoid jargon. Use "Safety Seal," "Verified Link," "Secure Connection."`;

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
    contents: isImage ? { parts: [{ inlineData: input }, { text: "Analyze and create the interactive sandbox." }] } : `Analyze: "${input}"`,
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
        parts: [{ text: `${prompt}. High-end commercial photography, extremely shallow depth of field, minimalist, professional lighting, 16:9.` }]
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
    contents: [{ parts: [{ text: `Say clearly: ${text}` }] }],
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
