const Grievance = require('../models/Grievance');
const AIAnalysis = require('../models/AIAnalysis');
const Notification = require('../models/Notification');
const ActivityLog = require('../models/ActivityLog');
const User = require('../models/User');
const { analyzeGrievance } = require('../services/ai/aiProvider');
const { findRelatedComplaints } = require('../utils/duplicateDetector');

/**
 * Submit Grievance (Student / Admin)
 */
exports.createGrievance = async (req, res, next) => {
  try {
    const { title, description, location, category, imageUrl } = req.body;

    // 1. Initial Grievance Creation
    const grievance = await Grievance.create({
      title,
      description,
      location,
      category: category || 'General',
      submittedBy: req.user._id,
      imageUrl: imageUrl || '',
      status: 'SUBMITTED',
      aiStatus: 'PENDING',
    });

    let aiResult = null;
    let aiStatus = 'SUCCESS';

    // 2. Perform AI Analysis
    try {
      aiResult = await analyzeGrievance(title, description, location, category);

      // Save AI Analysis Document
      await AIAnalysis.create({
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
      });

      // Update Grievance with AI Findings
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

    } catch (aiError) {
      console.error('[GrievanceController] AI Analysis error:', aiError.message);
      grievance.aiStatus = 'FAILED';
      aiStatus = 'FAILED';
    }

    // 3. Find Related Complaints
    const relatedList = await findRelatedComplaints(grievance, grievance.keywords || [], 5);
    grievance.relatedGrievances = relatedList.map((item) => item.grievance._id);
    await grievance.save();

    // Update AI Analysis with related IDs if saved
    if (aiStatus === 'SUCCESS') {
      await AIAnalysis.findOneAndUpdate(
        { grievanceId: grievance._id },
        { relatedComplaintIds: grievance.relatedGrievances }
      );
    }

    // 4. Create Notifications
    // Student confirmation notification
    await Notification.create({
      userId: req.user._id,
      title: 'Grievance Submitted',
      message: `Your complaint "${title}" (ID: #${grievance._id.toString().slice(-6)}) has been submitted and analyzed by AI.`,
      type: grievance.priority === 'CRITICAL' ? 'CRITICAL' : 'INFO',
      grievanceId: grievance._id,
    });

    // Notify admins if CRITICAL
    if (grievance.priority === 'CRITICAL') {
      const admins = await User.find({ role: 'ADMIN' });
      for (const admin of admins) {
        await Notification.create({
          userId: admin._id,
          title: '🚨 CRITICAL GRIEVANCE ALERT',
          message: `Critical complaint submitted at ${location}: "${title}" (Severity: ${grievance.severityScore}/100)`,
          type: 'CRITICAL',
          grievanceId: grievance._id,
        });
      }
    }

    // 5. Activity Log
    await ActivityLog.create({
      userId: req.user._id,
      action: 'GRIEVANCE_SUBMITTED',
      grievanceId: grievance._id,
      metadata: { priority: grievance.priority, severityScore: grievance.severityScore },
    });

    const populated = await Grievance.findById(grievance._id)
      .populate('submittedBy', 'name email studentId department')
      .populate('assignedTo', 'name email')
      .populate('relatedGrievances', 'title category priority status location createdAt');

    res.status(201).json({
      success: true,
      message: 'Your grievance has been submitted.',
      grievance: populated,
      aiAnalysis: aiResult,
      relatedComplaints: relatedList,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get All Grievances (Search, Filter, Pagination, Role Scoped)
 */
exports.getGrievances = async (req, res, next) => {
  try {
    const {
      search,
      status,
      priority,
      department,
      category,
      location,
      minSeverity,
      sortBy = 'newest',
      page = 1,
      limit = 50,
    } = req.query;

    const query = {};

    // Students only see their own complaints
    if (req.user.role === 'STUDENT') {
      query.submittedBy = req.user._id;
    }

    // Search query across Title, Description, Location, ID
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { location: searchRegex },
        { category: searchRegex },
      ];
    }

    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (department) query.assignedDepartment = department;
    if (category) query.category = category;
    if (location) query.location = new RegExp(location, 'i');
    if (minSeverity) query.severityScore = { $gte: Number(minSeverity) };

    // Sorting
    let sortOptions = { createdAt: -1 };
    if (sortBy === 'oldest') sortOptions = { createdAt: 1 };
    if (sortBy === 'severity') sortOptions = { severityScore: -1 };
    if (sortBy === 'priority') sortOptions = { priority: -1, severityScore: -1 };

    const skip = (Number(page) - 1) * Number(limit);

    const [grievances, total] = await Promise.all([
      Grievance.find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(Number(limit))
        .populate('submittedBy', 'name email studentId department')
        .populate('assignedTo', 'name email')
        .populate('relatedGrievances', 'title status priority'),
      Grievance.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      count: grievances.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      grievances,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get Grievance by ID
 */
exports.getGrievanceById = async (req, res, next) => {
  try {
    const grievance = await Grievance.findById(req.params.id)
      .populate('submittedBy', 'name email studentId department phone year')
      .populate('assignedTo', 'name email department')
      .populate('relatedGrievances', 'title category priority status location severityScore createdAt');

    if (!grievance) {
      return res.status(404).json({ success: false, message: 'Grievance not found' });
    }

    // Role check: Students can only view their own
    if (req.user.role === 'STUDENT' && grievance.submittedBy._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this grievance' });
    }

    const aiAnalysis = await AIAnalysis.findOne({ grievanceId: grievance._id });

    res.status(200).json({
      success: true,
      grievance,
      aiAnalysis,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update Grievance (Admin actions: status, department, assignedTo, priority)
 */
exports.updateGrievance = async (req, res, next) => {
  try {
    const { status, assignedDepartment, assignedTo, priority } = req.body;

    const grievance = await Grievance.findById(req.params.id);
    if (!grievance) {
      return res.status(404).json({ success: false, message: 'Grievance not found' });
    }

    const previousStatus = grievance.status;

    if (status) {
      grievance.status = status;
      if (status === 'RESOLVED') {
        grievance.resolvedAt = new Date();
      }
    }
    if (assignedDepartment) grievance.assignedDepartment = assignedDepartment;
    if (assignedTo) grievance.assignedTo = assignedTo;
    if (priority) grievance.priority = priority;

    await grievance.save();

    // Create Notification for Student
    await Notification.create({
      userId: grievance.submittedBy,
      title: `Grievance #${grievance._id.toString().slice(-6)} Updated`,
      message: `Status updated to ${grievance.status}${assignedDepartment ? ` under ${assignedDepartment}` : ''}.`,
      type: status === 'RESOLVED' ? 'SUCCESS' : 'INFO',
      grievanceId: grievance._id,
    });

    // Log Activity
    await ActivityLog.create({
      userId: req.user._id,
      action: 'GRIEVANCE_UPDATED',
      grievanceId: grievance._id,
      metadata: { previousStatus, newStatus: grievance.status, updatedFields: req.body },
    });

    const updated = await Grievance.findById(grievance._id)
      .populate('submittedBy', 'name email studentId department phone year')
      .populate('assignedTo', 'name email department')
      .populate('relatedGrievances', 'title category priority status location severityScore createdAt');

    res.status(200).json({
      success: true,
      message: 'Grievance updated successfully.',
      grievance: updated,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete Grievance (Admin only)
 */
exports.deleteGrievance = async (req, res, next) => {
  try {
    const grievance = await Grievance.findById(req.params.id);
    if (!grievance) {
      return res.status(404).json({ success: false, message: 'Grievance not found' });
    }

    await Promise.all([
      Grievance.findByIdAndDelete(req.params.id),
      AIAnalysis.deleteMany({ grievanceId: req.params.id }),
    ]);

    await ActivityLog.create({
      userId: req.user._id,
      action: 'GRIEVANCE_DELETED',
      metadata: { grievanceId: req.params.id, title: grievance.title },
    });

    res.status(200).json({
      success: true,
      message: 'Grievance deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};
