import React, { useState } from 'react';
import apiService from '../api';

const FeedbackForm = ({ onFeedbackAdded }) => {
  const [formData, setFormData] = useState({
    studentName: '',
    courseCode: '',
    comments: '',
    rating: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  const validateForm = () => {
    const newErrors = {};

    if (!formData.studentName.trim()) {
      newErrors.studentName = 'Student name is required';
    }

    if (!formData.courseCode.trim()) {
      newErrors.courseCode = 'Course code is required';
    }

    if (!formData.rating) {
      newErrors.rating = 'Rating is required';
    } else if (formData.rating < 1 || formData.rating > 5) {
      newErrors.rating = 'Rating must be between 1 and 5';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    // Clear server error when user makes changes
    if (serverError) {
      setServerError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await apiService.submitFeedback({
        ...formData,
        rating: parseInt(formData.rating)
      });

      // Reset form on success
      setFormData({
        studentName: '',
        courseCode: '',
        comments: '',
        rating: ''
      });
      setErrors({});
      
      console.log('✅ Feedback submitted successfully:', result);
      alert('Feedback submitted successfully!');
      
      // Notify parent component
      if (onFeedbackAdded) {
        onFeedbackAdded();
      }
    } catch (error) {
      console.error('❌ Error submitting feedback:', error);
      setServerError(error.message || 'Failed to submit feedback. Please try again.');
      alert(`Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-8">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title mb-0">Submit Course Feedback</h3>
          </div>
          <div className="card-body">
            {serverError && (
              <div className="alert alert-danger" role="alert">
                <strong>Server Error:</strong> {serverError}
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="studentName" className="form-label">
                  Student Name *
                </label>
                <input
                  type="text"
                  className={`form-control ${errors.studentName ? 'is-invalid' : ''}`}
                  id="studentName"
                  name="studentName"
                  value={formData.studentName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                />
                {errors.studentName && (
                  <div className="invalid-feedback">{errors.studentName}</div>
                )}
              </div>

              <div className="mb-3">
                <label htmlFor="courseCode" className="form-label">
                  Course Code *
                </label>
                <input
                  type="text"
                  className={`form-control ${errors.courseCode ? 'is-invalid' : ''}`}
                  id="courseCode"
                  name="courseCode"
                  value={formData.courseCode}
                  onChange={handleChange}
                  placeholder="e.g., BIWA2110"
                />
                {errors.courseCode && (
                  <div className="invalid-feedback">{errors.courseCode}</div>
                )}
              </div>

              <div className="mb-3">
                <label htmlFor="comments" className="form-label">
                  Comments
                </label>
                <textarea
                  className="form-control"
                  id="comments"
                  name="comments"
                  rows="3"
                  value={formData.comments}
                  onChange={handleChange}
                  placeholder="Enter your feedback comments..."
                ></textarea>
              </div>

              <div className="mb-3">
                <label htmlFor="rating" className="form-label">
                  Rating (1-5) *
                </label>
                <select
                  className={`form-control ${errors.rating ? 'is-invalid' : ''}`}
                  id="rating"
                  name="rating"
                  value={formData.rating}
                  onChange={handleChange}
                >
                  <option value="">Select a rating</option>
                  <option value="1">1 - Very Poor</option>
                  <option value="2">2 - Poor</option>
                  <option value="3">3 - Average</option>
                  <option value="4">4 - Good</option>
                  <option value="5">5 - Excellent</option>
                </select>
                {errors.rating && (
                  <div className="invalid-feedback">{errors.rating}</div>
                )}
              </div>

              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Submitting...
                  </>
                ) : (
                  'Submit Feedback'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackForm;
