# 🍽️ Diet Survey Platform

A simple, user-friendly survey platform for collecting eating habits and dietary preferences data. **No login required** - just fill out the form and submit!

## ✨ Features

- **Simple Survey Form**: Two-section form like Microsoft Forms
  - Section 1: Personal Information (name, email, category, gender, age, department)
  - Section 2: 8 Survey Questions about eating habits
- **No Authentication**: Anyone can take the survey without signing up
- **Admin Dashboard**: View all responses, statistics, and export data
- **Responsive Design**: Works on all devices
- **Data Export**: Download responses as CSV

## 🚀 Quick Start

### 1. Start the Backend Server
```bash
cd server
npm install
npm run dev
```
Server will run on: http://localhost:5000

### 2. Start the Frontend
```bash
cd client
npm install
npm start
```
Website will open at: http://localhost:3000

## 📱 How to Use

### For Survey Participants:
1. Go to http://localhost:3000
2. Click "📝 Take Survey" 
3. Fill out your personal information
4. Answer the 8 survey questions
5. Click "Submit Survey"
6. Done! Your response is saved

### For Administrators:
1. Go to http://localhost:3000
2. Click "📊 Admin View"
3. View statistics and responses
4. Export data to CSV if needed

## 🗄️ Database Schema

The system automatically creates:
- **Participants**: Personal information from survey takers
- **Surveys**: Default survey with 8 questions
- **Questions**: Pre-defined questions about eating habits
- **Responses**: Individual answers from each participant

## 🔧 Technology Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express, TypeScript
- **Database**: SQLite with Prisma ORM
- **Validation**: Express-validator, React Hook Form

## 📊 Survey Questions

1. How many meals do you eat per day?
2. Do you eat breakfast regularly?
3. How often do you consume fruits and vegetables?
4. Do you drink enough water daily?
5. How often do you eat fast food?
6. Do you follow any specific diet?
7. How would you rate your overall eating habits?
8. Any additional comments about your diet? (Optional)

## 📁 Project Structure

```
DietSurvey/
├── client/                 # React frontend
│   ├── src/
│   │   ├── pages/
│   │   │   ├── SurveyForm.tsx    # Main survey form
│   │   │   └── AdminPage.tsx     # Admin dashboard
│   │   └── App.tsx              # Main app with navigation
├── server/                 # Node.js backend
│   ├── src/
│   │   ├── routes/
│   │   │   └── survey.ts         # Survey submission API
│   │   └── index.ts              # Main server file
└── README.md
```

## 🌐 API Endpoints

- `POST /api/survey/submit` - Submit survey response
- `GET /api/survey/responses` - Get all responses (admin)
- `GET /api/survey/stats` - Get survey statistics (admin)

## 📈 Data Collection

The platform is designed to collect data from:
- **Students** (with student ID)
- **Teaching Staff** (with staff ID)
- **Non-Teaching Staff** (with staff ID)

All responses are stored securely and can be exported for analysis.

## 🎯 Perfect For

- Student research projects
- University health studies
- Dietary preference surveys
- Academic research data collection
- Simple form-based data gathering

## 📝 License

This project is open source and available under the MIT License.

---

**Ready to start collecting survey data? Just run the servers and share the survey link!** 🎉
