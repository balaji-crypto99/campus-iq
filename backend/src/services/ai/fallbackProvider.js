/**
 * Built-in Smart Heuristic AI Provider
 * Evaluates grievance content using natural language heuristics, keyword safety models,
 * severity matrices, and sentiment classification.
 */
class FallbackAIProvider {
  async analyzeGrievance(title, description, location, userProvidedCategory) {
    const text = `${title} ${description} ${location}`.toLowerCase();

    // 1. Priority & Severity Rules
    let priority = 'MEDIUM';
    let severityScore = 50;
    let urgency = 'MEDIUM';
    let reasoning = 'Standard maintenance issue evaluated for moderate priority.';

    // Critical triggers: Sparks, fire, explosion, assault, violence, collapse, gas leak, electric shock
    const criticalRegex = /spark|fire|short circuit|shock|explode|smoke|leak|assault|attack|danger|hazard|emergency|flood|collapse/i;
    // High triggers: Wi-Fi down, water outage, exam, test, deadline, dark night, broken lock, no power
    const highRegex = /wifi|internet|network|no water|power cut|exam|submission|deadline|dark|lock|toilet|mess food|poison|stink/i;
    // Low triggers: suggestion, request, library hours, AC temperature, paint, bench
    const lowRegex = /suggestion|request|hours|paint|bench|feedback|curtain|chair/i;

    if (criticalRegex.test(text)) {
      priority = 'CRITICAL';
      severityScore = Math.floor(Math.random() * 15) + 85; // 85-99
      urgency = 'CRITICAL';
      reasoning = 'Identified immediate safety hazard or urgent infrastructure risk requiring emergency deployment.';
    } else if (highRegex.test(text)) {
      priority = 'HIGH';
      severityScore = Math.floor(Math.random() * 20) + 65; // 65-84
      urgency = 'HIGH';
      reasoning = 'Significant impact on student academic workflow, basic amenities, or campus operations.';
    } else if (lowRegex.test(text)) {
      priority = 'LOW';
      severityScore = Math.floor(Math.random() * 25) + 10; // 10-34
      urgency = 'LOW';
      reasoning = 'Low-urgency general improvement request or non-critical feedback.';
    } else {
      severityScore = Math.floor(Math.random() * 25) + 38; // 38-62
    }

    // 2. Category & Department Routing
    let category = userProvidedCategory && userProvidedCategory !== 'General' ? userProvidedCategory : 'General';
    let subCategory = 'General Maintenance';
    let department = 'General Administration';

    if (/wifi|internet|network|lan|router|portal|login/i.test(text)) {
      category = 'Internet/Wi-Fi';
      subCategory = 'Network Connectivity';
      department = 'IT Support';
    } else if (/spark|wire|power|electricity|light|fan|switch|socket|dark/i.test(text)) {
      category = 'Electricity';
      subCategory = 'Power Supply & Wiring';
      department = 'Electrical Maintenance';
    } else if (/water|tap|pipe|flush|drain|leak|shower|tank/i.test(text)) {
      category = 'Water';
      subCategory = 'Plumbing & Sanitation';
      department = 'Facilities & Maintenance';
    } else if (/mess|food|canteen|dinner|lunch|breakfast|taste|insect|hygiene/i.test(text)) {
      category = 'Mess/Canteen';
      subCategory = 'Food Quality & Hygiene';
      department = 'Hostel Management';
    } else if (/hostel|room|bed|warden|dorm|bathroom/i.test(text)) {
      category = 'Hostel';
      subCategory = 'Room Allocation & Amenities';
      department = 'Hostel Management';
    } else if (/class|projector|desk|ac|lift|elevator|door|window/i.test(text)) {
      category = 'Infrastructure';
      subCategory = 'Facility Repairs';
      department = 'Facilities & Maintenance';
    } else if (/library|book|journal|study room/i.test(text)) {
      category = 'Library';
      subCategory = 'Resource Availability';
      department = 'Library Department';
    } else if (/guard|security|gate|id card|cctv|stolen|loss/i.test(text)) {
      category = 'Security';
      subCategory = 'Campus Safety';
      department = 'Security & Safety';
    } else if (/clean|garbage|trash|dustbin|dirty|smell|stink/i.test(text)) {
      category = 'Cleanliness';
      subCategory = 'Housekeeping';
      department = 'Sanitation & Hygiene';
    } else if (/prof|faculty|teacher|marks|grade|lecture|exam/i.test(text)) {
      category = 'Academics';
      subCategory = 'Coursework & Evaluation';
      department = 'Academic Affairs';
    } else if (/fee|scholarship|fine|refund|receipt/i.test(text)) {
      category = 'Finance';
      subCategory = 'Billing & Payments';
      department = 'Finance Office';
    } else if (/bus|shuttle|transport|parking/i.test(text)) {
      category = 'Transportation';
      subCategory = 'Transit Services';
      department = 'Facilities & Maintenance';
    }

    // 3. Sentiment Analysis
    let sentiment = 'NEGATIVE';
    if (/urgent|terrible|horrible|dangerous|worst|unacceptable|immediately/i.test(text)) {
      sentiment = 'VERY_NEGATIVE';
    } else if (/please|kindly|request|thank/i.test(text)) {
      sentiment = 'NEUTRAL';
    }

    // 4. Keyword Extraction
    const wordList = text
      .replace(/[^\w\s]/gi, '')
      .split(/\s+/)
      .filter((w) => w.length > 3 && !['this', 'that', 'with', 'from', 'have', 'there', 'please', 'been', 'which', 'where'].includes(w));
    const keywords = Array.from(new Set(wordList)).slice(0, 5);
    if (keywords.length === 0) keywords.push('campus', 'issue', category.toLowerCase());

    // 5. Summary & Actionable Recommendations
    const summary = `${title} reported at ${location}. The issue involves ${category.toLowerCase()} (${subCategory.toLowerCase()}).`;
    const recommendedAction = `Dispatch ${department} representative to inspect ${location} and resolve ${subCategory.toLowerCase()} issue within ${priority === 'CRITICAL' ? '2 hours' : priority === 'HIGH' ? '12 hours' : '48 hours'}.`;

    return {
      category,
      subCategory,
      priority,
      severityScore,
      sentiment,
      urgency,
      summary,
      recommendedAction,
      department,
      keywords,
      reasoning,
    };
  }

