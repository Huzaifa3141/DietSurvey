import { Router, Request, Response } from 'express';
import { prisma } from '../index';
import { asyncHandler } from '../middleware/errorHandler';
import { body, validationResult } from 'express-validator';

const router = Router();

// Validation middleware
const validateAdvisory = [
  body('participantId').isString(),
  body('title').trim().isLength({ min: 5, max: 200 }),
  body('content').trim().isLength({ min: 20, max: 2000 }),
  body('recommendations').trim().isLength({ min: 20, max: 1000 }),
  body('healthScore').isInt({ min: 1, max: 10 })
];

// Generate health advisory for a participant
router.post('/generate/:participantId', asyncHandler(async (req: Request, res: Response) => {
  const { participantId } = req.params;

  // Get participant and their responses
  const participant = await prisma.participant.findUnique({
    where: { id: participantId },
    include: {
      responses: {
        include: {
          question: true
        }
      }
    }
  });

  if (!participant) {
    return res.status(404).json({ 
      error: 'Participant not found' 
    });
  }

  // Analyze responses to generate advisory
  const advisory = await generateHealthAdvisory(participant);

  // Save advisory to database
  const savedAdvisory = await prisma.advisory.create({
    data: {
      participantId,
      title: advisory.title,
      content: advisory.content,
      recommendations: advisory.recommendations,
      healthScore: advisory.healthScore
    }
  });

  return res.status(201).json({
    message: 'Health advisory generated successfully',
    advisory: savedAdvisory
  });
}));

// Get all advisories for a participant
router.get('/participant/:participantId', asyncHandler(async (req: Request, res: Response) => {
  const { participantId } = req.params;

  const advisories = await prisma.advisory.findMany({
    where: { participantId },
    orderBy: { createdAt: 'desc' }
  });

  return res.json({
    advisories,
    total: advisories.length
  });
}));

// Get advisory by ID
router.get('/:id', asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const advisory = await prisma.advisory.findUnique({
    where: { id },
    include: {
      participant: {
        select: {
          id: true,
          name: true,
          category: true,
          gender: true,
          age: true
        }
      }
    }
  });

  if (!advisory) {
    return res.status(404).json({ 
      error: 'Advisory not found' 
    });
  }

  return res.json(advisory);
}));

// Update advisory
router.put('/:id', validateAdvisory, asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      error: 'Validation failed', 
      details: errors.array() 
    });
  }

  const { id } = req.params;
  const { title, content, recommendations, healthScore } = req.body;

  const advisory = await prisma.advisory.findUnique({
    where: { id }
  });

  if (!advisory) {
    return res.status(404).json({ 
      error: 'Advisory not found' 
    });
  }

  const updatedAdvisory = await prisma.advisory.update({
    where: { id },
    data: {
      title,
      content,
      recommendations,
      healthScore
    }
  });

  return res.json({
    message: 'Advisory updated successfully',
    advisory: updatedAdvisory
  });
}));

// Delete advisory
router.delete('/:id', asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const advisory = await prisma.advisory.findUnique({
    where: { id }
  });

  if (!advisory) {
    return res.status(404).json({ 
      error: 'Advisory not found' 
    });
  }

  await prisma.advisory.delete({
    where: { id }
  });

  return res.json({
    message: 'Advisory deleted successfully'
  });
}));

// Get all advisories (admin)
router.get('/', asyncHandler(async (req: Request, res: Response) => {
  const { page = 1, limit = 50, category, gender } = req.query;

  const skip = (Number(page) - 1) * Number(limit);

  let whereClause: any = {};
  
  if (category || gender) {
    whereClause.participant = {};
    if (category) whereClause.participant.category = category;
    if (gender) whereClause.participant.gender = gender;
  }

  const advisories = await prisma.advisory.findMany({
    where: whereClause,
    include: {
      participant: {
        select: {
          id: true,
          name: true,
          category: true,
          gender: true,
          age: true
        }
      }
    },
    orderBy: { createdAt: 'desc' },
    skip,
    take: Number(limit)
  });

  const total = await prisma.advisory.count({ where: whereClause });

  return res.json({
    advisories,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / Number(limit))
    }
  });
}));

// Generate comprehensive health report
router.post('/report/:participantId', asyncHandler(async (req: Request, res: Response) => {
  const { participantId } = req.params;

  const participant = await prisma.participant.findUnique({
    where: { id: participantId },
    include: {
      responses: {
        include: {
          question: true
        }
      },
      advisory: {
        orderBy: { createdAt: 'desc' },
        take: 1
      }
    }
  });

  if (!participant) {
    return res.status(404).json({ 
      error: 'Participant not found' 
    });
  }

  const report = await generateComprehensiveReport(participant);

  return res.json({
    message: 'Comprehensive health report generated',
    report
  });
}));

