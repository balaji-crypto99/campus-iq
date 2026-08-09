const { getAnalysisPrompt, getDailyReportPrompt } = require('./promptTemplates');
const FallbackAIProvider = require('./fallbackProvider');

class OpenAIProvider {
  constructor(apiKey, modelName) {
    this.apiKey = apiKey;
    this.modelName = modelName || 'gpt-4o-mini';
    this.fallback = new FallbackAIProvider();
  }

  async analyzeGrievance(title, description, location, userProvidedCategory) {
    try {
      const prompt = getAnalysisPrompt(title, description, location, userProvidedCategory);
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: this.modelName,
          messages: [{ role: 'user', content: prompt }],
          response_format: { type: 'json_object' },
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || 'OpenAI API request failed');

      const parsed = JSON.parse(data.choices[0].message.content);
      return parsed;
    } catch (err) {
      console.warn(`[OpenAIProvider] API request failed, using heuristic engine: ${err.message}`);
      return this.fallback.analyzeGrievance(title, description, location, userProvidedCategory);
    }
  }

  async generateDailyReport(stats, grievances) {
    try {
      const prompt = getDailyReportPrompt(stats, grievances);
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: this.modelName,
          messages: [{ role: 'user', content: prompt }],
          response_format: { type: 'json_object' },
        }),
      });

      const data = await res.json();
      return JSON.parse(data.choices[0].message.content);
    } catch (err) {
      return this.fallback.generateDailyReport(stats, grievances);
    }
  }
}

module.exports = OpenAIProvider;
