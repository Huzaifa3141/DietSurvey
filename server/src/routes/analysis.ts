import { Router, Request, Response } from 'express';
import { prisma } from '../index';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

// Get demographic analysis
router.get('/demographics', asyncHandler(async (req: Request, res: Response) => {
  const { surveyId } = req.query;

  let whereClause: any = {};
  if (surveyId) {
    whereClause.surveyId = surveyId;
  }

  // Get participant counts by category
  const participantsByCategory = await prisma.participant.groupBy({
    by: ['category'],
    _count: {
      id: true
    }
  });

  // Get participant counts by gender
  const participantsByGender = await prisma.participant.groupBy({
    by: ['gender'],
    _count: {
      id: true
    }
  });

  // Get age distribution
  const ageStats = await prisma.participant.aggregate({
    _avg: { age: true },
    _min: { age: true },
    _max: { age: true },
    _count: { age: true }
  });

  // Get department distribution
  const participantsByDepartment = await prisma.participant.groupBy({
    by: ['department'],
    _count: {
      id: true
    },
    where: {
      department: { not: null }
    }
  });

  return res.json({
    demographics: {
      byCategory: participantsByCategory,
      byGender: participantsByGender,
      byDepartment: participantsByDepartment,
      ageStats
    }
  });
}));

// Get dietary analysis
router.get('/dietary', asyncHandler(async (req: Request, res: Response) => {
  const { surveyId } = req.query;

  let whereClause: any = {};
  if (surveyId) {
    whereClause.surveyId = surveyId;
  }

  // Get responses for dietary questions
  const dietaryResponses = await prisma.response.findMany({
    where: {
      ...whereClause,
      question: {
        text: {
          contains: 'fruit'
        }
      }
    },
    include: {
      question: true,
      participant: {
        select: {
          category: true,
          gender: true
        }
      }
    }
  });

  // Analyze fruit consumption
  const fruitConsumption = await prisma.response.findMany({
    where: {
      ...whereClause,
      question: {
        text: {
          contains: 'fruits'
        }
      }
    },
    include: {
      participant: {
        select: {
          category: true,
          gender: true
        }
      }
    }
  });

  // Analyze vegetable consumption
  const vegetableConsumption = await prisma.response.findMany({
    where: {
      ...whereClause,
      question: {
        text: {
          contains: 'vegetables'
        }
      }
    },
    include: {
      participant: {
        select: {
          category: true,
          gender: true
        }
      }
    }
  });

  // Analyze water consumption
  const waterConsumption = await prisma.response.findMany({
    where: {
      ...whereClause,
      question: {
        text: {
          contains: 'water'
        }
      }
    },
    include: {
      participant: {
        select: {
          category: true,
          gender: true
        }
      }
    }
  });

  return res.json({
    dietary: {
      fruitConsumption,
      vegetableConsumption,
      waterConsumption,
      totalResponses: dietaryResponses.length
    }
  });
}));

// Get trend analysis
router.get('/trends', asyncHandler(async (req: Request, res: Response) => {
  const { surveyId, days = 30 } = req.query;

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - Number(days));

  let whereClause: any = {
    createdAt: {
      gte: startDate
    }
  };

  if (surveyId) {
    whereClause.surveyId = surveyId;
  }

  // Get responses over time
  const responsesOverTime = await prisma.response.groupBy({
    by: ['createdAt'],
    where: whereClause,
    _count: {
      id: true
    }
  });

  // Get participant registration over time
  const registrationsOverTime = await prisma.participant.groupBy({
    by: ['createdAt'],
    where: {
      createdAt: {
        gte: startDate
      }
    },
    _count: {
      id: true
    }
  });

  return res.json({
    trends: {
      responsesOverTime,
      registrationsOverTime,
      period: `${days} days`
    }
  });
}));

