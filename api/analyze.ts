import { VercelRequest, VercelResponse } from '@vercel/node';
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt, system } = req.body as { prompt?: string; system?: string };

  if (!prompt) {
    return res.status(400).json({ error: 'prompt is required' });
  }

  try {
    const message = await client.messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 1024,
      system: system ?? 'You are a contract intelligence assistant for Al-Madar Holding. Be concise and structured.',
      messages: [{ role: 'user', content: prompt }],
    });

    const textBlock = message.content.find((b) => b.type === 'text');
    res.json({ result: textBlock && textBlock.type === 'text' ? textBlock.text : '' });
  } catch (error) {
    if (error instanceof Anthropic.APIError) {
      res.status(error.status ?? 500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
