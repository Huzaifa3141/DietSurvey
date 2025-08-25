import { Router, Request, Response } from 'express';
import { prisma } from '../index';
import { asyncHandler } from '../middleware/errorHandler';
import { body, validationResult } from 'express-validator';

const router = Router();

// Validation middleware
const validateResponse = [
  body('surveyId').isString(),
  body('participantId').isString(),
  body('responses').isArray({ min: 1 })
];

// Submit survey responses
router.post('/', validateResponse, asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      error: 'Validation failed', 
      details: errors.array() 
    });
  }

  const { surveyId, participantId, responses } = req.body;

  // Verify survey exists and is active
  const survey = await prisma.survey.findUnique({
    where: { id: surveyId, isActive: true }
  });

  if (!survey) {
    return res.status(404).json({ 
      error: 'Survey not found or inactive' 
    });
  }

  // Verify participant exists
  const participant = await prisma.participant.findUnique({
    where: { id: participantId }
  });

  if (!participant) {
    return res.status(404).json({ 
      error: 'Participant not found' 
    });
  }

  // Check if participant already submitted this survey
  const existingResponse = await prisma.response.findFirst({
    where: {
      surveyId,
      participantId
    }
  });

  if (existingResponse) {
    return res.status(400).json({ 
      error: 'Participant has already submitted this survey' 
    });
  }

  // Create responses in a transaction
  const createdResponses = await prisma.$transaction(async (tx) => {
    const responsePromises = responses.map((response: any) =>
      tx.response.create({
        data: {
          participantId,
          questionId: response.questionId,
          surveyId,
          answer: response.answer
        }
      })
    );

    return Promise.all(responsePromises);
  });

  return res.status(201).json({
    message: 'Survey responses submitted successfully',
    responses: createdResponses,
    totalResponses: createdResponses.length
  });
}));

// Get all responses for a survey
router.get('/survey/:surveyId', asyncHandler(async (req: Request, res: Response) => {
  const { surveyId } = req.params;
  const { page = 1, limit = 50 } = req.query;

  const skip = (Number(page) - 1) * Number(limit);

  const responses = await prisma.response.findMany({
    where: { surveyId },
    include: {
      participant: {
        select: {
          id: true,
          name: true,
          category: true,
          gender: true,
          age: true,
          department: true
        }
      },
      question: {
        select: {
          id: true,
          text: true,
          type: true,
          order: true
        }
      }
    },
    orderBy: [
      { participant: { name: 'asc' } },
      { question: { order: 'asc' } }
    ],
    skip,
    take: Number(limit)
  });

  const total = await prisma.response.count({
    where: { surveyId }
  });

  return res.json({
    responses,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / Number(limit))
    }
  });
}));

// Get responses by participant
router.get('/participant/:participantId', asyncHandler(async (req: Request, res: Response) => {
  const { participantId } = req.params;

  const responses = await prisma.response.findMany({
    where: { participantId },
    include: {
      question: {
        select: {
          id: true,
          text: true,
          type: true,
          order: true
        }
      },
      survey: {
        select: {
          id: true,
          title: true,
          description: true
        }
      }
    },
    orderBy: [
      { survey: { createdAt: 'desc' } },
      { question: { order: 'asc' } }
    ]
  });

  return res.json({
    responses,
    total: responses.length
  });
}));

// Get response statistics
router.get('/stats', asyncHandler(async (req: Request, res: Response) => {
  const { surveyId, category, gender } = req.query;

  let whereClause: any = {};
  
  if (surveyId) {
    whereClause.surveyId = surveyId;
  }

  if (category || gender) {
    whereClause.participant = {};
    if (category) whereClause.participant.category = category;
    if (gender) whereClause.participant.gender = gender;
  }

  const totalResponses = await prisma.response.count({ where: whereClause });

  const responsesByCategory = await prisma.response.groupBy({
    by: ['surveyId'],
    where: whereClause,
    _count: {
      id: true
    }
  });

  const responsesByQuestion = await prisma.response.groupBy({
    by: ['questionId'],
    where: whereClause,
    _count: {
      id: true
    }
  });

  return res.json({
    totalResponses,
    responsesByCategory,
    responsesByQuestion
  });
}));

// Export responses to CSV
router.get('/export/:surveyId', asyncHandler(async (req: Request, res: Response) => {
  const { surveyId } = req.params;

  const responses = await prisma.response.findMany({
    where: { surveyId },
    include: {
      participant: {
        select: {
          name: true,
          category: true,
          gender: true,
          age: true,
          department: true
        }
      },
      question: {
        select: {
          text: true,
          type: true,
          order: true
        }
      }
    },
    orderBy: [
      { participant: { name: 'asc' } },
      { question: { order: 'asc' } }
    ]
  });

  // Convert to CSV format
  const csvHeaders = [
    'Participant Name',
    'Category',
    'Gender',
    'Age',
    'Department',
    'Question',
    'Answer',
    'Submitted At'
  ];

  const csvRows = responses.map(response => [
    response.participant.name,
    response.participant.category,
    response.participant.gender,
    response.participant.age,
    response.participant.department || '',
    response.question.text,
    response.answer,
    response.createdAt.toISOString()
  ]);

  const csvContent = [csvHeaders, ...csvRows]
    .map(row => row.map(field => `"${field}"`).join(','))
    .join('\n');

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename="survey-responses-${surveyId}.csv"`);
  return res.send(csvContent);
}));

// Delete response (admin only)
router.delete('/:id', asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const response = await prisma.response.findUnique({
    where: { id }
  });

  if (!response) {
    return res.status(404).json({ 
      error: 'Response not found' 
    });
  }

  await prisma.response.delete({
    where: { id }
  });

  return res.json({
    message: 'Response deleted successfully'
  });
}));

export default router;
