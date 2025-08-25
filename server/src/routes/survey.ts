import { Router, Request, Response } from 'express';
import { prisma } from '../index';
import { asyncHandler } from '../middleware/errorHandler';
import { body, validationResult } from 'express-validator';

const router = Router();

// Validation middleware for survey submission
const validateSurveySubmission = [
  body('name').trim().isLength({ min: 2, max: 100 }),
  body('email').isEmail().normalizeEmail(),
  body('category').isIn(['TEACHING_STAFF', 'NON_TEACHING_STAFF', 'STUDENT']),
  body('gender').isIn(['MALE', 'FEMALE']),
  body('age').isInt({ min: 16, max: 100 }),
  body('department').trim().isLength({ min: 2 }),
  body('q1').notEmpty().withMessage('Question 1 is required'),
  body('q2').notEmpty().withMessage('Question 2 is required'),
  body('q3').notEmpty().withMessage('Question 3 is required'),
  body('q4').notEmpty().withMessage('Question 4 is required'),
  body('q5').notEmpty().withMessage('Question 5 is required'),
  body('q6').notEmpty().withMessage('Question 6 is required'),
  body('q7').notEmpty().withMessage('Question 7 is required'),
  // q8 is optional
];

// Submit survey
router.post('/submit', validateSurveySubmission, asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      error: 'Validation failed', 
      details: errors.array() 
    });
  }

  const {
    name,
    email,
    category,
    gender,
    age,
    department,
    studentId,
    staffId,
    q1, q2, q3, q4, q5, q6, q7, q8
  } = req.body;

  try {
    // Create participant
    const participant = await prisma.participant.create({
      data: {
        name,
        email,
        category,
        gender,
        age: parseInt(age as string),
        department,
        studentId: studentId || null,
        staffId: staffId || null
      }
    });

    // Get the default survey (we'll use the first one or create one if none exists)
    let survey = await prisma.survey.findFirst({
      where: { isActive: true }
    });

    if (!survey) {
      // Create a default survey if none exists
      survey = await prisma.survey.create({
        data: {
          title: 'Diet & Eating Habits Survey',
          description: 'Survey about eating habits and dietary preferences',
          isActive: true
        }
      });

      // Create default questions
      const questions = [
        { text: 'How many meals do you eat per day?', type: 'MULTIPLE_CHOICE', order: 1 },
        { text: 'Do you eat breakfast regularly?', type: 'MULTIPLE_CHOICE', order: 2 },
        { text: 'How often do you consume fruits and vegetables?', type: 'MULTIPLE_CHOICE', order: 3 },
        { text: 'Do you drink enough water daily?', type: 'MULTIPLE_CHOICE', order: 4 },
        { text: 'How often do you eat fast food?', type: 'MULTIPLE_CHOICE', order: 5 },
        { text: 'Do you follow any specific diet?', type: 'MULTIPLE_CHOICE', order: 6 },
        { text: 'How would you rate your overall eating habits?', type: 'MULTIPLE_CHOICE', order: 7 },
        { text: 'Any additional comments about your diet?', type: 'TEXT', order: 8 }
      ];

      for (const questionData of questions) {
        await prisma.question.create({
          data: {
            ...questionData,
            surveyId: survey.id,
            required: true
          }
        });
      }
    }

    // Get questions for this survey
    const questions = await prisma.question.findMany({
      where: { surveyId: survey.id },
      orderBy: { order: 'asc' }
    });

    // Create responses for each question
    const responses = [
      { questionId: questions[0]?.id, answer: q1 },
      { questionId: questions[1]?.id, answer: q2 },
      { questionId: questions[2]?.id, answer: q3 },
      { questionId: questions[3]?.id, answer: q4 },
      { questionId: questions[4]?.id, answer: q5 },
      { questionId: questions[5]?.id, answer: q6 },
      { questionId: questions[6]?.id, answer: q7 },
      { questionId: questions[7]?.id, answer: q8 || '' }
    ].filter(response => response.questionId); // Only include responses for existing questions

    // Save all responses
    for (const response of responses) {
      await prisma.response.create({
        data: {
          participantId: participant.id,
          questionId: response.questionId!,
          surveyId: survey.id,
          answer: response.answer
        }
      });
    }

    return res.status(201).json({
      message: 'Survey submitted successfully',
      participantId: participant.id,
      surveyId: survey.id
    });

  } catch (error) {
    console.error('Error submitting survey:', error);
    return res.status(500).json({
      error: 'Failed to submit survey. Please try again.'
    });
  }
}));

// Get survey responses (for admin viewing)
router.get('/responses', asyncHandler(async (req: Request, res: Response) => {
  const { page = 1, limit = 50 } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  try {
    const responses = await prisma.response.findMany({
      include: {
        participant: {
          select: {
            name: true,
            email: true,
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
      ],
      skip,
      take: Number(limit)
    });

    const total = await prisma.response.count();

    return res.json({
      responses,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });

  } catch (error) {
    console.error('Error fetching responses:', error);
    return res.status(500).json({
      error: 'Failed to fetch survey responses'
    });
  }
}));

// Get survey statistics
router.get('/stats', asyncHandler(async (req: Request, res: Response) => {
  try {
    const totalParticipants = await prisma.participant.count();
    const totalResponses = await prisma.response.count();
    
    const participantsByCategory = await prisma.participant.groupBy({
      by: ['category'],
      _count: { id: true }
    });

    const participantsByGender = await prisma.participant.groupBy({
      by: ['gender'],
      _count: { id: true }
    });

    const ageStats = await prisma.participant.aggregate({
      _avg: { age: true },
      _min: { age: true },
      _max: { age: true }
    });

    return res.json({
      overview: {
        totalParticipants,
        totalResponses,
        averageResponsesPerParticipant: totalParticipants > 0 ? (totalResponses / totalParticipants).toFixed(2) : 0
      },
      byCategory: participantsByCategory,
      byGender: participantsByGender,
      ageStats
    });

  } catch (error) {
    console.error('Error fetching statistics:', error);
    return res.status(500).json({
      error: 'Failed to fetch survey statistics'
    });
  }
}));

export default router;