// Helper function to generate health advisory
async function generateHealthAdvisory(participant: any) {
  const responses = participant.responses;
  let healthScore = 5; // Default score
  let recommendations = [];
  let content = '';

  // Analyze dietary responses
  const fruitResponse = responses.find((r: any) => 
    r.question.text.toLowerCase().includes('fruit')
  );
  const vegetableResponse = responses.find((r: any) => 
    r.question.text.toLowerCase().includes('vegetable')
  );
  const waterResponse = responses.find((r: any) => 
    r.question.text.toLowerCase().includes('water')
  );

  // Calculate health score based on responses
  if (fruitResponse) {
    const fruitCount = parseInt(fruitResponse.answer) || 0;
    if (fruitCount >= 2) healthScore += 1;
    else if (fruitCount === 0) healthScore -= 1;
  }

  if (vegetableResponse) {
    const vegCount = parseInt(vegetableResponse.answer) || 0;
    if (vegCount >= 3) healthScore += 1;
    else if (vegCount <= 1) healthScore -= 1;
  }

  if (waterResponse) {
    if (waterResponse.answer.includes('7-8 glasses') || waterResponse.answer.includes('More than 8')) {
      healthScore += 1;
    } else if (waterResponse.answer.includes('Less than 4')) {
      healthScore -= 1;
    }
  }

  // Ensure score is within 1-10 range
  healthScore = Math.max(1, Math.min(10, healthScore));

  // Generate content based on score
  if (healthScore >= 8) {
    content = `Excellent! Your eating habits show a well-balanced and nutritious diet. You're consuming adequate fruits, vegetables, and water, which contributes to overall health and wellness.`;
    recommendations = [
      "Continue maintaining your current healthy eating patterns",
      "Consider adding more variety to your protein sources",
      "Keep up the good work with hydration"
    ];
  } else if (healthScore >= 6) {
    content = `Good! You have a generally healthy diet with room for improvement. Your eating habits show some positive patterns that can be enhanced.`;
    recommendations = [
      "Increase daily fruit consumption to at least 2 servings",
      "Aim for 3-5 servings of vegetables daily",
      "Ensure adequate water intake (7-8 glasses per day)"
    ];
  } else if (healthScore >= 4) {
    content = `Fair. Your current eating habits could benefit from some adjustments to improve nutritional intake and overall health.`;
    recommendations = [
      "Start with small changes to increase fruit and vegetable intake",
      "Gradually increase water consumption",
      "Consider meal planning for better nutrition"
    ];
  } else {
    content = `Your current eating habits may need attention to improve nutritional intake and overall health. Small changes can make a big difference.`;
    recommendations = [
      "Consult with a nutritionist for personalized advice",
      "Begin with one healthy change per week",
      "Focus on increasing whole foods and reducing processed foods"
    ];
  }

  return {
    title: `Health Advisory for ${participant.name}`,
    content,
    recommendations: recommendations.join('. '),
    healthScore
  };
}

// Helper function to generate comprehensive report
async function generateComprehensiveReport(participant: any) {
  const responses = participant.responses;
  const latestAdvisory = participant.advisory[0];

  const report = {
    participant: {
      name: participant.name,
      category: participant.category,
      gender: participant.gender,
      age: participant.age,
      department: participant.department
    },
    surveySummary: {
      totalQuestions: responses.length,
      completedAt: responses[0]?.createdAt || new Date()
    },
    dietaryAnalysis: {
      fruitIntake: responses.find((r: any) => r.question.text.toLowerCase().includes('fruit'))?.answer || 'Not specified',
      vegetableIntake: responses.find((r: any) => r.question.text.toLowerCase().includes('vegetable'))?.answer || 'Not specified',
      waterIntake: responses.find((r: any) => r.question.text.toLowerCase().includes('water'))?.answer || 'Not specified',
      mealPattern: responses.find((r: any) => r.question.text.toLowerCase().includes('meal pattern'))?.answer || 'Not specified'
    },
    healthScore: latestAdvisory?.healthScore || 5,
    recommendations: latestAdvisory?.recommendations || 'No specific recommendations available',
    generatedAt: new Date().toISOString()
  };

  return report;
}

export default router;
