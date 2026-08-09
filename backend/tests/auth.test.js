const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../src/server');
const User = require('../src/models/User');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await User.deleteMany({});
});

describe('Auth API Endpoints', () => {
  it('should register a new student user', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'John Doe',
      email: 'john@campus.edu',
      password: 'password123',
      role: 'STUDENT',
      studentId: 'STU1001',
      department: 'Computer Science',
    });

    expect(res.statusCode).toEqual(201);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toEqual('john@campus.edu');
    expect(res.body.user.role).toEqual('STUDENT');
  });

  it('should login an existing user', async () => {
    await request(app).post('/api/auth/register').send({
      name: 'Jane Admin',
      email: 'admin@campus.edu',
      password: 'adminpassword',
      role: 'ADMIN',
    });

    const res = await request(app).post('/api/auth/login').send({
      email: 'admin@campus.edu',
      password: 'adminpassword',
    });

    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.role).toEqual('ADMIN');
  });

  it('should reject invalid credentials', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'nonexistent@campus.edu',
      password: 'wrongpassword',
    });

    expect(res.statusCode).toEqual(401);
    expect(res.body.success).toBe(false);
  });
});
