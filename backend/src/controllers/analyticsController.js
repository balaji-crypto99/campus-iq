const Grievance = require('../models/Grievance');

exports.getOverview = async (req, res, next) => {
  try {
    const [total, pending, inProgress, resolved, critical, high, averageSeverity] = await Promise.all([
      Grievance.countDocuments(),
      Grievance.countDocuments({ status: { $in: ['SUBMITTED', 'PENDING'] } }),
      Grievance.countDocuments({ status: 'IN_PROGRESS' }),
      Grievance.countDocuments({ status: 'RESOLVED' }),
      Grievance.countDocuments({ priority: 'CRITICAL' }),
      Grievance.countDocuments({ priority: 'HIGH' }),
      Grievance.aggregate([{ $group: { _id: null, avgScore: { $avg: '$severityScore' } } }]),
    ]);

    res.status(200).json({
      success: true,
      stats: {
        total,
        pending,
        inProgress,
        resolved,
        critical,
        high,
        avgSeverity: averageSeverity[0] ? Math.round(averageSeverity[0].avgScore) : 0,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Grievance.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          avgSeverity: { $avg: '$severityScore' },
          criticalCount: {
            $sum: { $cond: [{ $eq: ['$priority', 'CRITICAL'] }, 1, 0] },
          },
        },
      },
      { $sort: { count: -1 } },
    ]);

    res.status(200).json({
      success: true,
      categories: categories.map((c) => ({
        category: c._id || 'Unassigned',
        count: c.count,
        avgSeverity: Math.round(c.avgSeverity || 0),
        criticalCount: c.criticalCount,
      })),
    });
  } catch (error) {
    next(error);
  }
};

exports.getDepartments = async (req, res, next) => {
  try {
    const departments = await Grievance.aggregate([
      {
        $group: {
          _id: '$assignedDepartment',
          count: { $sum: 1 },
          resolved: {
            $sum: { $cond: [{ $eq: ['$status', 'RESOLVED'] }, 1, 0] },
          },
          inProgress: {
            $sum: { $cond: [{ $eq: ['$status', 'IN_PROGRESS'] }, 1, 0] },
          },
        },
      },
      { $sort: { count: -1 } },
    ]);

    res.status(200).json({
      success: true,
      departments: departments.map((d) => ({
        department: d._id || 'General Admin',
        count: d.count,
        resolved: d.resolved,
        inProgress: d.inProgress,
      })),
    });
  } catch (error) {
    next(error);
  }
};

exports.getLocations = async (req, res, next) => {
  try {
    const hotspots = await Grievance.aggregate([
      {
        $group: {
          _id: '$location',
          count: { $sum: 1 },
          avgSeverity: { $avg: '$severityScore' },
          criticalCount: {
            $sum: { $cond: [{ $eq: ['$priority', 'CRITICAL'] }, 1, 0] },
          },
          topCategory: { $first: '$category' },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 15 },
    ]);

    res.status(200).json({
      success: true,
      hotspots: hotspots.map((h) => ({
        location: h._id,
        count: h.count,
        avgSeverity: Math.round(h.avgSeverity || 0),
        criticalCount: h.criticalCount,
        topCategory: h.topCategory,
      })),
    });
  } catch (error) {
    next(error);
  }
};

exports.getTrends = async (req, res, next) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 14);

    const trends = await Grievance.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
          },
          total: { $sum: 1 },
          critical: {
            $sum: { $cond: [{ $eq: ['$priority', 'CRITICAL'] }, 1, 0] },
          },
          resolved: {
            $sum: { $cond: [{ $eq: ['$status', 'RESOLVED'] }, 1, 0] },
          },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.status(200).json({
      success: true,
      trends: trends.map((t) => ({
        date: t._id,
        total: t.total,
        critical: t.critical,
        resolved: t.resolved,
      })),
    });
  } catch (error) {
    next(error);
  }
};
