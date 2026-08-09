const Grievance = require('../models/Grievance');
const AIAnalysis = require('../models/AIAnalysis');
const { analyzeGrievance, generateDailySummary } = require('../services/ai/aiProvider');
const { findRelatedComplaints } = require('../utils/duplicateDetector');

exports.reanalyzeGrievance = async (req, res, next) => {
  try {
    const { grievanceId } = req.params;

    const grievance = await Grievance.findById(grievanceId);
    if (!grievance) {
      return res.status(404).json({ success: false, message: 'Grievance not found' });
    }

    const aiResult = await analyzeGrievance(
      grievance.title,
      grievance.description,
      grievance.location,
      grievance.category
    );

    // Upsert AI Analysis
    const aiAnalysis = await AIAnalysis.findOneAndUpdate(
      { grievanceId: grievance._id },
      {
        grievanceId: grievance._id,
        category: aiResult.category,
        subCategory: aiResult.subCategory,
        priority: aiResult.priority,
        severityScore: aiResult.severityScore,
        sentiment: aiResult.sentiment,
        summary: aiResult.summary,
        recommendedAction: aiResult.recommendedAction,
        department: aiResult.department,
        urgency: aiResult.urgency,
        keywords: aiResult.keywords,
        reasoning: aiResult.reasoning || '',
      },
      { upsert: true, new: true }
    );

    // Update grievance object
    grievance.category = aiResult.category;
    grievance.subCategory = aiResult.subCategory;
    grievance.priority = aiResult.priority;
    grievance.severityScore = aiResult.severityScore;
    grievance.sentiment = aiResult.sentiment;
    grievance.aiSummary = aiResult.summary;
    grievance.recommendedAction = aiResult.recommendedAction;
    grievance.assignedDepartment = aiResult.department;
    grievance.urgency = aiResult.urgency;
    grievance.keywords = aiResult.keywords;
    grievance.aiStatus = 'SUCCESS';

    await grievance.save();

    res.status(200).json({
      success: true,
      message: 'AI re-analysis completed successfully.',
      aiAnalysis,
      grievance,
    });
  } catch (error) {
    next(error);
  }
};

exports.generateDailyReport = async (req, res, next) => {
  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const [total, newToday, critical, high, inProgress, resolvedToday, catGroup, locGroup, recentGrievances] =
      await Promise.all([
        Grievance.countDocuments(),
        Grievance.countDocuments({ createdAt: { $gte: todayStart } }),
        Grievance.countDocuments({ priority: 'CRITICAL' }),
        Grievance.countDocuments({ priority: 'HIGH' }),
        Grievance.countDocuments({ status: 'IN_PROGRESS' }),
        Grievance.countDocuments({ status: 'RESOLVED', resolvedAt: { $gte: todayStart } }),
        Grievance.aggregate([{ $group: { _id: '$category', count: { $sum: 1 } } }, { $sort: { count: -1 } }]),
        Grievance.aggregate([{ $group: { _id: '$location', count: { $sum: 1 } } }, { $sort: { count: -1 } }]),
        Grievance.find().sort({ createdAt: -1 }).limit(10).select('title location category priority severityScore status'),
      ]);

    const stats = {
      total,
      newToday,
      critical,
      high,
      inProgress,
      resolvedToday,
      topCategory: catGroup[0] ? `${catGroup[0]._id} (${catGroup[0].count})` : 'None',
      topLocation: locGroup[0] ? `${locGroup[0]._id} (${locGroup[0].count})` : 'None',
    };

    const report = await generateDailySummary(stats, recentGrievances);

    res.status(200).json({
      success: true,
      stats,
      report,
      generatedAt: new Date(),
    });
  } catch (error) {
    next(error);
  }
};

exports.getRelated = async (req, res, next) => {
  try {
    const grievance = await Grievance.findById(req.params.grievanceId);
    if (!grievance) {
      return res.status(404).json({ success: false, message: 'Grievance not found' });
    }

    const related = await findRelatedComplaints(grievance, grievance.keywords || [], 10);

    res.status(200).json({
      success: true,
      count: related.length,
      related,
    });
  } catch (error) {
    next(error);
  }
};