  async generateDailyReport(stats, grievances) {
    return {
      reportTitle: 'Campus IQ Intelligence & Risk Assessment Report',
      executiveSummary: `Today the campus logged ${stats.total} total grievances, with ${stats.newToday} new issues registered. Currently, ${stats.critical} critical and ${stats.high} high-priority issues require active administrative intervention. The primary grievance volume originates from ${stats.topLocation} focusing on ${stats.topCategory}.`,
      emergingIssues: [
        `Spike in ${stats.topCategory} reports across ${stats.topLocation}.`,
        `${stats.inProgress} grievances are actively under repair by department teams.`,
      ],
      criticalHotspots: [
        `${stats.topLocation}: Highest concentration of reported issues (${stats.critical} critical alerts).`,
      ],
      recommendedActions: [
        `Prioritize technician dispatch to ${stats.topLocation} for immediate remediation.`,
        `Schedule weekly preventative maintenance for ${stats.topCategory} infrastructure.`,
        `Issue campus notification regarding resolution timelines for ${stats.inProgress} active tickets.`,
      ],
      trendAnalysis: `Grievance volume shows concentrated clusters around residential hostels and academic blocks. Fast response on critical items will reduce repeat submissions.`,
      riskLevel: stats.critical > 3 ? 'CRITICAL' : stats.high > 8 ? 'HIGH' : 'MODERATE',
    };
  }
}

module.exports = FallbackAIProvider;
