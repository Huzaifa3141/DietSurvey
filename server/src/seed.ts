import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create sample participants
  const participants = await Promise.all([
    prisma.participant.create({
      data: {
        email: 'john.doe@university.edu',
        name: 'John Doe',
        category: 'TEACHING_STAFF',
        gender: 'MALE',
        age: 35,
        department: 'Computer Science',
        staffId: 'TS001'
      }
    }),
    prisma.participant.create({
      data: {
        email: 'jane.smith@university.edu',
        name: 'Jane Smith',
        category: 'TEACHING_STAFF',
        gender: 'FEMALE',
        age: 42,
        department: 'Mathematics',
        staffId: 'TS002'
      }
    }),
    prisma.participant.create({
      data: {
        email: 'mike.johnson@university.edu',
        name: 'Mike Johnson',
        category: 'NON_TEACHING_STAFF',
        gender: 'MALE',
        age: 28,
        department: 'Administration',
        staffId: 'NTS001'
      }
    }),
    prisma.participant.create({
      data: {
        email: 'sarah.wilson@university.edu',
        name: 'Sarah Wilson',
        category: 'NON_TEACHING_STAFF',
        gender: 'FEMALE',
        age: 31,
        department: 'Library',
        staffId: 'NTS002'
      }
    }),
    prisma.participant.create({
      data: {
        email: 'alex.chen@university.edu',
        name: 'Alex Chen',
        category: 'STUDENT',
        gender: 'MALE',
        age: 20,
        department: 'Engineering',
        studentId: 'ST001'
      }
    }),
    prisma.participant.create({
      data: {
        email: 'emma.brown@university.edu',
        name: 'Emma Brown',
        category: 'STUDENT',
        gender: 'FEMALE',
        age: 19,
        department: 'Psychology',
        studentId: 'ST002'
      }
    })
  ]);

  console.log(`✅ Created ${participants.length} participants`);

  // Create sample survey
  const survey = await prisma.survey.create({
    data: {
      title: 'Eating Habits and Dietary Patterns Survey',
      description: 'A comprehensive survey to understand eating habits, food preferences, and dietary patterns among university staff and students.',
      isActive: true
    }
  });

  console.log('✅ Created survey:', survey.title);

  // Create survey questions
  const questions = await Promise.all([
    prisma.question.create({
      data: {
        surveyId: survey.id,
        text: 'What is your typical daily meal pattern?',
        type: 'MULTIPLE_CHOICE',
        options: JSON.stringify([
          '3 meals per day',
          '2 meals per day', 
          '4+ meals per day',
          'Irregular eating pattern'
        ]),
        required: true,
        order: 1
      }
    }),
    prisma.question.create({
      data: {
        surveyId: survey.id,
        text: 'How many servings of fruits do you consume daily?',
        type: 'NUMBER',
        required: true,
        order: 2
      }
    }),
    prisma.question.create({
      data: {
        surveyId: survey.id,
        text: 'How many servings of vegetables do you consume daily?',
        type: 'NUMBER',
        required: true,
        order: 3
      }
    }),
    prisma.question.create({
      data: {
        surveyId: survey.id,
        text: 'Do you consume fast food regularly?',
        type: 'YES_NO',
        required: true,
        order: 4
      }
    }),
    prisma.question.create({
      data: {
        surveyId: survey.id,
        text: 'How often do you drink water?',
        type: 'MULTIPLE_CHOICE',
        options: JSON.stringify([
          'Less than 4 glasses per day',
          '4-6 glasses per day',
          '7-8 glasses per day',
          'More than 8 glasses per day'
        ]),
        required: true,
        order: 5
      }
    }),
    prisma.question.create({
      data: {
        surveyId: survey.id,
        text: 'What is your primary source of protein?',
        type: 'MULTIPLE_CHOICE',
        options: JSON.stringify([
          'Meat (chicken, beef, pork)',
          'Fish and seafood',
          'Eggs and dairy',
          'Plant-based (beans, lentils, tofu)',
          'Mixed sources'
        ]),
        required: true,
        order: 6
      }
    }),
    prisma.question.create({
      data: {
        surveyId: survey.id,
        text: 'Do you have any food allergies or intolerances?',
        type: 'TEXT',
        required: false,
        order: 7
      }
    }),
    prisma.question.create({
      data: {
        surveyId: survey.id,
        text: 'How would you rate your overall eating habits?',
        type: 'SCALE',
        options: JSON.stringify(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']),
        required: true,
        order: 8
      }
    })
  ]);

  console.log(`✅ Created ${questions.length} survey questions`);

  // Create sample responses for some participants
  const sampleResponses = [
    // John Doe's responses
    { participantId: participants[0].id, questionId: questions[0].id, surveyId: survey.id, answer: '3 meals per day' },
    { participantId: participants[0].id, questionId: questions[1].id, surveyId: survey.id, answer: '2' },
    { participantId: participants[0].id, questionId: questions[2].id, surveyId: survey.id, answer: '3' },
    { participantId: participants[0].id, questionId: questions[3].id, surveyId: survey.id, answer: 'No' },
    { participantId: participants[0].id, questionId: questions[4].id, surveyId: survey.id, answer: '7-8 glasses per day' },
    { participantId: participants[0].id, questionId: questions[5].id, surveyId: survey.id, answer: 'Mixed sources' },
    { participantId: participants[0].id, questionId: questions[6].id, surveyId: survey.id, answer: 'None' },
    { participantId: participants[0].id, questionId: questions[7].id, surveyId: survey.id, answer: '7' },

    // Jane Smith's responses
    { participantId: participants[1].id, questionId: questions[0].id, surveyId: survey.id, answer: '4+ meals per day' },
    { participantId: participants[1].id, questionId: questions[1].id, surveyId: survey.id, answer: '3' },
    { participantId: participants[1].id, questionId: questions[2].id, surveyId: survey.id, answer: '4' },
    { participantId: participants[1].id, questionId: questions[3].id, surveyId: survey.id, answer: 'No' },
    { participantId: participants[1].id, questionId: questions[4].id, surveyId: survey.id, answer: 'More than 8 glasses per day' },
    { participantId: participants[1].id, questionId: questions[5].id, surveyId: survey.id, answer: 'Plant-based (beans, lentils, tofu)' },
    { participantId: participants[1].id, questionId: questions[6].id, surveyId: survey.id, answer: 'Lactose intolerance' },
    { participantId: participants[1].id, questionId: questions[7].id, surveyId: survey.id, answer: '8' },

    // Alex Chen's responses
    { participantId: participants[4].id, questionId: questions[0].id, surveyId: survey.id, answer: 'Irregular eating pattern' },
    { participantId: participants[4].id, questionId: questions[1].id, surveyId: survey.id, answer: '1' },
    { participantId: participants[4].id, questionId: questions[2].id, surveyId: survey.id, answer: '2' },
    { participantId: participants[4].id, questionId: questions[3].id, surveyId: survey.id, answer: 'Yes' },
    { participantId: participants[4].id, questionId: questions[4].id, surveyId: survey.id, answer: '4-6 glasses per day' },
    { participantId: participants[4].id, questionId: questions[5].id, surveyId: survey.id, answer: 'Meat (chicken, beef, pork)' },
    { participantId: participants[4].id, questionId: questions[6].id, surveyId: survey.id, answer: 'None' },
    { participantId: participants[4].id, questionId: questions[7].id, surveyId: survey.id, answer: '5' }
  ];

  const responses = await Promise.all(
    sampleResponses.map(response =>
      prisma.response.create({ data: response })
    )
  );

  console.log(`✅ Created ${responses.length} sample responses`);

  // Create sample health advisories
  const advisories = await Promise.all([
    prisma.advisory.create({
      data: {
        participantId: participants[0].id,
        title: 'Health Advisory for John Doe',
        content: 'Good! You have a generally healthy diet with room for improvement. Your eating habits show some positive patterns that can be enhanced.',
        recommendations: 'Increase daily fruit consumption to at least 2 servings. Aim for 3-5 servings of vegetables daily. Ensure adequate water intake (7-8 glasses per day).',
        healthScore: 7
      }
    }),
    prisma.advisory.create({
      data: {
        participantId: participants[1].id,
        title: 'Health Advisory for Jane Smith',
        content: 'Excellent! Your eating habits show a well-balanced and nutritious diet. You\'re consuming adequate fruits, vegetables, and water, which contributes to overall health and wellness.',
        recommendations: 'Continue maintaining your current healthy eating patterns. Consider adding more variety to your protein sources. Keep up the good work with hydration.',
        healthScore: 9
      }
    }),
    prisma.advisory.create({
      data: {
        participantId: participants[4].id,
        title: 'Health Advisory for Alex Chen',
        content: 'Your current eating habits may need attention to improve nutritional intake and overall health. Small changes can make a big difference.',
        recommendations: 'Consult with a nutritionist for personalized advice. Begin with one healthy change per week. Focus on increasing whole foods and reducing processed foods.',
        healthScore: 4
      }
    })
  ]);

  console.log(`✅ Created ${advisories.length} health advisories`);

  console.log('🎉 Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
