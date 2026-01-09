
import { GoogleGenAI, Type, Modality, Blob } from "@google/genai";
import { AnalysisResult, UserPersona } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

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
  
  In the 'traps' array:
  - 'type' MUST be a short, descriptive HEBREW title for the finding (e.g., "לחץ פסיכולוגי", "קישור חשוד", "התחזות"). 
  - NEVER use the word "text" or "Type" or generic English words in the title or results.
  
  Generate a 'simulation' object with a 'steps' array. 
  This simulation MUST exist regardless of whether the input is a scam or safe.
  
  IF THE MESSAGE IS A SCAM:
  - Mark 'isTrap: true' for fake buttons/links.
  - Provide 'doriWarning' in Hebrew explaining the educational trick.
  - Provide a 'doriIntro' that clearly invites the user in Hebrew to click on the parts of the message to learn about the dangers.
  
  IF THE MESSAGE IS SAFE:
  - Mark 'isTrap: false' for all elements.
  - Provide 'safetyReason' in Hebrew for ALL fields and 'urlSafetyReason' for the siteUrl. 
  
  COMMON:
  - Add a 'visualVibePrompt'. 
  - Avoid technical jargon in Hebrew.`;

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
    contents: isImage ? { parts: [{ inlineData: input }, { text: "Analyze this and prepare simulation in Hebrew." }] } : `Analyze in Hebrew: "${input}"`,
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema,
    },
  });

  return JSON.parse(response.text || '{}') as AnalysisResult;
};

export interface DoriChatResponse {
  text: string;
  suggestions: string[];
}

export const chatWithDori = async (message: string, currentAppState: string, persona?: UserPersona): Promise<DoriChatResponse> => {
  const systemInstruction = `You are Dori, the mentor inside this "Anti-Scam" app. 
  You should break the fourth wall and help the user navigate the app itself.
  
  CONTEXT ABOUT THE APP:
  - Sections:
    1. "בדיקה" (Check): Red/Alert icon. For scanning suspicious messages.
    2. "ספריה" (Library): Book icon. Tips and knowledge.
    3. "תרגול" (Training): Target icon. Simulations.
  - User State: "${currentAppState}".
  - Persona: ${persona ? `${persona.ageGroup}, familiarity: ${persona.familiarity}` : 'Senior citizen'}.
  
  TASK:
  - Respond ONLY IN HEBREW.
  - Return a JSON object with 'text' (your response) and 'suggestions' (an array of 3-4 short follow-up questions or actions in Hebrew).
  - CRITICAL: Be extremely CONCISE. Max 1-2 short sentences. 
  - Avoid long introductions, filler words, or dramatic storytelling.
  - The response must be short and direct so it is easy to listen to via Text-to-Speech.`;

  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      text: { type: Type.STRING },
      suggestions: {
        type: Type.ARRAY,
        items: { type: Type.STRING }
      }
    },
    required: ['text', 'suggestions']
  };

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: message,
    config: { 
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema
    },
  });

  try {
    return JSON.parse(response.text || '{"text": "סליחה, אני קצת מבולבל.", "suggestions": []}') as DoriChatResponse;
  } catch (e) {
    return { text: response.text || "שגיאה בעיבוד התשובה.", suggestions: [] };
  }
};

export const fetchScamNews = async () => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: "What are the latest reported scams in Israel in the last 48 hours? Provide a list of 5 news summaries in Hebrew with source URLs.",
    config: {
      tools: [{ googleSearch: {} }],
    },
  });
  return {
    text: response.text,
    sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks
  };
};

export const generateSandboxImage = async (prompt: string): Promise<string | undefined> => {
  try {
    const aiInstance = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await aiInstance.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: `${prompt}. Clean Hebrew UI context.` }]
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
  const aiInstance = new GoogleGenAI({ apiKey: process.env.API_KEY });
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

export function decodeBase64(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

export async function playAudioFromBase64(base64: string): Promise<void> {
  const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
  const data = decodeBase64(base64);
  const dataInt16 = new Int16Array(data.buffer);
  const numChannels = 1;
  const frameCount = dataInt16.length / numChannels;
  const buffer = audioCtx.createBuffer(numChannels, frameCount, 24000);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }

  const source = audioCtx.createBufferSource();
  source.buffer = buffer;
  source.connect(audioCtx.destination);
  return new Promise((resolve) => {
    source.onended = () => resolve();
    source.start();
  });
}

export const connectLiveDori = (callbacks: any) => {
  return ai.live.connect({
    model: 'gemini-2.5-flash-native-audio-preview-12-2025',
    callbacks,
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
      },
      systemInstruction: `You are "Dori", the Mentor and Bodyguard embedded within the Anti-Scam Shield app. You break the fourth wall frequently.
      
      YOUR PERSONA:
      - You are an AI assistant designed specifically for seniors in Israel.
      - You are bilingual: Respond in Hebrew by default, but switch to English fluently if the user speaks it.
      
      YOUR KNOWLEDGE & GUIDANCE:
      1. THE APP: You know the app's structure (בדיקה/Scanner, ספריה/Library, תרגול/Training). Guide users to these sections (e.g., "לכו למסך הבדיקה כדי לסרוק את ההודעה הזו").
      2. INTERNAL LOGIC: Explain how you (Dori) and the app analyze scams. Talk about patterns like "fake urgency" (לחץ מלאכותי), "phishing links" (קישורים זדוניים), and "impersonation" (התחזות).
      3. ACTIONABLE ADVICE: If a user is on a live suspicious call or has someone at their door, give direct, calm, protective advice immediately.
      
      TONE: Patient, encouraging, professional but warm, and highly protective.
      CONCISENESS: Keep your spoken responses short and direct so the user can easily follow.`,
    }
  });
};

export function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}
