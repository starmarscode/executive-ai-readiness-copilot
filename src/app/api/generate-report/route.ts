import Groq from "groq-sdk";
import { NextRequest, NextResponse } from "next/server";
import { AssessmentData } from "@/types/assessment";
import { AssessmentScores } from "@/lib/scoring";

const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

function buildPrompt(data: AssessmentData, scores: AssessmentScores): string {
  const company = data.companyName || "the organization";

  return `
Company: ${company}
Industry: ${data.industry || "Not specified"}
Size: ${data.companySize || "Not specified"} employees
Business model: ${data.businessModel || "Not specified"}

Readiness scores (0–100):
- Overall: ${scores.overall}
- Data Readiness: ${scores.dataReadiness.score} — ${scores.dataReadiness.description}
- Organizational Readiness: ${scores.organizationalReadiness.score} — ${scores.organizationalReadiness.description}
- Strategic Clarity: ${scores.strategicClarity.score} — ${scores.strategicClarity.description}
- AI Maturity: ${scores.aiMaturity.score} — ${scores.aiMaturity.description}

Current AI usage: ${data.aiUsage || "None"}
Data infrastructure: ${data.dataMaturity || "Not specified"}
Data governance policy: ${data.dataGovernance ? "Yes" : "No"}
Data challenges: ${data.dataChallenges.length > 0 ? data.dataChallenges.join(", ") : "None identified"}

Executive AI champion: ${data.hasAIChampion ? "Yes" : "No"}
Dedicated AI talent: ${data.aiTalent || "None"}
AI training programs: ${data.hasAITraining ? "Yes" : "No"}
Motivations for AI: ${data.aiMotivations.length > 0 ? data.aiMotivations.join(", ") : "Not specified"}

Priority use cases: ${data.useCases.length > 0 ? data.useCases.join(", ") : "Not specified"}
Timeline expectation: ${data.timeline || "Not specified"}
Budget allocated: ${data.budget || "No budget"}
Primary concern: ${data.primaryConcern || "Not specified"}
`.trim();
}

const SYSTEM_PROMPT = `You are a senior AI strategy advisor preparing concise executive readiness reports.

Based on the assessment data and readiness scores provided, generate a frank, specific, business-focused output.

Return ONLY valid JSON in this exact structure — no markdown, no preamble:
{
  "executiveSummary": "3–4 sentences summarizing AI readiness, key strengths, and critical gaps. Reference the score tier and be specific to their context.",
  "topOpportunities": ["opportunity 1", "opportunity 2", "opportunity 3"],
  "roadmap": {
    "thirtyDays": ["action 1", "action 2", "action 3"],
    "sixtyDays": ["action 1", "action 2", "action 3"],
    "ninetyDays": ["action 1", "action 2", "action 3"]
  }
}

Top opportunities guidelines:
- Exactly 2–3 specific AI use cases this organization should pursue given their industry, data maturity, and stated priorities.
- Each is a concrete initiative (not generic advice), written as a noun phrase (10–20 words).
- Prioritize use cases from their stated list where the data and org readiness can support them.
- If readiness is low, lead with a foundational opportunity (e.g. data infrastructure, pilot scoping).

Roadmap guidelines:
- 30-day actions: quick wins, audits, and stakeholder alignment. Prioritize the lowest-scoring dimension.
- 60-day actions: capability building, tool selection, and pilot program design.
- 90-day actions: pilot execution, measurement, and roadmap extension toward scale.
- Each bullet is one crisp action sentence (8–15 words). No filler phrases.
- Tailor recommendations to the specific industry, size, challenges, and stated priorities.`;

export async function POST(req: NextRequest) {
  try {
    const { data, scores }: { data: AssessmentData; scores: AssessmentScores } =
      await req.json();

    const response = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      max_tokens: 1024,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: buildPrompt(data, scores) },
      ],
    });

    const raw = response.choices[0]?.message?.content ?? "{}";
    // Strip markdown code fences if present
    const text = raw.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");

    try {
      return NextResponse.json(JSON.parse(text));
    } catch {
      console.error("Failed to parse Groq response. Raw text:", text);
      return NextResponse.json({ error: "Failed to parse report" }, { status: 500 });
    }
  } catch (error) {
    console.error("Report generation failed:", error);
    return NextResponse.json(
      { error: "Failed to generate report" },
      { status: 500 }
    );
  }
}
