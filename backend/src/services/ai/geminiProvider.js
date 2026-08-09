const { GoogleGenerativeAI } = require('@google/generative-ai');
const { getAnalysisPrompt, getDailyReportPrompt } = require('./promptTemplates');
const FallbackAIProvider = require('./fallbackProvider');

class GeminiAIProvider {
  constructor(apiKey, modelName) {
    this.apiKey = apiKey;
    this.modelName = modelName || 'gemini-1.5-flash';
    this.genAI = new GoogleGenerativeAI(this.apiKey);
    this.fallback = new FallbackAIProvider();
  }

  async analyzeGrievance(title, description, location, userProvidedCategory) {
    try {
      const prompt = getAnalysisPrompt(title, description, location, userProvidedCategory);
      const model = this.genAI.getGenerativeModel({
        model: this.modelName,
        generationConfig: { responseMimeType: 'application/json' },
      });
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      const parsed = JSON.parse(text);
      return this.validateAndSanitize(parsed);
    } catch (err) {
      console.warn(`[GeminiAIProvider] API Call failed, falling back to Smart Heuristic engine: ${err.message}`);
      return this.fallback.analyzeGrievance(title, description, location, userProvidedCategory);
    }
  }

  async generateDailyReport(stats, grievances) {
    try {
      const prompt = getDailyReportPrompt(stats, grievances);
      const model = this.genAI.getGenerativeModel({
        model: this.modelName,
        generationConfig: { responseMimeType: 'application/json' },
      });
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      return JSON.parse(text);
    } catch (err) {
      console.warn(`[GeminiAIProvider] Daily Report API call failed, falling back: ${err.message}`);
      return this.fallback.generateDailyReport(stats, grievances);
    }
  }

  validateAndSanitize(data) {
    const validPriorities = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
    const validSentiments = ['POSITIVE', 'NEUTRAL', 'NEGATIVE', 'VERY_NEGATIVE'];

    return {
      category: data.category || 'General',
      subCategory: data.subCategory || 'General',
      priority: validPriorities.includes(data.priority) ? data.priority : 'MEDIUM',
      severityScore: typeof data.severityScore === 'number' ? Math.min(100, Math.max(0, data.severityScore)) : 50,
      sentiment: validSentiments.includes(data.sentiment) ? data.sentiment : 'NEGATIVE',
      urgency: validPriorities.includes(data.urgency) ? data.urgency : 'MEDIUM',
      summary: data.summary || 'Summary unavailable.',
      recommendedAction: data.recommendedAction || 'Inspect location and evaluate issue.',
      department: data.department || 'General Administration',
      keywords: Array.isArray(data.keywords) ? data.keywords.map(k => String(k).toLowerCase()) : ['campus', 'grievance'],
      reasoning: data.reasoning || 'AI evaluation based on grievance content.',
    };
  }
}

module.exports = GeminiAIProvider;
