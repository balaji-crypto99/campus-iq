const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../backend/.env') });

const User = require('../../backend/src/models/User');
const Grievance = require('../../backend/src/models/Grievance');
const AIAnalysis = require('../../backend/src/models/AIAnalysis');
const Department = require('../../backend/src/models/Department');
const Notification = require('../../backend/src/models/Notification');
const ActivityLog = require('../../backend/src/models/ActivityLog');
const { analyzeGrievance } = require('../../backend/src/services/ai/aiProvider');
const { connectDB, disconnectDB } = require('../../backend/src/config/db');

const DEPARTMENTS = [
  { name: 'IT Support', code: 'IT', description: 'Network, Wi-Fi, systems & campus portal management', headEmail: 'it.head@campus.edu' },
  { name: 'Facilities & Maintenance', code: 'FAC', description: 'Civil infrastructure, plumbing, carpentry & repairs', headEmail: 'facilities.head@campus.edu' },
  { name: 'Electrical Maintenance', code: 'ELEC', description: 'Power grid, generators, wiring & lighting repairs', headEmail: 'elec.head@campus.edu' },
  { name: 'Hostel Management', code: 'HOSTEL', description: 'Hostel rooms, dining mess, wardens & residential care', headEmail: 'hostel.head@campus.edu' },
  { name: 'Academic Affairs', code: 'ACAD', description: 'Curriculum, examination, faculty & classroom resources', headEmail: 'acad.head@campus.edu' },
  { name: 'Security & Safety', code: 'SEC', description: 'Campus guards, access control, surveillance & safety', headEmail: 'security.head@campus.edu' },
  { name: 'Sanitation & Hygiene', code: 'CLEAN', description: 'Housekeeping, waste disposal & hygiene services', headEmail: 'hygiene.head@campus.edu' },
  { name: 'Library Department', code: 'LIB', description: 'Library books, digital access & study hall operations', headEmail: 'library.head@campus.edu' },
  { name: 'Finance Office', code: 'FIN', description: 'Tuition fees, scholarships, refunds & receipts', headEmail: 'finance.head@campus.edu' },
  { name: 'General Administration', code: 'GEN', description: 'Overall student welfare & campus governance', headEmail: 'admin.head@campus.edu' },
];

const LOCATIONS = [
  'Block A - Room 101',
  'Block B - 2nd Floor Corridor',
  'Block B - Computer Lab 3',
  'Block C - Lecture Hall 4',
  'Hostel A - Room 208',
  'Hostel B - Ground Floor Washroom',
  'Hostel C - Dining Mess Hall',
  'Central Library - 1st Floor Study Zone',
  'Cafeteria - Outdoor Seating Area',
  'Main Academic Building Entrance',
  'Sports Complex - Indoor Basketball Court',
  'Main Gate Security Post',
];

const REALISTIC_COMPLAINTS = [
  {
    title: 'Exposed live wiring sparking near Block B Room 204',
    description: 'A loose conduit pipe fell off the wall exposing raw electrical wiring. Visible sparks were emitted when someone turned on the corridor lights. Severe safety and fire risk for students.',
    location: 'Block B - 2nd Floor Corridor',
    category: 'Electricity',
  },
  {
    title: 'Campus Wi-Fi completely unresponsive in Block B Labs before submission',
    description: 'The Wi-Fi network (CampusIQ-Student) has been dropping connections continuously for 48 hours. Computer Science students are unable to submit their final projects before the midnight deadline.',
    location: 'Block B - Computer Lab 3',
    category: 'Internet/Wi-Fi',
  },
  {
    title: 'Hostel B washroom pipeline rupture causing severe flooding',
    description: 'Main water inlet pipe snapped in the ground floor male washrooms. Water is accumulating rapidly and entering adjacent dorm rooms. Need plumber immediately.',
    location: 'Hostel B - Ground Floor Washroom',
    category: 'Water',
  },
  {
    title: 'Expired food served at Hostel C Mess during dinner service',
    description: 'Several students noticed sour milk and moldy bread served during Sunday dinner. Three students reported food poisoning symptoms. Request urgent food audit.',
    location: 'Hostel C - Dining Mess Hall',
    category: 'Mess/Canteen',
  },
  {
    title: 'Projector color distortion and audio failure in Lecture Hall 4',
    description: 'The main overhead projector flickers purple and the HDMI audio cuts off every 5 minutes during lectures, disrupting CS301 classes.',
    location: 'Block C - Lecture Hall 4',
    category: 'Infrastructure',
  },
  {
    title: 'Broken window latch in Hostel A Room 208 allowing rainwater leak',
    description: 'During rainstorms, water seeps into the room soaking study desks and power sockets. Lock is rusted shut.',
    location: 'Hostel A - Room 208',
    category: 'Hostel',
  },
  {
    title: 'Insufficient lighting near Sports Complex parking lot at night',
    description: 'Three lampposts behind the sports complex have been dead for a week. The pathway is pitch dark after 8 PM, raising safety concerns for female students.',
    location: 'Sports Complex - Indoor Basketball Court',
    category: 'Security',
  },
  {
    title: 'Uncleaned garbage bins overflowing near Cafeteria',
    description: 'Trash bins have not been emptied for 3 days, causing bad odor and attracting stray animals near outdoor dining tables.',
    location: 'Cafeteria - Outdoor Seating Area',
    category: 'Cleanliness',
  },
  {
    title: 'Digital library portal server error 500 when accessing IEEE papers',
    description: 'Students attempting to access IEEE Xplore digital research papers receive an internal server error. Essential for ongoing thesis research.',
    location: 'Central Library - 1st Floor Study Zone',
    category: 'Library',
  },
  {
    title: 'Duplicate tuition fee charge reflected on student portal statement',
    description: 'Semester 6 tuition fee was deducted twice via the payment gateway portal. Receipt numbers #FIN-9021 and #FIN-9022 show double charge.',
    location: 'Main Academic Building Entrance',
    category: 'Finance',
  },
];

