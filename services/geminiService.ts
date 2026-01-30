
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { Meeting, Payment } from "../types";

// Always instantiate GoogleGenAI within functions to ensure the most up-to-date configuration/key is used

export const getFinancialForecasting = async (payments: Payment[], meetings: Meeting[]) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `
        Analysez les données financières suivantes pour NexCRM (Gestion Financière Cameroun).
        Tous les montants sont en FCFA. 
        Notez bien les localisations (villes comme Douala, Yaoundé, etc.).
        
        Réunions: ${JSON.stringify(meetings)}
        Paiements: ${JSON.stringify(payments)}
        
        Répondez en français. Fournissez une analyse structurée : revenus projetés par ville, risques et conseils financiers.
      `,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            projectedIncome: { type: Type.NUMBER },
            forecastMonths: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  month: { type: Type.STRING },
                  amount: { type: Type.NUMBER }
                }
              }
            },
            riskLevel: { type: Type.STRING },
            insightsByLocation: { type: Type.ARRAY, items: { type: Type.STRING } }
          }
        }
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Gemini Error:", error);
    return null;
  }
};

export const chatWithAssistant = async (query: string, context: any) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `
        Tu es l'Assistant IA de NexCRM, conçu pour le "Boss Admin".
        Expert en gestion de contributions de réunions au Cameroun (Douala, Yaoundé, etc.).
        Toute la monnaie est exclusivement en FCFA.
        
        Contexte Actuel:
        - Réunions par Ville: ${context.meetings.map((m: any) => `${m.title} à ${m.location}`).join(', ')}
        - Total Paiements: ${context.payments.length}
        - Historique Récent: ${JSON.stringify(context.payments.slice(-5))}
        
        Règles d'or:
        1. RÉPONDS UNIQUEMENT EN FRANÇAIS.
        2. Sois précis sur les lieux mentionnés.
        3. Formate tes réponses avec Markdown.
        4. Sois concis.
        
        Requête du Boss: ${query}
      `,
    });
    return response.text;
  } catch (error) {
    return "Désolé Boss, mon système est momentanément indisponible.";
  }
};

export const textToSpeech = async (text: string): Promise<string | undefined> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `Lis ceci avec une voix professionnelle et assurée en français: ${text}` }] }],
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
  } catch (error) {
    console.error("TTS Error:", error);
    return undefined;
  }
};
