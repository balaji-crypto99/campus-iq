const mongoose = require('mongoose');

const GrievanceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    category: {
      type: String,
      default: 'General',
      enum: [
        'Academics',
        'Hostel',
        'Mess/Canteen',
        'Infrastructure',
        'Electricity',
        'Water',
        'Internet/Wi-Fi',
        'Transportation',
        'Library',
        'Security',
        'Cleanliness',
        'Faculty',
        'Finance',
        'Other',
        'General',
      ],
    },
    subCategory: {
      type: String,
      default: 'General',
    },
    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    assignedDepartment: {
      type: String,
      default: 'General Administration',
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    priority: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
      default: 'MEDIUM',
    },
    severityScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 50,
    },
    status: {
      type: String,
      enum: ['SUBMITTED', 'PENDING', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'REJECTED'],
      default: 'SUBMITTED',
    },
    sentiment: {
      type: String,
      enum: ['POSITIVE', 'NEUTRAL', 'NEGATIVE', 'VERY_NEGATIVE'],
      default: 'NEUTRAL',
    },
    aiSummary: {
      type: String,
      default: '',
    },
    recommendedAction: {
      type: String,
      default: '',
    },
    urgency: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
      default: 'MEDIUM',
    },
    keywords: [
      {
        type: String,
      },
    ],
    relatedGrievances: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Grievance',
      },
    ],
    aiStatus: {
      type: String,
      enum: ['PENDING', 'SUCCESS', 'FAILED'],
      default: 'PENDING',
    },
    imageUrl: {
      type: String,
      default: '',
    },
    resolvedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for fast filtering & search
GrievanceSchema.index({ title: 'text', description: 'text', location: 'text' });
GrievanceSchema.index({ status: 1, priority: 1, category: 1, location: 1 });

module.exports = mongoose.model('Grievance', GrievanceSchema);
