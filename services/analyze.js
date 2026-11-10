import { GoogleGenAI, Type } from "@google/genai";
import { customers } from "../data/customers.js";

// Initialisation du client Google Gen AI
// Le SDK récupère automatiquement la clé dans la variable d'environnement PROCESS.ENV.GEMINI_API_KEY
const ai = new GoogleGenAI();

const buildPrompt = (overdue) => `
Tu aides un commerçant algérien à relancer ses clients en retard de paiement.
Voici les clients en retard (montants en DA) :
${JSON.stringify(overdue)}

Choisis les 2 clients à relancer en priorité cette semaine.
Pour chacun, donne la raison du choix et un message WhatsApp court, poli et en français.
`;

// Appel à l'API Gemini
const askModel = async (prompt) => {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash", // Modèle idéal pour hackathon : gratuit, ultra-rapide et intelligent
    contents: prompt,
    config: {
      temperature: 0.1, // Basse température pour maximiser la logique
      responseMimeType: "application/json", // Force la réponse au format JSON
      // Définition du schéma strict pour que Gemini ne fasse aucune erreur de structure
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summary: { type: Type.STRING },
          priorities: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                customerId: { type: Type.INTEGER },
                reason: { type: Type.STRING },
                message: { type: Type.STRING },
              },
              required: ["customerId", "reason", "message"],
            },
          },
        },
        required: ["summary", "priorities"],
      },
    },
  });

  return response.text;
};

export const analyzeBook = async () => {
  const overdue = customers
    .filter((c) => c.daysLate > 7 && c.due > 0)
    .map(({ id, name, due, daysLate }) => ({ id, name, due, daysLate }));

  // Si aucun client n'est en retard, on évite un appel API inutile
  if (overdue.length === 0) {
    return { summary: "Aucun client à relancer cette semaine.", priorities: [] };
  }

  const raw = await askModel(buildPrompt(overdue));
  const result = JSON.parse(raw);

  const validIds = overdue.map((c) => c.id);
  const isValid =
    typeof result.summary === "string" &&
    Array.isArray(result.priorities) &&
    result.priorities.every((p) => validIds.includes(p.customerId));

  if (!isValid) throw new Error("Format de réponse Gemini invalide");
  return result;
};
