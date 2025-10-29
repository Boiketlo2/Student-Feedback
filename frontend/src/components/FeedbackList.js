import React from 'react';
import apiService from '../api';

const FeedbackList = ({ feedback, onFeedbackDeleted }) => {
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this feedback?')) {
      try {
        await apiService.deleteFeedback(id);
        alert('Feedback deleted successfully!');
        if (onFeedbackDeleted) {
          onFeedbackDeleted();
        }
      } catch (error) {
        console.error('Error deleting feedback:', error);
        alert(`Error: ${error.message}`);
      }
    }
  };

  const getRatingStars = (rating) => {
    return ''.repeat(rating) + ''.repeat(5 - rating);
  };

  if (feedback.length === 0) {
    return (
      <div className="alert alert-info text-center">
        No feedback submitted yet. Be the first to submit feedback!
      </div>
    );
  }

  return (
    <div>
      <h3 className="mb-4">All Feedback</h3>
      <div className="row">
        {feedback.map((item) => (
          <div key={item.id} className="col-md-6 mb-3">
            <div className="card h-100">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start">
                  <h5 className="card-title">{item.courseCode}</h5>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => handleDelete(item.id)}
                    title="Delete feedback"
                  >
                    ×
                  </button>
                </div>
                <h6 className="card-subtitle mb-2 text-muted">
                  By: {item.studentName}
                </h6>
                <div className="mb-2">
                  <strong>Rating:</strong> {getRatingStars(item.rating)} ({item.rating}/5)
                </div>
                {item.comments && (
                  <p className="card-text">
                    <strong>Comments:</strong> {item.comments}
                  </p>
                )}
                <small className="text-muted">
                  Submitted on: {new Date(item.createdAt).toLocaleString()}
                </small>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeedbackList;
