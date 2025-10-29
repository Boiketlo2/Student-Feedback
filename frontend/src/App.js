import React, { useState, useEffect } from 'react';
import FeedbackForm from './components/FeedbackForm';
import FeedbackList from './components/FeedbackList';
import Dashboard from './components/Dashboard';
import apiService from './api';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [feedback, setFeedback] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState('checking');

  const fetchFeedback = async () => {
    try {
      setIsLoading(true);
      const data = await apiService.getAllFeedback();
      setFeedback(data);
      setConnectionStatus('connected');
    } catch (error) {
      console.error('Error fetching feedback:', error);
      setConnectionStatus('disconnected');
      setFeedback([]);
    } finally {
      setIsLoading(false);
    }
  };

  const testConnection = async () => {
    const isConnected = await apiService.testConnection();
    setConnectionStatus(isConnected ? 'connected' : 'disconnected');
  };

  useEffect(() => {
    testConnection();
    fetchFeedback();
  }, []);

  const handleFeedbackAdded = () => {
    fetchFeedback();
    setCurrentView('list');
  };

  const handleFeedbackDeleted = () => {
    fetchFeedback();
  };

  const getConnectionStatusBadge = () => {
    const statusConfig = {
      checking: { class: 'bg-secondary', text: 'Checking...' },
      connected: { class: 'bg-success', text: 'Connected' },
      disconnected: { class: 'bg-danger', text: 'Disconnected' }
    };
    
    const config = statusConfig[connectionStatus] || statusConfig.checking;
    
    return (
      <span className={`badge ${config.class} ms-2`}>
        {config.text}
      </span>
    );
  };

  const getNavButtonClass = (viewName) => {
    return `nav-link btn btn-link ${currentView === viewName ? 'active' : ''}`;
  };

  return (
    <div className="App d-flex flex-column min-vh-100">
      {/* Header */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container">
          <span className="navbar-brand">
            Student Feedback App
            {getConnectionStatusBadge()}
          </span>
          <div className="navbar-nav">
            <button 
              className={getNavButtonClass('dashboard')}
              onClick={() => setCurrentView('dashboard')}
            >
               Dashboard
            </button>
            <button 
              className={getNavButtonClass('list')}
              onClick={() => setCurrentView('list')}
            >
               View Feedback
            </button>
            <button 
              className={getNavButtonClass('form')}
              onClick={() => setCurrentView('form')}
            >
               Submit Feedback
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow-1">
        <div className="container mt-4">
          {isLoading && (currentView === 'list' || currentView === 'dashboard') && (
            <div className="text-center">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-2">Loading feedback data...</p>
            </div>
          )}
          
          {connectionStatus === 'disconnected' && (
            <div className="alert alert-warning">
              <strong>Warning:</strong> Cannot connect to backend server. 
              Please make sure the backend is running on port 5000.
              <br />
              <small>Some features may not work properly.</small>
            </div>
          )}

          {!isLoading && (
            <>
              {currentView === 'dashboard' && (
                <Dashboard feedback={feedback} />
              )}
              {currentView === 'form' && (
                <FeedbackForm onFeedbackAdded={handleFeedbackAdded} />
              )}
              {currentView === 'list' && (
                <FeedbackList 
                  feedback={feedback} 
                  onFeedbackDeleted={handleFeedbackDeleted}
                />
              )}
            </>
          )}
        </div>
      </main>

      {/* Footer - Updated to match navbar blue */}
      <footer className="bg-primary text-light mt-5 py-4">
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <h5>Student Feedback Application</h5>
              <p className="mb-0">
                A full-stack web application built with React.js and Node.js
              </p>
              <small className="text-light" style={{opacity: 0.8}}>
                Developed for BIWA2110 Web Application Development
              </small>
            </div>
            <div className="col-md-3">
              <h6>Quick Links</h6>
              <ul className="list-unstyled">
                <li>
                  <button 
                    className="btn btn-link text-light p-0 text-decoration-none"
                    onClick={() => setCurrentView('dashboard')}
                  >
                    Dashboard
                  </button>
                </li>
                <li>
                  <button 
                    className="btn btn-link text-light p-0 text-decoration-none"
                    onClick={() => setCurrentView('list')}
                  >
                     View Feedback
                  </button>
                </li>
                <li>
                  <button 
                    className="btn btn-link text-light p-0 text-decoration-none"
                    onClick={() => setCurrentView('form')}
                  >
                     Submit Feedback
                  </button>
                </li>
              </ul>
            </div>
            <div className="col-md-3">
              <h6>Technical Stack</h6>
              <ul className="list-unstyled small">
                <li>⚛️ React.js Frontend</li>
                <li>🟨 Node.js Backend</li>
                <li>🗄️ Supabase PostgreSQL</li>
                <li>🎨 Bootstrap CSS</li>
              </ul>
            </div>
          </div>
          <hr className="my-3 bg-light" style={{opacity: 0.2}} />
          <div className="row align-items-center">
            <div className="col-md-6">
              <small className="text-light" style={{opacity: 0.8}}>
                © {new Date().getFullYear()} Student Feedback App. All rights reserved.
              </small>
            </div>
            <div className="col-md-6 text-md-end">
              <small className="text-light" style={{opacity: 0.8}}>
                Built with 💻 by Boiketlo Alotsi | Limkokwing University
              </small>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
