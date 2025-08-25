import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { BarChart3, Users, FileText, TrendingUp } from 'lucide-react';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  const stats = [
    {
      title: 'Total Participants',
      value: '30',
      change: '+12%',
      changeType: 'positive',
      icon: Users
    },
    {
      title: 'Surveys Completed',
      value: '28',
      change: '+8%',
      changeType: 'positive',
      icon: FileText
    },
    {
      title: 'Response Rate',
      value: '93%',
      change: '+5%',
      changeType: 'positive',
      icon: TrendingUp
    },
    {
      title: 'Data Points',
      value: '224',
      change: '+15%',
      changeType: 'positive',
      icon: BarChart3
    }
  ];

  return (
    <div className="min-h-screen bg-secondary-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-secondary-900 mb-2">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-secondary-600">
            Here's an overview of your eating habits survey platform
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-secondary-600">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-secondary-900">
                      {stat.value}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                    <Icon className="w-6 h-6 text-primary-600" />
                  </div>
                </div>
                <div className="mt-4">
                  <span className={`text-sm font-medium ${
                    stat.changeType === 'positive' ? 'text-success-600' : 'text-danger-600'
                  }`}>
                    {stat.change}
                  </span>
                  <span className="text-sm text-secondary-600 ml-1">from last month</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="card">
            <h3 className="text-lg font-semibold text-secondary-900 mb-4">
              Quick Actions
            </h3>
            <div className="space-y-3">
              <button className="w-full btn-primary text-left">
                Create New Survey
              </button>
              <button className="w-full btn-secondary text-left">
                View Responses
              </button>
              <button className="w-full btn-secondary text-left">
                Generate Report
              </button>
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold text-secondary-900 mb-4">
              Recent Activity
            </h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 bg-secondary-50 rounded-lg">
                <div className="w-2 h-2 bg-success-500 rounded-full"></div>
                <span className="text-sm text-secondary-600">
                  New participant registered
                </span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-secondary-50 rounded-lg">
                <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                <span className="text-sm text-secondary-600">
                  Survey response received
                </span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-secondary-50 rounded-lg">
                <div className="w-2 h-2 bg-warning-500 rounded-full"></div>
                <span className="text-sm text-secondary-600">
                  Health advisory generated
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Coming Soon */}
        <div className="mt-8 card">
          <div className="text-center py-8">
            <h3 className="text-xl font-semibold text-secondary-900 mb-2">
              More Features Coming Soon!
            </h3>
            <p className="text-secondary-600 mb-4">
              We're working on adding more advanced analytics, chart visualizations, and reporting features.
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              <span className="badge badge-primary">Data Visualization</span>
              <span className="badge badge-primary">Advanced Analytics</span>
              <span className="badge badge-primary">Export Reports</span>
              <span className="badge badge-primary">Health Advisory</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
