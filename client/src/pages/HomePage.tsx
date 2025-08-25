import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  BarChart3, 
  Users, 
  FileText, 
  Shield, 
  Smartphone, 
  TrendingUp,
  CheckCircle,
  ArrowRight
} from 'lucide-react';

const HomePage: React.FC = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: BarChart3,
      title: 'Data Analysis',
      description: 'Advanced analytics and visualization tools to understand eating habits and dietary patterns.'
    },
    {
      icon: Users,
      title: 'Participant Management',
      description: 'Easily manage teaching staff, non-teaching staff, and students across different departments.'
    },
    {
      icon: FileText,
      title: 'Report Generation',
      description: 'Automated report generation with personalized health advisory and recommendations.'
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Enterprise-grade security with encrypted data storage and privacy protection.'
    },
    {
      icon: Smartphone,
      title: 'Mobile Friendly',
      description: 'Fully responsive design that works seamlessly on all devices and screen sizes.'
    },
    {
      icon: TrendingUp,
      title: 'Real-time Insights',
      description: 'Live dashboard with real-time updates and comprehensive survey analytics.'
    }
  ];

  const stats = [
    { number: '30+', label: 'Participants' },
    { number: '3', label: 'Categories' },
    { number: '100%', label: 'Responsive' },
    { number: '24/7', label: 'Access' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-primary text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Study Eating Habits with
              <span className="block text-yellow-300">Smart Surveys</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-blue-100">
              A comprehensive platform for conducting eating habits and diet surveys with advanced data analysis, 
              personalized health advisory, and professional reporting capabilities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {!isAuthenticated ? (
                <>
                  <Link
                    to="/register"
                    className="bg-white text-primary-600 hover:bg-blue-50 font-semibold py-3 px-8 rounded-lg text-lg transition-colors duration-200"
                  >
                    Get Started
                  </Link>
                  <Link
                    to="/login"
                    className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-semibold py-3 px-8 rounded-lg text-lg transition-colors duration-200"
                  >
                    Sign In
                  </Link>
                </>
              ) : (
                <Link
                  to="/dashboard"
                  className="bg-white text-primary-600 hover:bg-blue-50 font-semibold py-3 px-8 rounded-lg text-lg transition-colors duration-200"
                >
                  Go to Dashboard
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-primary-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-secondary-600 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-secondary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
              Everything You Need for Survey Success
            </h2>
            <p className="text-xl text-secondary-600 max-w-2xl mx-auto">
              Our platform provides all the tools and features needed to conduct comprehensive 
              eating habits research and generate actionable insights.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="card-hover group">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary-200 transition-colors duration-200">
                    <Icon className="w-6 h-6 text-primary-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-secondary-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-secondary-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-secondary-600 max-w-2xl mx-auto">
              Simple steps to get started with your eating habits survey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary-600">1</span>
              </div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-3">
                Register & Create Survey
              </h3>
              <p className="text-secondary-600">
                Sign up and create your custom survey with questions about eating habits, 
                food preferences, and dietary patterns.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary-600">2</span>
              </div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-3">
                Collect Responses
              </h3>
              <p className="text-secondary-600">
                Invite participants from teaching staff, non-teaching staff, and students 
                to complete your survey securely.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary-600">3</span>
              </div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-3">
                Analyze & Report
              </h3>
              <p className="text-secondary-600">
                Generate comprehensive reports with data visualization, health advisory, 
                and actionable recommendations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-secondary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Start Your Survey?
          </h2>
          <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
            Join hundreds of researchers and students who are already using our platform 
            to gain valuable insights into eating habits and dietary patterns.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {!isAuthenticated ? (
              <>
                <Link
                  to="/register"
                  className="bg-white text-secondary-700 hover:bg-blue-50 font-semibold py-3 px-8 rounded-lg text-lg transition-colors duration-200 flex items-center justify-center space-x-2"
                >
                  <span>Get Started Free</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/login"
                  className="border-2 border-white text-white hover:bg-white hover:text-secondary-700 font-semibold py-3 px-8 rounded-lg text-lg transition-colors duration-200"
                >
                  Sign In
                </Link>
              </>
            ) : (
              <Link
                to="/dashboard"
                className="bg-white text-secondary-700 hover:bg-blue-50 font-semibold py-3 px-8 rounded-lg text-lg transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                <span>Go to Dashboard</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-secondary-600 mb-8">
              Trusted by Students and Researchers
            </h3>
            <div className="flex flex-wrap justify-center items-center gap-8 text-secondary-400">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-success-500" />
                <span>Secure & Private</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-success-500" />
                <span>Mobile Optimized</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-success-500" />
                <span>24/7 Support</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-success-500" />
                <span>Data Export</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
