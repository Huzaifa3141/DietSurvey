import React from 'react';
import { useParams } from 'react-router-dom';

const SurveyPage: React.FC = () => {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-secondary-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="card text-center">
          <h1 className="text-3xl font-bold text-secondary-900 mb-4">
            Survey Page
          </h1>
          <p className="text-secondary-600 mb-6">
            This page will display the survey with ID: {id}
          </p>
          <p className="text-secondary-500">
            Survey form and response collection functionality coming soon...
          </p>
        </div>
      </div>
    </div>
  );
};

export default SurveyPage;
