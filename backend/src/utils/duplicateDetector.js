const Grievance = require('../models/Grievance');

/**
 * Finds related grievances in MongoDB based on Location, Category, and Keyword/Text similarity
 * @param {Object} currentGrievance - The grievance object to compare against
 * @param {Array<string>} keywords - Keywords extracted from current grievance
 * @param {number} limit - Maximum number of related complaints to return
 */
const findRelatedComplaints = async (currentGrievance, keywords = [], limit = 5) => {
  try {
    const query = {
      _id: { $ne: currentGrievance._id },
      $or: [
        { location: { $regex: currentGrievance.location, $options: 'i' } },
        { category: currentGrievance.category },
        { keywords: { $in: keywords } },
      ],
    };

    const candidateGrievances = await Grievance.find(query)
      .sort({ createdAt: -1 })
      .limit(30)
      .populate('submittedBy', 'name email studentId');

    // Score candidates based on weighted feature similarity
    const currentText = `${currentGrievance.title} ${currentGrievance.description}`.toLowerCase();
    const currentLoc = currentGrievance.location.toLowerCase();
    const currentCat = currentGrievance.category;

    const scored = candidateGrievances.map((g) => {
      let score = 0;
      const gText = `${g.title} ${g.description}`.toLowerCase();
      const gLoc = g.location.toLowerCase();

      // 1. Same/similar location (+40 points)
      if (gLoc === currentLoc) score += 40;
      else if (gLoc.includes(currentLoc) || currentLoc.includes(gLoc)) score += 25;

      // 2. Same category (+30 points)
      if (g.category === currentCat) score += 30;

      // 3. Keyword overlap (+10 per matching keyword)
      if (Array.isArray(g.keywords) && keywords.length > 0) {
        const matches = g.keywords.filter((kw) => keywords.includes(kw.toLowerCase()));
        score += matches.length * 12;
      }

      // 4. Text similarity overlap
      const currentWords = currentText.split(/\s+/);
      const matchWordCount = currentWords.filter((w) => w.length > 3 && gText.includes(w)).length;
      score += Math.min(25, matchWordCount * 3);

      return { grievance: g, similarityScore: Math.min(100, score) };
    });

    // Filter candidate complaints with similarity score > 35
    const related = scored
      .filter((item) => item.similarityScore >= 35)
      .sort((a, b) => b.similarityScore - a.similarityScore)
      .slice(0, limit);

    return related;
  } catch (err) {
    console.error('[DuplicateDetector] Error finding related complaints:', err.message);
    return [];
  }
};

module.exports = { findRelatedComplaints };
