/**
 * LLM Provider Bridge (v7.3.1)
 * Bridges the Engine with OpenRouter/SiliconFlow
 */

export async function callLLM(
  messages: any[], 
  options: { model?: string; temperature?: number; json?: boolean; seed?: number } = {}
): Promise<string> {
  const model = options.model || "gpt-4o";
  const apiKey = process.env.OPENROUTER_API_KEY;
  
  if (!apiKey) {
    // Fallback to OpenAI if OpenRouter is missing
    const OpenAI = (await import('openai')).default;
    const openai = new OpenAI();
    const response = await openai.chat.completions.create({
      model,
      messages,
      temperature: options.temperature ?? 0.4,
      response_format: options.json ? { type: 'json_object' } : undefined,
      seed: options.seed
    } as any);
    return response.choices[0].message.content || '';
  }

  // OpenRouter implementation with Resilience (45s timeout)
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 45000);

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://councilia.com',
        'X-Title': 'CouncilIA v7.3.1'
      },
      body: JSON.stringify({
        model: model === "gpt-4o" ? "openai/gpt-4o-mini" : (model.includes('/') ? model : `openai/${model}`),
        messages,
        temperature: options.temperature ?? 0.4,
        response_format: options.json ? { type: 'json_object' } : undefined,
        seed: options.seed
      })
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`LLM_API_ERROR: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content || '';
  } catch (err: any) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') throw new Error('LLM_TIMEOUT');
    throw err;
  }
}
