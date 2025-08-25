import React from 'react';

const AnalysisPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-secondary-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="card text-center">
          <h1 className="text-3xl font-bold text-secondary-900 mb-4">
            Data Analysis
          </h1>
          <p className="text-secondary-600 mb-6">
            Advanced analytics and visualization tools for understanding eating habits and dietary patterns.
          </p>
          <p className="text-secondary-500">
            Charts, graphs, and trend analysis coming soon...
          </p>
        </div>
      </div>
    </div>
  );
};

export default AnalysisPage;