const seedData = async () => {
  try {
    console.log('[Seed] Connecting to database...');
    await connectDB();

    console.log('[Seed] Cleaning old collection data...');
    await Promise.all([
      User.deleteMany({}),
      Grievance.deleteMany({}),
      AIAnalysis.deleteMany({}),
      Department.deleteMany({}),
      Notification.deleteMany({}),
      ActivityLog.deleteMany({}),
    ]);

    // 1. Seed Departments
    console.log('[Seed] Seeding departments...');
    const createdDepts = await Department.insertMany(DEPARTMENTS);

    // 2. Seed Users (50 users: 5 admins, 45 students)
    console.log('[Seed] Seeding 50 realistic users...');
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('password123', salt);

    const userDocs = [];

    // Admins
    userDocs.push({
      name: 'Chief Admin (System)',
      email: 'admin@campus.edu',
      passwordHash,
      role: 'ADMIN',
      department: 'General Administration',
      phone: '+1-555-0100',
    });
    userDocs.push({
      name: 'Dr. Robert Vance (IT Head)',
      email: 'robert.it@campus.edu',
      passwordHash,
      role: 'ADMIN',
      department: 'IT Support',
      phone: '+1-555-0101',
    });
    userDocs.push({
      name: 'Sarah Connor (Hostel Director)',
      email: 'sarah.hostel@campus.edu',
      passwordHash,
      role: 'ADMIN',
      department: 'Hostel Management',
      phone: '+1-555-0102',
    });
    userDocs.push({
      name: 'Eng. Marcus Brody (Facilities Head)',
      email: 'marcus.fac@campus.edu',
      passwordHash,
      role: 'ADMIN',
      department: 'Facilities & Maintenance',
      phone: '+1-555-0103',
    });
    userDocs.push({
      name: 'Lt. James Miller (Security Head)',
      email: 'james.sec@campus.edu',
      passwordHash,
      role: 'ADMIN',
      department: 'Security & Safety',
      phone: '+1-555-0104',
    });

    // Demo Student User
    userDocs.push({
      name: 'Alex Mercer (Demo Student)',
      email: 'student@campus.edu',
      passwordHash,
      role: 'STUDENT',
      studentId: 'STU2026001',
      department: 'Computer Science',
      year: '3rd Year',
      phone: '+1-555-0199',
    });

    // Generate 44 additional realistic students
    const firstNames = ['David', 'Emma', 'Liam', 'Olivia', 'Noah', 'Ava', 'Ethan', 'Sophia', 'Mason', 'Isabella', 'William', 'Mia', 'James', 'Charlotte', 'Benjamin', 'Amelia', 'Lucas', 'Harper', 'Henry', 'Evelyn', 'Alexander', 'Abigail', 'Michael', 'Emily'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson', 'White'];
    const depts = ['Computer Science', 'Electrical Eng', 'Mechanical Eng', 'Civil Eng', 'Biotechnology', 'Business Admin'];
    const years = ['1st Year', '2nd Year', '3rd Year', '4th Year'];

    for (let i = 2; i <= 45; i++) {
      const fn = firstNames[i % firstNames.length];
      const ln = lastNames[(i * 3) % lastNames.length];
      userDocs.push({
        name: `${fn} ${ln}`,
        email: `student${i}@campus.edu`,
        passwordHash,
        role: 'STUDENT',
        studentId: `STU2026${100 + i}`,
        department: depts[i % depts.length],
        year: years[i % years.length],
        phone: `+1-555-02${i < 10 ? '0' + i : i}`,
      });
    }

    const createdUsers = await User.insertMany(userDocs);
    const studentUsers = createdUsers.filter((u) => u.role === 'STUDENT');
    const adminUser = createdUsers.find((u) => u.email === 'admin@campus.edu');

    console.log(`[Seed] Created ${createdUsers.length} users successfully.`);

    // 3. Seed 100 Realistic Grievances
    console.log('[Seed] Seeding 100 grievances with AI analysis and duplicate links...');

    const grievanceDocs = [];
    const statuses = ['SUBMITTED', 'PENDING', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED'];

    for (let i = 0; i < 100; i++) {
      const template = REALISTIC_COMPLAINTS[i % REALISTIC_COMPLAINTS.length];
      const student = studentUsers[i % studentUsers.length];
      const loc = LOCATIONS[i % LOCATIONS.length];

      // Add slight variation to title for realism
      const titleVar = i > 9 ? `${template.title} (Ticket #${1000 + i})` : template.title;
      const status = statuses[i % statuses.length];

      // Generate realistic past dates within 14 days
      const daysAgo = Math.floor(Math.random() * 14);
      const createdAt = new Date();
      createdAt.setDate(createdAt.getDate() - daysAgo);

      grievanceDocs.push({
        title: titleVar,
        description: template.description,
        location: loc,
        category: template.category,
        submittedBy: student._id,
        status,
        createdAt,
        updatedAt: createdAt,
        resolvedAt: status === 'RESOLVED' ? new Date(createdAt.getTime() + 86400000) : null,
      });
    }

    const createdGrievances = await Grievance.insertMany(grievanceDocs);

    // 4. Run AI Analysis for each Grievance & Create AIAnalysis docs
    console.log('[Seed] Running AI Engine across all 100 grievances...');
    for (let g of createdGrievances) {
      const aiRes = await analyzeGrievance(g.title, g.description, g.location, g.category);

      await AIAnalysis.create({
        grievanceId: g._id,
        category: aiRes.category,
        subCategory: aiRes.subCategory,
        priority: aiRes.priority,
        severityScore: aiRes.severityScore,
        sentiment: aiRes.sentiment,
        summary: aiRes.summary,
        recommendedAction: aiRes.recommendedAction,
        department: aiRes.department,
        urgency: aiRes.urgency,
        keywords: aiRes.keywords,
        reasoning: aiRes.reasoning || '',
      });

      g.category = aiRes.category;
      g.subCategory = aiRes.subCategory;
      g.priority = aiRes.priority;
      g.severityScore = aiRes.severityScore;
      g.sentiment = aiRes.sentiment;
      g.aiSummary = aiRes.summary;
      g.recommendedAction = aiRes.recommendedAction;
      g.assignedDepartment = aiRes.department;
      g.urgency = aiRes.urgency;
      g.keywords = aiRes.keywords;
      g.aiStatus = 'SUCCESS';

      await g.save();
    }

    // 5. Link Related/Duplicate Complaints
    console.log('[Seed] Linking related duplicate complaint clusters...');
    for (let i = 0; i < createdGrievances.length; i++) {
      const target = createdGrievances[i];
      const related = createdGrievances.filter(
        (other, idx) => idx !== i && (other.category === target.category || other.location === target.location)
      ).slice(0, 3).map((r) => r._id);

      target.relatedGrievances = related;
      await target.save();
    }

    // 6. Create Seed Notifications & Activity Logs
    console.log('[Seed] Generating notification feeds and activity logs...');
    for (let i = 0; i < 15; i++) {
      const g = createdGrievances[i];
      await Notification.create({
        userId: g.submittedBy,
        title: `Complaint #${g._id.toString().slice(-6)} Status Update`,
        message: `Your grievance "${g.title.slice(0, 40)}..." has been set to ${g.status}.`,
        type: g.priority === 'CRITICAL' ? 'CRITICAL' : 'INFO',
        grievanceId: g._id,
      });

      await ActivityLog.create({
        userId: adminUser._id,
        action: 'STATUS_UPDATED',
        grievanceId: g._id,
        metadata: { status: g.status, priority: g.priority },
      });
    }

    console.log('\n==================================================');
    console.log('✅ DATABASE SEED COMPLETE!');
    console.log('==================================================');
    console.log('Created:');
    console.log(`- ${createdDepts.length} Departments`);
    console.log(`- ${createdUsers.length} Users`);
    console.log(`- ${createdGrievances.length} Grievances with AI Analysis`);
    console.log('\nDEMO ACCOUNTS FOR LOGIN:');
    console.log('1. STUDENT ACCOUNT:');
    console.log('   Email:    student@campus.edu');
    console.log('   Password: password123');
    console.log('2. ADMIN ACCOUNT:');
    console.log('   Email:    admin@campus.edu');
    console.log('   Password: password123');
    console.log('==================================================\n');

  } catch (err) {
    console.error('[Seed Error]', err);
  } finally {
    await disconnectDB();
  }
};

if (require.main === module) {
  seedData();
}

module.exports = seedData;
