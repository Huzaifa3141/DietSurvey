import { Router, Request, Response } from 'express';
import { prisma } from '../index';
import { asyncHandler } from '../middleware/errorHandler';
import { body, validationResult } from 'express-validator';

const router = Router();

// Validation middleware
const validateParticipant = [
  body('email').isEmail().normalizeEmail(),
  body('name').trim().isLength({ min: 2, max: 100 }),
  body('category').isIn(['TEACHING_STAFF', 'NON_TEACHING_STAFF', 'STUDENT']),
  body('gender').isIn(['MALE', 'FEMALE']),
  body('age').isInt({ min: 16, max: 100 }),
  body('department').optional().trim(),
  body('studentId').optional().trim(),
  body('staffId').optional().trim()
];

// Get all participants
router.get('/', asyncHandler(async (req: Request, res: Response) => {
  const { page = 1, limit = 50, category, gender, department } = req.query;

  const skip = (Number(page) - 1) * Number(limit);

  let whereClause: any = {};
  
  if (category) whereClause.category = category;
  if (gender) whereClause.gender = gender;
  if (department) whereClause.department = { contains: department as string };

  const participants = await prisma.participant.findMany({
    where: whereClause,
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
      createdAt: true,
      _count: {
        select: { responses: true }
      }
    },
    orderBy: { name: 'asc' },
    skip,
    take: Number(limit)
  });

  const total = await prisma.participant.count({ where: whereClause });

  return res.json({
    participants,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / Number(limit))
    }
  });
}));

// Get participant by ID
router.get('/:id', asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const participant = await prisma.participant.findUnique({
    where: { id },
    include: {
      _count: {
        select: { responses: true, advisory: true }
      }
    }
  });

  if (!participant) {
    return res.status(404).json({ 
      error: 'Participant not found' 
    });
  }

  return res.json(participant);
}));

// Create new participant
router.post('/', validateParticipant, asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      error: 'Validation failed', 
      details: errors.array() 
    });
  }

  const {
    email,
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
    }
  });

  return res.status(201).json({
    message: 'Participant created successfully',
    participant
  });
}));

// Update participant
router.put('/:id', validateParticipant, asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      error: 'Validation failed', 
      details: errors.array() 
    });
  }

  const { id } = req.params;
  const {
    email,
    name,
    category,
    gender,
    age,
    department,
    studentId,
    staffId
  } = req.body;

  // Check if participant exists
  const existingParticipant = await prisma.participant.findUnique({
    where: { id }
  });

  if (!existingParticipant) {
    return res.status(404).json({ 
      error: 'Participant not found' 
    });
  }

  // Check if email is already taken by another participant
  if (email !== existingParticipant.email) {
    const emailTaken = await prisma.participant.findUnique({
      where: { email }
    });

    if (emailTaken) {
      return res.status(400).json({ 
        error: 'Email is already taken by another participant' 
      });
    }
  }

  // Update participant
  const updatedParticipant = await prisma.participant.update({
    where: { id },
    data: {
      email,
      name,
      category,
      gender,
      age: parseInt(age as string),
      department,
      studentId,
      staffId
    }
  });

  return res.json({
    message: 'Participant updated successfully',
    participant: updatedParticipant
  });
}));

// Delete participant
router.delete('/:id', asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const participant = await prisma.participant.findUnique({
    where: { id }
  });

  if (!participant) {
    return res.status(404).json({ 
      error: 'Participant not found' 
    });
  }

  // Check if participant has responses
  const responseCount = await prisma.response.count({
    where: { participantId: id }
  });

  if (responseCount > 0) {
    return res.status(400).json({ 
      error: 'Cannot delete participant with existing survey responses' 
    });
  }

  await prisma.participant.delete({
    where: { id }
  });

  return res.json({
    message: 'Participant deleted successfully'
  });
}));

// Get participant statistics
router.get('/stats/overview', asyncHandler(async (req: Request, res: Response) => {
  const totalParticipants = await prisma.participant.count();

  const participantsByCategory = await prisma.participant.groupBy({
    by: ['category'],
    _count: {
      id: true
    }
  });

  const participantsByGender = await prisma.participant.groupBy({
    by: ['gender'],
    _count: {
      id: true
    }
  });

  const participantsByDepartment = await prisma.participant.groupBy({
    by: ['department'],
    _count: {
      id: true
    },
    where: {
      department: { not: null }
    }
  });

  const ageStats = await prisma.participant.aggregate({
    _avg: { age: true },
    _min: { age: true },
    _max: { age: true }
  });

  const participantsWithResponses = await prisma.participant.count({
    where: {
      responses: { some: {} }
    }
  });

  return res.json({
    overview: {
      totalParticipants,
      participantsWithResponses,
      responseRate: totalParticipants > 0 ? (participantsWithResponses / totalParticipants * 100).toFixed(2) : 0
    },
    byCategory: participantsByCategory,
    byGender: participantsByGender,
    byDepartment: participantsByDepartment,
    ageStats
  });
}));

// Get participants by category
router.get('/category/:category', asyncHandler(async (req: Request, res: Response) => {
  const { category } = req.params;
  const { page = 1, limit = 50 } = req.query;

  const skip = (Number(page) - 1) * Number(limit);

  const participants = await prisma.participant.findMany({
    where: { category: category as any },
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
      createdAt: true,
      _count: {
        select: { responses: true }
      }
    },
    orderBy: { name: 'asc' },
    skip,
    take: Number(limit)
  });

  const total = await prisma.participant.count({
    where: { category: category as any }
  });

  return res.json({
    participants,
    category,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / Number(limit))
    }
  });
}));

// Export participants to CSV
router.get('/export/csv', asyncHandler(async (req: Request, res: Response) => {
  const participants = await prisma.participant.findMany({
    select: {
      name: true,
      email: true,
      category: true,
      gender: true,
      age: true,
      department: true,
      studentId: true,
      staffId: true,
      createdAt: true
    },
    orderBy: { name: 'asc' }
  });

  // Convert to CSV format
  const csvHeaders = [
    'Name',
    'Email',
    'Category',
    'Gender',
    'Age',
    'Department',
    'Student ID',
    'Staff ID',
    'Registration Date'
  ];

  const csvRows = participants.map(participant => [
    participant.name,
    participant.email,
    participant.category,
    participant.gender,
    participant.age,
    participant.department || '',
    participant.studentId || '',
    participant.staffId || '',
    participant.createdAt.toISOString()
  ]);

  const csvContent = [csvHeaders, ...csvRows]
    .map(row => row.map(field => `"${field}"`).join(','))
    .join('\n');

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="participants.csv"');
  return res.send(csvContent);
}));

export default router;
