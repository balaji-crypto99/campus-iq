const mongoose = require('mongoose');

const AIAnalysisSchema = new mongoose.Schema(
  {
    grievanceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Grievance',
      required: true,
      unique: true,
    },
    category: {
      type: String,
      required: true,
    },
    subCategory: {
      type: String,
      default: 'General',
    },
    priority: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
      required: true,
    },
    severityScore: {
      type: Number,
      min: 0,
      max: 100,
      required: true,
    },
    sentiment: {
      type: String,
      enum: ['POSITIVE', 'NEUTRAL', 'NEGATIVE', 'VERY_NEGATIVE'],
      required: true,
    },
    summary: {
      type: String,
      required: true,
    },
    recommendedAction: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      required: true,
    },
    urgency: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
      required: true,
    },
    keywords: [
      {
        type: String,
      },
    ],
    relatedComplaintIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Grievance',
      },
    ],
    reasoning: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('AIAnalysis', AIAnalysisSchema);
