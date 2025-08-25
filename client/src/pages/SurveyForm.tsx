import React, { useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import axios from 'axios';
import { ThemeContext } from '../App';
import { getApiUrl } from '../config';

interface FormData {
  // User credentials
  name: string;
  email: string;
  category: string;
  gender: string;
  age: number;
  department: string;
  studentId?: string;
  staffId?: string;
  
  // Survey questions
  q1: string; // How many meals do you eat per day?
  q2: string; // Do you eat breakfast regularly?
  q3: string; // How often do you consume fruits and vegetables?
  q4: string; // Do you drink enough water daily?
  q5: string; // How often do you eat fast food?
  q6: string; // Do you follow any specific diet?
  q7: string; // How would you rate your overall eating habits?
  q8: string; // Any additional comments about your diet?
}

const SurveyForm: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>();
  const { theme } = useContext(ThemeContext);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      // Submit to backend
      const response = await axios.post(getApiUrl('/api/survey/submit'), data);
      
      if (response.status === 201) {
        toast.success('Survey submitted successfully! Thank you for your participation.');
        reset(); // Clear the form
      }
    } catch (error: any) {
      console.error('Error submitting survey:', error);
      toast.error(error.response?.data?.error || 'Failed to submit survey. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`min-h-screen py-8 px-4 transition-colors duration-200 ${
      theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className={`text-4xl font-bold mb-4 transition-colors duration-200 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            🍽️ Diet & Eating Habits Survey
          </h1>
          <p className={`text-lg transition-colors duration-200 ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Help us understand eating patterns and dietary preferences
          </p>
        </div>

        {/* Survey Form */}
        <div className={`rounded-lg shadow-lg p-8 transition-colors duration-200 ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        }`}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            
            {/* Section 1: User Credentials */}
            <div className={`border-b pb-6 transition-colors duration-200 ${
              theme === 'dark' ? 'border-gray-600' : 'border-gray-200'
            }`}>
              <h2 className={`text-2xl font-semibold mb-6 flex items-center transition-colors duration-200 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                <span className={`rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3 ${
                  theme === 'dark' ? 'bg-blue-900 text-blue-100' : 'bg-blue-100 text-blue-600'
                }`}>1</span>
                Personal Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div>
                  <label className={`block text-sm font-medium mb-2 transition-colors duration-200 ${
                    theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                  }`}>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    {...register('name', { required: 'Name is required' })}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
                      theme === 'dark' 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'border-gray-300 placeholder-gray-500'
                    }`}
                    placeholder="Enter your full name"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className={`block text-sm font-medium mb-2 transition-colors duration-200 ${
                    theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                  }`}>
                    Email Address *
                  </label>
                  <input
                    type="email"
                    {...register('email', { 
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address'
                      }
                    })}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
                      theme === 'dark' 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'border-gray-300 placeholder-gray-500'
                    }`}
                    placeholder="Enter your email"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                  )}
                </div>

                {/* Category */}
                <div>
                  <label className={`block text-sm font-medium mb-2 transition-colors duration-200 ${
                    theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                  }`}>
                    Category *
                  </label>
                  <select
                    {...register('category', { required: 'Category is required' })}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
                      theme === 'dark' 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select category</option>
                    <option value="STUDENT">Student</option>
                    <option value="TEACHING_STAFF">Teaching Staff</option>
                    <option value="NON_TEACHING_STAFF">Non-Teaching Staff</option>
                  </select>
                  {errors.category && (
                    <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>
                  )}
                </div>

                {/* Gender */}
                <div>
                  <label className={`block text-sm font-medium mb-2 transition-colors duration-200 ${
                    theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                  }`}>
                    Gender *
                  </label>
                  <select
                    {...register('gender', { required: 'Gender is required' })}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
                      theme === 'dark' 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select gender</option>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                  </select>
                  {errors.gender && (
                    <p className="text-red-500 text-sm mt-1">{errors.gender.message}</p>
                  )}
                </div>

                {/* Age */}
                <div>
                  <label className={`block text-sm font-medium mb-2 transition-colors duration-200 ${
                    theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                  }`}>
                    Age *
                  </label>
                  <input
                    type="number"
                    {...register('age', { 
                      required: 'Age is required',
                      min: { value: 16, message: 'Age must be at least 16' },
                      max: { value: 100, message: 'Age must be less than 100' }
                    })}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
                      theme === 'dark' 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'border-gray-300 placeholder-gray-500'
                    }`}
                    placeholder="Enter your age"
                  />
                  {errors.age && (
                    <p className="text-red-500 text-sm mt-1">{errors.age.message}</p>
                  )}
                </div>

                {/* Department */}
                <div>
                  <label className={`block text-sm font-medium mb-2 transition-colors duration-200 ${
                    theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                  }`}>
                    Department *
                  </label>
                  <input
                    type="text"
                    {...register('department', { required: 'Department is required' })}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
                      theme === 'dark' 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'border-gray-300 placeholder-gray-500'
                    }`}
                    placeholder="e.g., Computer Science, Engineering"
                  />
                  {errors.department && (
                    <p className="text-red-500 text-sm mt-1">{errors.department.message}</p>
                  )}
                </div>

                {/* Student ID (conditional) */}
                <div>
                  <label className={`block text-sm font-medium mb-2 transition-colors duration-200 ${
                    theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                  }`}>
                    Student ID
                  </label>
                  <input
                    type="text"
                    {...register('studentId')}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
                      theme === 'dark' 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'border-gray-300 placeholder-gray-500'
                    }`}
                    placeholder="Enter student ID (if applicable)"
                  />
                </div>

                {/* Staff ID (conditional) */}
                <div>
                  <label className={`block text-sm font-medium mb-2 transition-colors duration-200 ${
                    theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                  }`}>
                    Staff ID
                  </label>
                  <input
                    type="text"
                    {...register('staffId')}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
                      theme === 'dark' 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'border-gray-300 placeholder-gray-500'
                    }`}
                    placeholder="Enter staff ID (if applicable)"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Survey Questions */}
            <div>
              <h2 className={`text-2xl font-semibold mb-6 flex items-center transition-colors duration-200 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                <span className={`rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3 ${
                  theme === 'dark' ? 'bg-green-900 text-green-100' : 'bg-green-100 text-green-600'
                }`}>2</span>
                Survey Questions
              </h2>
              
              <div className="space-y-6">
                {/* Question 1 */}
                <div>
                  <label className={`block text-sm font-medium mb-2 transition-colors duration-200 ${
                    theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                  }`}>
                    1. How many meals do you eat per day? *
                  </label>
                  <select
                    {...register('q1', { required: 'This question is required' })}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
                      theme === 'dark' 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select an option</option>
                    <option value="1-2">1-2 meals</option>
                    <option value="3">3 meals</option>
                    <option value="4">4 meals</option>
                    <option value="5+">5+ meals</option>
                  </select>
                  {errors.q1 && (
                    <p className="text-red-500 text-sm mt-1">{errors.q1.message}</p>
                  )}
                </div>

                {/* Question 2 */}
                <div>
                  <label className={`block text-sm font-medium mb-2 transition-colors duration-200 ${
                    theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                  }`}>
                    2. Do you eat breakfast regularly? *
                  </label>
                  <select
                    {...register('q2', { required: 'This question is required' })}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
                      theme === 'dark' 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select an option</option>
                    <option value="Always">Always</option>
                    <option value="Usually">Usually</option>
                    <option value="Sometimes">Sometimes</option>
                    <option value="Rarely">Rarely</option>
                    <option value="Never">Never</option>
                  </select>
                  {errors.q2 && (
                    <p className="text-red-500 text-sm mt-1">{errors.q2.message}</p>
                  )}
                </div>

                {/* Question 3 */}
                <div>
                  <label className={`block text-sm font-medium mb-2 transition-colors duration-200 ${
                    theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                  }`}>
                    3. How often do you consume fruits and vegetables? *
                  </label>
                  <select
                    {...register('q3', { required: 'This question is required' })}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
                      theme === 'dark' 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select an option</option>
                    <option value="Daily">Daily</option>
                    <option value="2-3 times per week">2-3 times per week</option>
                    <option value="Once a week">Once a week</option>
                    <option value="Rarely">Rarely</option>
                    <option value="Never">Never</option>
                  </select>
                  {errors.q3 && (
                    <p className="text-red-500 text-sm mt-1">{errors.q3.message}</p>
                  )}
                </div>

                {/* Question 4 */}
                <div>
                  <label className={`block text-sm font-medium mb-2 transition-colors duration-200 ${
                    theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                  }`}>
                    4. Do you drink enough water daily? *
                  </label>
                  <select
                    {...register('q4', { required: 'This question is required' })}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
                      theme === 'dark' 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select an option</option>
                    <option value="Yes, 8+ glasses">Yes, 8+ glasses</option>
                    <option value="Yes, 6-7 glasses">Yes, 6-7 glasses</option>
                    <option value="Yes, 4-5 glasses">Yes, 4-5 glasses</option>
                    <option value="Yes, 2-3 glasses">Yes, 2-3 glasses</option>
                    <option value="No, less than 2 glasses">No, less than 2 glasses</option>
                  </select>
                  {errors.q4 && (
                    <p className="text-red-500 text-sm mt-1">{errors.q4.message}</p>
                  )}
                </div>

                {/* Question 5 */}
                <div>
                  <label className={`block text-sm font-medium mb-2 transition-colors duration-200 ${
                    theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                  }`}>
                    5. How often do you eat fast food? *
                  </label>
                  <select
                    {...register('q5', { required: 'This question is required' })}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
                      theme === 'dark' 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select an option</option>
                    <option value="Daily">Daily</option>
                    <option value="2-3 times per week">2-3 times per week</option>
                    <option value="Once a week">Once a week</option>
                    <option value="2-3 times per month">2-3 times per month</option>
                    <option value="Rarely">Rarely</option>
                    <option value="Never">Never</option>
                  </select>
                  {errors.q5 && (
                    <p className="text-red-500 text-sm mt-1">{errors.q5.message}</p>
                  )}
                </div>

                {/* Question 6 */}
                <div>
                  <label className={`block text-sm font-medium mb-2 transition-colors duration-200 ${
                    theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                  }`}>
                    6. Do you follow any specific diet? *
                  </label>
                  <select
                    {...register('q6', { required: 'This question is required' })}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
                      theme === 'dark' 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select an option</option>
                    <option value="No specific diet">No specific diet</option>
                    <option value="Vegetarian">Vegetarian</option>
                    <option value="Vegan">Vegan</option>
                    <option value="Keto">Keto</option>
                    <option value="Paleo">Paleo</option>
                    <option value="Mediterranean">Mediterranean</option>
                    <option value="Low-carb">Low-carb</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.q6 && (
                    <p className="text-red-500 text-sm mt-1">{errors.q6.message}</p>
                  )}
                </div>

                {/* Question 7 */}
                <div>
                  <label className={`block text-sm font-medium mb-2 transition-colors duration-200 ${
                    theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                  }`}>
                    7. How would you rate your overall eating habits? *
                  </label>
                  <select
                    {...register('q7', { required: 'This question is required' })}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
                      theme === 'dark' 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select an option</option>
                    <option value="Excellent">Excellent</option>
                    <option value="Good">Good</option>
                    <option value="Average">Average</option>
                    <option value="Below average">Below average</option>
                    <option value="Poor">Poor</option>
                  </select>
                  {errors.q7 && (
                    <p className="text-red-500 text-sm mt-1">{errors.q7.message}</p>
                  )}
                </div>

                {/* Question 8 */}
                <div>
                  <label className={`block text-sm font-medium mb-2 transition-colors duration-200 ${
                    theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                  }`}>
                    8. Any additional comments about your diet? (Optional)
                  </label>
                  <textarea
                    {...register('q8')}
                    rows={3}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
                      theme === 'dark' 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'border-gray-300 placeholder-gray-500'
                    }`}
                    placeholder="Share any additional thoughts about your eating habits, dietary restrictions, or health goals..."
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className={`pt-6 border-t transition-colors duration-200 ${
              theme === 'dark' ? 'border-gray-600' : 'border-gray-200'
            }`}>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Survey'}
              </button>
              <p className={`text-sm text-center mt-3 transition-colors duration-200 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`}>
                * Required fields
              </p>
            </div>
          </form>
        </div>

        {/* Footer Info */}
        <div className={`text-center mt-8 transition-colors duration-200 ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
        }`}>
          <p>This survey is part of a student research project on eating habits and dietary preferences.</p>
          <p className="mt-2">Your responses will be kept confidential and used only for research purposes.</p>
        </div>
      </div>
    </div>
  );
};

export default SurveyForm;
