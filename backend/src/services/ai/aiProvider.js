const FallbackAIProvider = require('./fallbackProvider');
const GeminiAIProvider = require('./geminiProvider');
const OpenAIProvider = require('./openaiProvider');

let activeProvider = null;

const getAIProvider = () => {
  if (activeProvider) return activeProvider;

  const providerType = (process.env.AI_PROVIDER || 'fallback').toLowerCase();
  const apiKey = process.env.AI_API_KEY;
  const model = process.env.AI_MODEL;

  if (providerType === 'gemini' && apiKey) {
    console.log('[AI Service] Initialized Gemini AI Provider');
    activeProvider = new GeminiAIProvider(apiKey, model);
  } else if (providerType === 'openai' && apiKey) {
    console.log('[AI Service] Initialized OpenAI Provider');
    activeProvider = new OpenAIProvider(apiKey, model);
  } else {
    console.log('[AI Service] Initialized Smart Built-in Heuristic AI Engine');
    activeProvider = new FallbackAIProvider();
  }

  return activeProvider;
};

/**
 * Main AI Grievance Analysis
 */
const analyzeGrievance = async (title, description, location, category) => {
  const provider = getAIProvider();
  return await provider.analyzeGrievance(title, description, location, category);
};

/**
 * Generate Executive Daily Intelligence Summary
 */
const generateDailySummary = async (stats, grievances) => {
  const provider = getAIProvider();
  return await provider.generateDailyReport(stats, grievances);
};

/**
 * Generate Recommended Action for admin or department head
 */
const generateRecommendedAction = (analysis, grievance) => {
  const urgency = analysis.urgency || grievance.urgency || 'MEDIUM';
  const dept = analysis.department || grievance.assignedDepartment || 'General Admin';
  return `Priority dispatch for ${dept}: Perform on-site inspection at ${grievance.location}. Estimated SLA: ${
    urgency === 'CRITICAL' ? '2 hours' : urgency === 'HIGH' ? '12 hours' : '48 hours'
  }.`;
};

module.exports = {
  analyzeGrievance,
  generateDailySummary,
  generateRecommendedAction,
};
