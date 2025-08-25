import React from 'react';

const ParticipantsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-secondary-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="card text-center">
          <h1 className="text-3xl font-bold text-secondary-900 mb-4">
            Participants Management
          </h1>
          <p className="text-secondary-600 mb-6">
            Manage teaching staff, non-teaching staff, and students participating in the survey.
          </p>
          <p className="text-secondary-500">
            Participant management and tracking features coming soon...
          </p>
        </div>
      </div>
    </div>
  );
};

export default ParticipantsPage;
