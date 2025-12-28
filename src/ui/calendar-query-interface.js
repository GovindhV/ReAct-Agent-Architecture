import React, { useState } from 'react';
import { Calendar, Send, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

export default function ReActCalendarUI() {
  const [email, setEmail] = useState('');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!email || !query) return;
    
    setLoading(true);
    setError('');
    setResponse(null);

    try {
      const res = await fetch('http://localhost:3001/api/process-query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, query }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to process query');
      }

      setResponse(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white">
            <div className="flex items-center gap-3 mb-2">
              <Calendar className="w-10 h-10" />
              <h1 className="text-3xl font-bold">ReAct Calendar Assistant</h1>
            </div>
            <p className="text-blue-100">AI-powered scheduling with real-time processing</p>
          </div>

          <div className="p-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@company.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Query
                </label>
                <textarea
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Schedule a meeting with the production team next Tuesday at 2pm to discuss Q1 targets..."
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
                />
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading || !email || !query}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Process Query
                  </>
                )}
              </button>
            </div>

            {response && (
              <div className="mt-8 p-6 bg-green-50 border-2 border-green-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-green-900 mb-3">Success!</h3>
                    
                    <div className="space-y-3">
                      <div>
                        <span className="font-medium text-gray-700">Thought Process:</span>
                        <p className="text-gray-600 mt-1">{response.thought}</p>
                      </div>
                      
                      <div>
                        <span className="font-medium text-gray-700">Action Taken:</span>
                        <p className="text-gray-600 mt-1">{response.action}</p>
                      </div>
                      
                      {response.event && (
                        <div className="mt-4 p-4 bg-white rounded-lg border border-green-200">
                          <h4 className="font-semibold text-gray-900 mb-2">Event Created:</h4>
                          <div className="space-y-1 text-sm">
                            <p><span className="font-medium">Title:</span> {response.event.title}</p>
                            <p><span className="font-medium">Date:</span> {response.event.date}</p>
                            <p><span className="font-medium">Time:</span> {response.event.time}</p>
                            <p><span className="font-medium">Attendees:</span> {response.event.attendees}</p>
                          </div>
                        </div>
                      )}
                      
                      <div className="text-sm text-gray-500 mt-2">
                        Stream ID: {response.streamId}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="mt-8 p-6 bg-red-50 border-2 border-red-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-red-900 mb-1">Error</h3>
                    <p className="text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="bg-gray-50 p-6 border-t">
            <h3 className="font-semibold text-gray-900 mb-3">Example Queries:</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• "Schedule a production review meeting tomorrow at 10am"</li>
              <li>• "Create a quality audit event for Friday afternoon"</li>
              <li>• "Book a supplier meeting next Monday at 3pm"</li>
              <li>• "Schedule inventory check for Wednesday morning"</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}