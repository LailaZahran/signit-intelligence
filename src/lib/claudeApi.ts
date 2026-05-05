/**
 * Claude API client — calls /api/analyze (Vercel serverless function).
 * Works in both dev (vercel dev) and production.
 */

async function callApi(prompt: string, system?: string): Promise<string> {
  const res = await fetch('/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, system }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error ?? `API error ${res.status}`);
  }

  const data = await res.json();
  return data.result as string;
}

// ─── Feature helpers ──────────────────────────────────────────────────────────

/**
 * Generate a portfolio narrative paragraph for the given persona.
 * Replaces the hardcoded narrative in src/data/portfolio.ts.
 */
export async function generatePortfolioNarrative(
  persona: 'legal' | 'procurement' | 'cfo',
  contractSummaries: string,
): Promise<string> {
  return callApi(
    `You are analyzing a portfolio of 10 contracts for Al-Madar Holding from the perspective of a ${persona === 'cfo' ? 'CFO/COO' : persona === 'procurement' ? 'Procurement Manager' : 'Legal Counsel'}.

Contract summaries:
${contractSummaries}

Write a single narrative paragraph (3–4 sentences) highlighting the most critical insight for this persona. Be specific — mention contract names, SAR amounts, and days where relevant. Return only the paragraph, no headings.`,
  );
}

/**
 * Generate persona-specific AI reading of a contract clause.
 * Replaces hardcoded aiSummary entries in contracts fixture.
 */
export async function generatePersonaReading(
  persona: 'legal' | 'procurement' | 'cfo',
  contractText: string,
): Promise<string> {
  return callApi(
    `Analyze this contract excerpt from the perspective of a ${persona === 'cfo' ? 'CFO/COO' : persona === 'procurement' ? 'Procurement Manager' : 'Legal Counsel'}.

Contract text:
${contractText}

Identify the 3 most important clauses for this persona. For each, provide:
- A short title (5 words max)
- A 2-sentence insight
- A confidence score (0–100)

Return as JSON: [{"title": "...", "insight": "...", "confidence": 90}]`,
    'You are a contract intelligence AI. Return only valid JSON, no markdown.',
  );
}

/**
 * Detect contradictions across multiple contract summaries.
 * Replaces hardcoded contradictions in portfolio fixture.
 */
export async function detectContradictions(contractSummaries: string): Promise<string> {
  return callApi(
    `Given these contract summaries for Al-Madar Holding, identify cross-contract contradictions or inconsistencies:

${contractSummaries}

Return up to 5 contradictions as JSON:
[{
  "title": "...",
  "description": "One sentence describing the conflict.",
  "severity": "critical|high|medium",
  "contracts": ["c1", "c3"]
}]`,
    'You are a contract intelligence AI. Return only valid JSON, no markdown.',
  );
}
