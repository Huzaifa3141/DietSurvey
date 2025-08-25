import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { ThemeContext } from '../App';
import { getApiUrl } from '../config';

interface Response {
  id: string;
  answer: string;
  participant: {
    name: string;
    email: string;
    category: string;
    gender: string;
    age: number;
    department: string;
  };
  question: {
    text: string;
    type: string;
    order: number;
  };
}

interface Stats {
  overview: {
    totalParticipants: number;
    totalResponses: number;
    averageResponsesPerParticipant: string;
  };
  byCategory: Array<{ category: string; _count: { id: number } }>;
  byGender: Array<{ gender: string; _count: { id: number } }>;
  ageStats: {
    _avg: { age: number | null };
    _min: { age: number | null };
    _max: { age: number | null };
  };
}

const AdminPage: React.FC = () => {
  const [responses, setResponses] = useState<Response[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    fetchData();
  }, [currentPage]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch responses
      const responsesRes = await axios.get(getApiUrl(`/api/survey/responses?page=${currentPage}&limit=20`));
      setResponses(responsesRes.data.responses);
      setTotalPages(responsesRes.data.pagination.pages);
      
      // Fetch stats
      const statsRes = await axios.get(getApiUrl('/api/survey/stats'));
      setStats(statsRes.data);
      
    } catch (error: any) {
      console.error('Error fetching data:', error);
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    if (responses.length === 0) {
      toast.error('No data to export');
      return;
    }

    // Group responses by participant
    const participantResponses = responses.reduce((acc, response) => {
      const participantId = response.participant.email;
      if (!acc[participantId]) {
        acc[participantId] = {
          name: response.participant.name,
          email: response.participant.email,
          category: response.participant.category,
          gender: response.participant.gender,
          age: response.participant.age,
          department: response.participant.department,
          responses: {}
        };
      }
      acc[participantId].responses[`Q${response.question.order}`] = response.answer;
      return acc;
    }, {} as any);

    // Convert to CSV
    const csvHeaders = [
      'Name', 'Email', 'Category', 'Gender', 'Age', 'Department',
      'Q1: Meals per day', 'Q2: Breakfast', 'Q3: Fruits/Vegetables',
      'Q4: Water intake', 'Q5: Fast food', 'Q6: Diet type',
      'Q7: Eating habits rating', 'Q8: Additional comments'
    ];

    const csvRows = Object.values(participantResponses).map((participant: any) => [
      participant.name,
      participant.email,
      participant.category,
      participant.gender,
      participant.age,
      participant.department,
      participant.responses.Q1 || '',
      participant.responses.Q2 || '',
      participant.responses.Q3 || '',
      participant.responses.Q4 || '',
      participant.responses.Q5 || '',
      participant.responses.Q6 || '',
      participant.responses.Q7 || '',
      participant.responses.Q8 || ''
    ]);

    const csvContent = [csvHeaders, ...csvRows]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `survey_responses_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    toast.success('CSV exported successfully!');
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center transition-colors duration-200 ${
        theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className={`mt-4 transition-colors duration-200 ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Loading survey data...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen py-8 px-4 transition-colors duration-200 ${
      theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className={`text-4xl font-bold mb-4 transition-colors duration-200 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            📊 Survey Admin Dashboard
          </h1>
          <p className={`text-lg transition-colors duration-200 ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          }`}>
            View and analyze survey responses
          </p>
        </div>

        {/* Statistics Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className={`rounded-lg shadow p-6 transition-colors duration-200 ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            }`}>
              <h3 className={`text-sm font-medium mb-2 transition-colors duration-200 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`}>Total Participants</h3>
              <p className="text-3xl font-bold text-blue-600">{stats.overview.totalParticipants}</p>
            </div>
            <div className={`rounded-lg shadow p-6 transition-colors duration-200 ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            }`}>
              <h3 className={`text-sm font-medium mb-2 transition-colors duration-200 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`}>Total Responses</h3>
              <p className="text-3xl font-bold text-green-600">{stats.overview.totalResponses}</p>
            </div>
            <div className={`rounded-lg shadow p-6 transition-colors duration-200 ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            }`}>
              <h3 className={`text-sm font-medium mb-2 transition-colors duration-200 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`}>Avg Responses/Person</h3>
              <p className="text-3xl font-bold text-purple-600">{stats.overview.averageResponsesPerParticipant}</p>
            </div>
            <div className={`rounded-lg shadow p-6 transition-colors duration-200 ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            }`}>
              <h3 className={`text-sm font-medium mb-2 transition-colors duration-200 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`}>Average Age</h3>
              <p className="text-3xl font-bold text-orange-600">
                {stats.ageStats._avg.age ? Math.round(stats.ageStats._avg.age) : 'N/A'}
              </p>
            </div>
          </div>
        )}

        {/* Category and Gender Breakdown */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className={`rounded-lg shadow p-6 transition-colors duration-200 ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            }`}>
              <h3 className={`text-lg font-semibold mb-4 transition-colors duration-200 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>Participants by Category</h3>
              <div className="space-y-2">
                {stats.byCategory.map((item) => (
                  <div key={item.category} className="flex justify-between items-center">
                    <span className={`transition-colors duration-200 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                    }`}>{item.category.replace('_', ' ')}</span>
                    <span className="font-semibold text-blue-600">{item._count.id}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className={`rounded-lg shadow p-6 transition-colors duration-200 ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            }`}>
              <h3 className={`text-lg font-semibold mb-4 transition-colors duration-200 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>Participants by Gender</h3>
              <div className="space-y-2">
                {stats.byGender.map((item) => (
                  <div key={item.gender} className="flex justify-between items-center">
                    <span className={`transition-colors duration-200 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                    }`}>{item.gender}</span>
                    <span className="font-semibold text-green-600">{item._count.id}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Export Button */}
        <div className="mb-6 flex justify-end">
          <button
            onClick={exportToCSV}
            className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
          >
            📥 Export to CSV
          </button>
        </div>

        {/* Responses Table */}
        <div className={`rounded-lg shadow overflow-hidden transition-colors duration-200 ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        }`}>
          <div className={`px-6 py-4 border-b transition-colors duration-200 ${
            theme === 'dark' ? 'border-gray-600' : 'border-gray-200'
          }`}>
            <h3 className={`text-lg font-semibold transition-colors duration-200 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>Survey Responses</h3>
          </div>
          
          {responses.length === 0 ? (
            <div className={`px-6 py-12 text-center transition-colors duration-200 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            }`}>
              No responses yet. Share the survey link to start collecting data!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className={`transition-colors duration-200 ${
                  theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
                }`}>
                  <tr>
                    <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider transition-colors duration-200 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                    }`}>
                      Participant
                    </th>
                    <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider transition-colors duration-200 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                    }`}>
                      Question
                    </th>
                    <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider transition-colors duration-200 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                    }`}>
                      Answer
                    </th>
                  </tr>
                </thead>
                <tbody className={`divide-y transition-colors duration-200 ${
                  theme === 'dark' ? 'divide-gray-600 bg-gray-800' : 'divide-gray-200 bg-white'
                }`}>
                  {responses.map((response) => (
                    <tr key={response.id} className={`hover:bg-opacity-50 transition-colors duration-200 ${
                      theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                    }`}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className={`text-sm font-medium transition-colors duration-200 ${
                            theme === 'dark' ? 'text-white' : 'text-gray-900'
                          }`}>
                            {response.participant.name}
                          </div>
                          <div className={`text-sm transition-colors duration-200 ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                          }`}>
                            {response.participant.email}
                          </div>
                          <div className={`text-xs transition-colors duration-200 ${
                            theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                          }`}>
                            {response.participant.category} • {response.participant.gender} • Age {response.participant.age}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`text-sm transition-colors duration-200 ${
                          theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>
                          Q{response.question.order}: {response.question.text}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className={`text-sm max-w-xs truncate transition-colors duration-200 ${
                          theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>
                          {response.answer}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex justify-center">
            <nav className="flex space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className={`px-3 py-2 text-sm font-medium rounded-md border transition-colors duration-200 ${
                  theme === 'dark'
                    ? 'text-gray-300 bg-gray-800 border-gray-600 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed'
                    : 'text-gray-500 bg-white border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
                }`}
              >
                Previous
              </button>
              
              <span className={`px-3 py-2 text-sm font-medium rounded-md border transition-colors duration-200 ${
                theme === 'dark'
                  ? 'text-gray-200 bg-gray-800 border-gray-600'
                  : 'text-gray-700 bg-white border-gray-300'
              }`}>
                Page {currentPage} of {totalPages}
              </span>
              
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className={`px-3 py-2 text-sm font-medium rounded-md border transition-colors duration-200 ${
                  theme === 'dark'
                    ? 'text-gray-300 bg-gray-800 border-gray-600 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed'
                    : 'text-gray-500 bg-white border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
                }`}
              >
                Next
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
