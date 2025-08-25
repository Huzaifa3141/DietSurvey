import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../index';
import { generateToken } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';
import { body, validationResult } from 'express-validator';

const router = Router();

// Validation middleware
const validateLogin = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 })
];

const validateRegistration = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('name').trim().isLength({ min: 2 }),
  body('category').isIn(['TEACHING_STAFF', 'NON_TEACHING_STAFF', 'STUDENT']),
  body('gender').isIn(['MALE', 'FEMALE']),
  body('age').isInt({ min: 16, max: 100 }),
  body('department').optional().trim(),
  body('studentId').optional().trim(),
  body('staffId').optional().trim()
];

// Participant Registration
router.post('/register', validateRegistration, asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      error: 'Validation failed', 
      details: errors.array() 
    });
  }

  const {
    email,
    password,
    name,
    category,
    gender,
    age,
    department,
    studentId,
    staffId
  } = req.body;

  // Check if participant already exists
  const existingParticipant = await prisma.participant.findUnique({
    where: { email }
  });

  if (existingParticipant) {
    return res.status(400).json({ 
      error: 'Participant with this email already exists' 
    });
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 12);

  // Create participant
  const participant = await prisma.participant.create({
    data: {
      email,
      name,
      category,
      gender,
      age: parseInt(age as string),
      department,
      studentId,
      staffId
    },
    select: {
      id: true,
      email: true,
      name: true,
      category: true,
      gender: true,
      age: true,
      department: true,
      studentId: true,
      staffId: true,
      createdAt: true
    }
  });

  // Generate JWT token
  const token = generateToken({
    id: participant.id,
    email: participant.email,
    category: participant.category
  });

  return res.status(201).json({
    message: 'Participant registered successfully',
    participant,
    token
  });
}));

// Participant Login
router.post('/login', validateLogin, asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      error: 'Validation failed', 
      details: errors.array() 
    });
  }

  const { email, password } = req.body;

  // Find participant
  const participant = await prisma.participant.findUnique({
    where: { email }
  });

  if (!participant) {
    return res.status(401).json({ 
      error: 'Invalid email or password' 
    });
  }

  // For now, we'll use a simple password check
  // In a real app, you'd store hashed passwords
  if (password !== 'password123') { // Default password for demo
    return res.status(401).json({ 
      error: 'Invalid email or password' 
    });
  }

  // Generate JWT token
  const token = generateToken({
    id: participant.id,
    email: participant.email,
    category: participant.category
  });

  return res.json({
    message: 'Login successful',
    participant: {
      id: participant.id,
      email: participant.email,
      name: participant.name,
      category: participant.category,
      gender: participant.gender,
      age: participant.age,
      department: participant.department,
      studentId: participant.studentId,
      staffId: participant.staffId
    },
    token
  });
}));

// Get current participant profile
router.get('/profile', asyncHandler(async (req: Request, res: Response) => {
  // This would typically use the auth middleware
  // For demo purposes, we'll return a message
  return res.json({ 
    message: 'Profile endpoint - requires authentication' 
  });
}));

// Refresh token
router.post('/refresh', asyncHandler(async (req: Request, res: Response) => {
  // Token refresh logic would go here
  return res.json({ 
    message: 'Token refresh endpoint' 
  });
}));

export default router;
