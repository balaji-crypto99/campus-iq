const getAnalysisPrompt = (title, description, location, userProvidedCategory) => {
  return `You are Campus IQ's Senior AI Grievance Intelligence Analyst.
Analyze the following student campus grievance and output ONLY a valid, strict JSON object. No markdown wrappers, no extra text.

COMPLAINT DETAILS:
- Title: ${title}
- Description: ${description}
- Location: ${location}
- User Suggested Category: ${userProvidedCategory || 'None provided'}

RULES & PRIORITY LOGIC:
1. Safety risk, electrical sparks, fire hazard, physical violence, security breaches = CRITICAL (Severity 85-100).
2. Infrastructure failures affecting many students (Wi-Fi down before submission, total water outage, exam disruption) = HIGH (Severity 65-84).
3. Classroom equipment, maintenance requests, minor hostel repairs = MEDIUM (Severity 35-64).
4. General suggestions, library hours extension requests, non-urgent feedback = LOW (Severity 0-34).
5. Sentiment must be POSITIVE, NEUTRAL, NEGATIVE, or VERY_NEGATIVE.
6. Department must be one of: "IT Support", "Facilities & Maintenance", "Electrical Maintenance", "Hostel Management", "Academic Affairs", "Security & Safety", "Finance Office", "Sanitation & Hygiene", "Library Department", "General Administration".
7. Keywords must be an array of 3-6 relevant lowercase strings.

JSON STRUCTURE TO RETURN:
{
  "category": "Internet/Wi-Fi",
  "subCategory": "Connectivity",
  "priority": "HIGH",
  "severityScore": 78,
  "sentiment": "NEGATIVE",
  "urgency": "HIGH",
  "summary": "Concise summary of the grievance",
  "recommendedAction": "Actionable administrative response recommendation",
  "department": "IT Support",
  "keywords": ["wifi", "block-b", "network"],
  "reasoning": "Reasoning for the assigned priority and severity score"
}`;
};

const getDailyReportPrompt = (stats, grievances) => {
  return `You are Campus IQ's AI Intelligence Chief.
Generate a comprehensive executive Daily Intelligence Summary Report based on the following actual database metrics.

METRICS & DATA:
- Total Grievances: ${stats.total}
- New Complaints (Today): ${stats.newToday}
- Critical Grievances: ${stats.critical}
- High Priority: ${stats.high}
- In Progress: ${stats.inProgress}
- Resolved Today: ${stats.resolvedToday}
- Top Category: ${stats.topCategory}
- Top Affected Location: ${stats.topLocation}

RECENT GRIEVANCE SAMPLES:
${JSON.stringify(grievances, null, 2)}

Return a strict JSON object with the following structure:
{
  "reportTitle": "Daily Campus Grievance & Risk Assessment",
  "executiveSummary": "Detailed multi-sentence high-level summary of campus health and current complaints",
  "emergingIssues": ["Issue 1 description", "Issue 2 description"],
  "criticalHotspots": ["Location A - Wi-Fi outage", "Location B - Water leak"],
  "recommendedActions": ["Immediate Action 1", "Recommended Action 2"],
  "trendAnalysis": "Analysis of trends compared to typical baseline",
  "riskLevel": "LOW" | "MODERATE" | "HIGH" | "CRITICAL"
}`;
};

module.exports = { getAnalysisPrompt, getDailyReportPrompt };
