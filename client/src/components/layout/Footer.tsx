import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Github, Mail, Phone } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-secondary-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand and description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">D</span>
              </div>
              <span className="text-xl font-bold">DietSurvey</span>
            </div>
            <p className="text-secondary-300 mb-4 max-w-md">
              A comprehensive platform for conducting eating habits and diet surveys with advanced data analysis and reporting capabilities. 
              Designed for students, teaching staff, and non-teaching staff.
            </p>
            <div className="flex space-x-4">
              <a
                href="mailto:contact@dietsurvey.com"
                className="text-secondary-400 hover:text-white transition-colors duration-200"
                title="Email us"
              >
                <Mail className="w-5 h-5" />
              </a>
              <a
                href="tel:+1234567890"
                className="text-secondary-400 hover:text-white transition-colors duration-200"
                title="Call us"
              >
                <Phone className="w-5 h-5" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-secondary-400 hover:text-white transition-colors duration-200"
                title="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-secondary-400 hover:text-white transition-colors duration-200"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard"
                  className="text-secondary-400 hover:text-white transition-colors duration-200"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  to="/analysis"
                  className="text-secondary-400 hover:text-white transition-colors duration-200"
                >
                  Analysis
                </Link>
              </li>
              <li>
                <Link
                  to="/reports"
                  className="text-secondary-400 hover:text-white transition-colors duration-200"
                >
                  Reports
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/register"
                  className="text-secondary-400 hover:text-white transition-colors duration-200"
                >
                  Register
                </Link>
              </li>
              <li>
                <Link
                  to="/login"
                  className="text-secondary-400 hover:text-white transition-colors duration-200"
                >
                  Login
                </Link>
              </li>
              <li>
                <a
                  href="#"
                  className="text-secondary-400 hover:text-white transition-colors duration-200"
                >
                  Help Center
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-secondary-400 hover:text-white transition-colors duration-200"
                >
                  Contact Support
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom section */}
        <div className="border-t border-secondary-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-secondary-400 text-sm">
              © {currentYear} DietSurvey Platform. All rights reserved.
            </p>
            <div className="flex items-center space-x-2 text-secondary-400 text-sm mt-4 md:mt-0">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-danger-500 fill-current" />
              <span>for better health insights</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
