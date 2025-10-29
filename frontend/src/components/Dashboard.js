import React from 'react';

const Dashboard = ({ feedback }) => {
  const totalFeedback = feedback.length;
  
  const averageRating = totalFeedback > 0 
    ? (feedback.reduce((sum, item) => sum + item.rating, 0) / totalFeedback).toFixed(2)
    : 0;

  const ratingDistribution = {
    1: feedback.filter(item => item.rating === 1).length,
    2: feedback.filter(item => item.rating === 2).length,
    3: feedback.filter(item => item.rating === 3).length,
    4: feedback.filter(item => item.rating === 4).length,
    5: feedback.filter(item => item.rating === 5).length,
  };

  const courseCounts = feedback.reduce((acc, item) => {
    acc[item.courseCode] = (acc[item.courseCode] || 0) + 1;
    return acc;
  }, {});

  const popularCourses = Object.entries(courseCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);

  return (
    <div>
      <h3 className="mb-4">Feedback Dashboard</h3>
      
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card text-white bg-primary">
            <div className="card-body">
              <h4 className="card-title">{totalFeedback}</h4>
              <p className="card-text">Total Feedback</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-white bg-success">
            <div className="card-body">
              <h4 className="card-title">{averageRating}</h4>
              <p className="card-text">Average Rating</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-white bg-info">
            <div className="card-body">
              <h4 className="card-title">{Object.keys(courseCounts).length}</h4>
              <p className="card-text">Courses Rated</p>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">Rating Distribution</h5>
            </div>
            <div className="card-body">
              {[5, 4, 3, 2, 1].map(rating => (
                <div key={rating} className="mb-2">
                  <div className="d-flex justify-content-between">
                    <span>{rating} </span>
                    <span>{ratingDistribution[rating]} feedback</span>
                  </div>
                  <div className="progress">
                    <div
                      className="progress-bar"
                      style={{
                        width: `${totalFeedback > 0 ? (ratingDistribution[rating] / totalFeedback) * 100 : 0}%`
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">Most Rated Courses</h5>
            </div>
            <div className="card-body">
              {popularCourses.length > 0 ? (
                <ul className="list-group">
                  {popularCourses.map(([course, count]) => (
                    <li key={course} className="list-group-item d-flex justify-content-between">
                      <span>{course}</span>
                      <span className="badge bg-primary rounded-pill">{count}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted">No feedback data available</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;