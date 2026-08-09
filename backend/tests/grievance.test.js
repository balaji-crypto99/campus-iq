const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../src/server');
const User = require('../src/models/User');
const Grievance = require('../src/models/Grievance');

let mongoServer;
let studentToken;
let adminToken;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);

  // Register student
  const sRes = await request(app).post('/api/auth/register').send({
    name: 'Alice Student',
    email: 'alice@campus.edu',
    password: 'password123',
    role: 'STUDENT',
  });
  studentToken = sRes.body.token;

  // Register admin
  const aRes = await request(app).post('/api/auth/register').send({
    name: 'Bob Admin',
    email: 'admin@campus.edu',
    password: 'password123',
    role: 'ADMIN',
  });
  adminToken = aRes.body.token;
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Grievance API Endpoints', () => {
  let createdGrievanceId;

  it('should submit a grievance and execute AI analysis', async () => {
    const res = await request(app)
      .post('/api/grievances')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({
        title: 'Severe Electrical Sparks in Block B 2nd Floor',
        description: 'Exposed copper wire sparking near room 204. Extremely dangerous fire hazard.',
        location: 'Block B - 2nd Floor',
        category: 'Electricity',
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body.success).toBe(true);
    expect(res.body.grievance).toBeDefined();
    expect(res.body.grievance.priority).toEqual('CRITICAL');
    expect(res.body.grievance.severityScore).toBeGreaterThanOrEqual(80);
    expect(res.body.grievance.assignedDepartment).toEqual('Electrical Maintenance');

    createdGrievanceId = res.body.grievance._id;
  });

  it('should list grievances for student', async () => {
    const res = await request(app)
      .get('/api/grievances')
      .set('Authorization', `Bearer ${studentToken}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.grievances.length).toBeGreaterThan(0);
  });

  it('should allow admin to update grievance status', async () => {
    const res = await request(app)
      .put(`/api/grievances/${createdGrievanceId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        status: 'IN_PROGRESS',
        assignedDepartment: 'Electrical Maintenance',
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.grievance.status).toEqual('IN_PROGRESS');
  });
});