// Get health score analysis
router.get('/health-scores', asyncHandler(async (req: Request, res: Response) => {
  const { surveyId } = req.query;

  let whereClause: any = {};
  if (surveyId) {
    whereClause.surveyId = surveyId;
  }

  // Get health rating responses
  const healthRatings = await prisma.response.findMany({
    where: {
      ...whereClause,
      question: {
        text: {
          contains: 'rate'
        }
      }
    },
    include: {
      participant: {
        select: {
          category: true,
          gender: true,
          age: true
        }
      }
    }
  });

  // Calculate average health scores by category
  const scoresByCategory = await prisma.response.findMany({
    where: {
      ...whereClause,
      question: {
        text: {
          contains: 'rate'
        }
      }
    },
    include: {
      participant: {
        select: {
          category: true
        }
      }
    }
  });

  // Calculate average health scores by gender
  const scoresByGender = await prisma.response.findMany({
    where: {
      ...whereClause,
      question: {
        text: {
          contains: 'rate'
        }
      }
    },
    include: {
      participant: {
        select: {
          gender: true
        }
      }
    }
  });

  return res.json({
    healthScores: {
      ratings: healthRatings,
      byCategory: scoresByCategory,
      byGender: scoresByGender,
      totalResponses: healthRatings.length
    }
  });
}));

// Get comparative analysis
router.get('/comparative', asyncHandler(async (req: Request, res: Response) => {
  const { surveyId, compareBy = 'category' } = req.query;

  let whereClause: any = {};
  if (surveyId) {
    whereClause.surveyId = surveyId;
  }

  let groupByField: any = {};
  if (compareBy === 'category') {
    groupByField.participant = { category: true };
  } else if (compareBy === 'gender') {
    groupByField.participant = { gender: true };
  } else if (compareBy === 'department') {
    groupByField.participant = { department: true };
  }

  // Get responses grouped by the comparison field
  const comparativeData = await prisma.response.findMany({
    where: whereClause,
    include: {
      participant: {
        select: {
          category: true,
          gender: true,
          department: true
        }
      }
    }
  });

  return res.json({
    comparative: {
      compareBy,
      data: comparativeData
    }
  });
}));

// Generate comprehensive analysis report
router.get('/report', asyncHandler(async (req: Request, res: Response) => {
  const { surveyId } = req.query;

  // Get all analysis data
  const [demographics, dietary, trends, healthScores] = await Promise.all([
    prisma.participant.groupBy({
      by: ['category', 'gender'],
      _count: { id: true }
    }),
    prisma.response.findMany({
      where: surveyId ? { surveyId: surveyId as string } : {},
      include: {
        question: true,
        participant: {
          select: {
            category: true,
            gender: true
          }
        }
      }
    }),
    prisma.response.groupBy({
      by: ['createdAt'],
      _count: { id: true }
    }),
    prisma.response.findMany({
      where: {
        ...(surveyId ? { surveyId: surveyId as string } : {}),
        question: {
          text: { contains: 'rate' }
        }
      },
      include: {
        participant: {
          select: {
            category: true,
            gender: true
          }
        }
      }
    })
  ]);

  const report = {
    summary: {
      totalParticipants: demographics.reduce((acc, curr) => acc + curr._count.id, 0),
      totalResponses: dietary.length,
      surveyId: surveyId || 'All Surveys'
    },
    demographics,
    dietary: {
      totalQuestions: new Set(dietary.map(r => r.questionId)).size,
      totalResponses: dietary.length
    },
    trends: {
      totalDays: trends.length,
      averageResponsesPerDay: trends.reduce((acc, curr) => acc + curr._count.id, 0) / trends.length
    },
    healthScores: {
      totalRatings: healthScores.length,
      averageRating: healthScores.reduce((acc, curr) => acc + parseFloat(curr.answer), 0) / healthScores.length
    },
    generatedAt: new Date().toISOString()
  };

  return res.json({
    message: 'Analysis report generated successfully',
    report
  });
}));

export default router;
