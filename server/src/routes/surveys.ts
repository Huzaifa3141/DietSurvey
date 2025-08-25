import { Router, Request, Response } from 'express';
import { prisma } from '../index';
import { asyncHandler } from '../middleware/errorHandler';
import { body, validationResult } from 'express-validator';

const router = Router();

// Validation middleware
const validateSurvey = [
  body('title').trim().isLength({ min: 3, max: 200 }),
  body('description').trim().isLength({ min: 10, max: 1000 }),
  body('questions').isArray({ min: 1 })
];

const validateQuestion = [
  body('text').trim().isLength({ min: 5, max: 500 }),
  body('type').isIn(['TEXT', 'NUMBER', 'MULTIPLE_CHOICE', 'CHECKBOX', 'SCALE', 'YES_NO']),
  body('required').isBoolean(),
  body('order').isInt({ min: 1 }),
  body('options').optional().isString()
];

// Get all surveys
router.get('/', asyncHandler(async (req: Request, res: Response) => {
  const surveys = await prisma.survey.findMany({
    where: { isActive: true },
    include: {
      questions: {
        orderBy: { order: 'asc' }
      },
      _count: {
        select: { responses: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  return res.json({
    surveys,
    total: surveys.length
  });
}));

// Get survey by ID
router.get('/:id', asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const survey = await prisma.survey.findUnique({
    where: { id },
    include: {
      questions: {
        orderBy: { order: 'asc' }
      }
    }
  });

  if (!survey) {
    return res.status(404).json({ 
      error: 'Survey not found' 
    });
  }

  return res.json(survey);
}));

// Create new survey
router.post('/', validateSurvey, asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      error: 'Validation failed', 
      details: errors.array() 
    });
  }

  const { title, description, questions } = req.body;

  // Create survey with questions in a transaction
  const survey = await prisma.$transaction(async (tx) => {
    const newSurvey = await tx.survey.create({
      data: {
        title,
        description,
        isActive: true
      }
    });

    // Create questions
    const questionPromises = questions.map((question: any) =>
      tx.question.create({
        data: {
          surveyId: newSurvey.id,
          text: question.text,
          type: question.type,
          options: question.options,
          required: question.required,
          order: question.order
        }
      })
    );

    const createdQuestions = await Promise.all(questionPromises);

    return {
      ...newSurvey,
      questions: createdQuestions
    };
  });

  return res.status(201).json({
    message: 'Survey created successfully',
    survey
  });
}));

// Update survey
router.put('/:id', validateSurvey, asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      error: 'Validation failed', 
      details: errors.array() 
    });
  }

  const { id } = req.params;
  const { title, description, questions } = req.body;

  // Check if survey exists
  const existingSurvey = await prisma.survey.findUnique({
    where: { id }
  });

  if (!existingSurvey) {
    return res.status(404).json({ 
      error: 'Survey not found' 
    });
  }

  // Update survey and questions in a transaction
  const updatedSurvey = await prisma.$transaction(async (tx) => {
    // Update survey
    const survey = await tx.survey.update({
      where: { id },
      data: { title, description }
    });

    // Delete existing questions
    await tx.question.deleteMany({
      where: { surveyId: id }
    });

    // Create new questions
    const questionPromises = questions.map((question: any) =>
      tx.question.create({
        data: {
          surveyId: id,
          text: question.text,
          type: question.type,
          options: question.options,
          required: question.required,
          order: question.order
        }
      })
    );

    const createdQuestions = await Promise.all(questionPromises);

    return {
      ...survey,
      questions: createdQuestions
    };
  });

  return res.json({
    message: 'Survey updated successfully',
    survey: updatedSurvey
  });
}));

// Delete survey
router.delete('/:id', asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  // Check if survey exists
  const survey = await prisma.survey.findUnique({
    where: { id }
  });

  if (!survey) {
    return res.status(404).json({ 
      error: 'Survey not found' 
    });
  }

  // Soft delete by setting isActive to false
  await prisma.survey.update({
    where: { id },
    data: { isActive: false }
  });

  return res.json({
    message: 'Survey deleted successfully'
  });
}));

// Get survey statistics
router.get('/:id/stats', asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const stats = await prisma.survey.findUnique({
    where: { id },
    include: {
      _count: {
        select: { responses: true }
      },
      questions: {
        include: {
          _count: {
            select: { responses: true }
          }
        }
      }
    }
  });

  if (!stats) {
    return res.status(404).json({ 
      error: 'Survey not found' 
    });
  }

  return res.json(stats);
}));

// Get default survey questions (for demo purposes)
router.get('/default/questions', asyncHandler(async (req: Request, res: Response) => {
  const defaultQuestions = [
    {
      text: "What is your typical daily meal pattern?",
      type: "MULTIPLE_CHOICE",
      options: JSON.stringify([
        "3 meals per day",
        "2 meals per day", 
        "4+ meals per day",
        "Irregular eating pattern"
      ]),
      required: true,
      order: 1
    },
    {
      text: "How many servings of fruits do you consume daily?",
      type: "NUMBER",
      required: true,
      order: 2
    },
    {
      text: "How many servings of vegetables do you consume daily?",
      type: "NUMBER",
      required: true,
      order: 3
    },
    {
      text: "Do you consume fast food regularly?",
      type: "YES_NO",
      required: true,
      order: 4
    },
    {
      text: "How often do you drink water?",
      type: "MULTIPLE_CHOICE",
      options: JSON.stringify([
        "Less than 4 glasses per day",
        "4-6 glasses per day",
        "7-8 glasses per day",
        "More than 8 glasses per day"
      ]),
      required: true,
      order: 5
    },
    {
      text: "What is your primary source of protein?",
      type: "MULTIPLE_CHOICE",
      options: JSON.stringify([
        "Meat (chicken, beef, pork)",
        "Fish and seafood",
        "Eggs and dairy",
        "Plant-based (beans, lentils, tofu)",
        "Mixed sources"
      ]),
      required: true,
      order: 6
    },
    {
      text: "Do you have any food allergies or intolerances?",
      type: "TEXT",
      required: false,
      order: 7
    },
    {
      text: "How would you rate your overall eating habits?",
      type: "SCALE",
      options: JSON.stringify(["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]),
      required: true,
      order: 8
    }
  ];

  return res.json({
    message: "Default survey questions retrieved",
    questions: defaultQuestions
  });
}));

export default router;
