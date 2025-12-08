import { GoogleGenAI, Type } from "@google/genai";
import { WeeklyData, GeneratedReportSections } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateReportNarrative = async (
  data: WeeklyData
): Promise<GeneratedReportSections> => {
  const model = "gemini-2.5-flash";

  const prompt = `
    You are a Senior Procurement Analyst for AARAA INFRA.
    Generate the narrative sections for the Weekly MIS Report based on the data below.
    
    The report has a strict 9-section structure. You need to provide the content for the narrative-heavy sections.

    Input Data:
    ${JSON.stringify(data, null, 2)}

    Requirements for generated fields:
    1. executiveSummary: 4-5 bullet points summarizing key highlights, wins, and major risks of the week.
    2. vendorFollowUps: specific bullet points on which vendors need follow-up regarding delayed deliveries or pending items (Section 6 context).
    3. risksAndIssues: Bullet points covering material shortages, vendor non-performance, pricing fluctuations, or timeline impacts (Section 7 context).
    4. actionItems: Actions for procurement team, management, and vendor follow-ups (Section 8 context).
    5. conclusion: A short summary of readiness and focus for next week (Section 9 context).

    Tone: Corporate, concise, data-focused.
    
    Do NOT output Markdown. Output pure JSON matching the schema.
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
            vendorFollowUps: { type: Type.STRING },
            risksAndIssues: { type: Type.STRING },
            actionItems: { type: Type.STRING },
            conclusion: { type: Type.STRING },
          },
        },
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as GeneratedReportSections;
    }
    throw new Error("Empty response from AI");
  } catch (error) {
    console.error("Error generating report:", error);
    // Fallback in case of API error
    return {
      executiveSummary: "• Unable to generate summary at this time.\n• Please check API configuration.",
      vendorFollowUps: "• Review delayed POs manually.",
      risksAndIssues: "• Data processing error encountered.",
      actionItems: "• Retry report generation.",
      conclusion: "System maintenance required.",
    };
  }
};