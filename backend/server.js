const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

console.log('🔧 Supabase Client Initialized');
console.log('📋 URL:', supabaseUrl);

// Middleware
app.use(cors());
app.use(express.json());

// Test database connection on startup
async function testConnection() {
  try {
    console.log('🔄 Testing database connection...');
    
    // Simple query to test connection
    const { data, error } = await supabase
      .from('feedback')
      .select('id')
      .limit(1);

    if (error) {
      console.log('❌ Database connection failed:', error.message);
      console.log('💡 Make sure the feedback table exists in Supabase');
      return false;
    }

    console.log('✅ Database connection successful!');
    return true;
  } catch (err) {
    console.log('❌ Connection test error:', err.message);
    return false;
  }
}

// Routes

// GET all feedback
app.get('/api/feedback', async (req, res) => {
  try {
    console.log('📥 GET /api/feedback requested');
    
    const { data, error } = await supabase
      .from('feedback')
      .select('*')
      .order('createdAt', { ascending: false });

    if (error) {
      console.error('❌ Database error:', error);
      return res.status(500).json({ 
        error: 'Failed to fetch feedback',
        details: error.message 
      });
    }

    console.log(`✅ Returning ${data?.length || 0} feedback items`);
    res.json(data || []);
  } catch (err) {
    console.error('❌ Server error:', err);
    res.status(500).json({ 
      error: 'Failed to fetch feedback',
      details: err.message 
    });
  }
});

// POST new feedback
app.post('/api/feedback', async (req, res) => {
  try {
    const { studentName, courseCode, comments, rating } = req.body;
    
    console.log('📤 POST /api/feedback:', { studentName, courseCode, rating });
    
    // Validation
    if (!studentName || !courseCode || !rating) {
      return res.status(400).json({ error: 'Student name, course code, and rating are required' });
    }
    
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }
    
    const { data, error } = await supabase
      .from('feedback')
      .insert([
        { 
          studentName, 
          courseCode, 
          comments: comments || '', 
          rating: parseInt(rating)
        }
      ])
      .select();

    if (error) {
      console.error('❌ Database insert error:', error);
      return res.status(500).json({ 
        error: 'Failed to add feedback to database',
        details: error.message 
      });
    }

    console.log('✅ Feedback added successfully:', data[0].id);
    res.status(201).json({ 
      message: 'Feedback added successfully', 
      feedback: data[0]
    });
  } catch (err) {
    console.error('❌ Server error:', err);
    res.status(500).json({ 
      error: 'Failed to add feedback',
      details: err.message 
    });
  }
});

// DELETE feedback (Bonus feature)
app.delete('/api/feedback/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log('🗑️ DELETE /api/feedback/', id);
    
    const { data, error } = await supabase
      .from('feedback')
      .delete()
      .eq('id', id)
      .select();

    if (error) {
      console.error('❌ Database delete error:', error);
      return res.status(500).json({ 
        error: 'Failed to delete feedback',
        details: error.message 
      });
    }

    if (data.length === 0) {
      return res.status(404).json({ error: 'Feedback not found' });
    }

    console.log('✅ Feedback deleted successfully:', id);
    res.json({ message: 'Feedback deleted successfully' });
  } catch (err) {
    console.error('❌ Server error:', err);
    res.status(500).json({ 
      error: 'Failed to delete feedback',
      details: err.message 
    });
  }
});

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('_supabase_settings')
      .select('*')
      .limit(1);

    if (error) {
      return res.status(500).json({ 
        status: 'error', 
        message: 'Database connection failed',
        error: error.message 
      });
    }

    res.json({ 
      status: 'ok', 
      message: 'Server and database are connected',
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({ 
      status: 'error', 
      message: 'Health check failed',
      error: err.message 
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Unhandled error:', err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Initialize and start server
async function startServer() {
  // Test connection first
  await testConnection();
  
  app.listen(PORT, () => {
    console.log('\n🎉 Server started successfully!');
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📊 API Endpoints:`);
    console.log(`   GET  http://localhost:${PORT}/api/feedback`);
    console.log(`   POST http://localhost:${PORT}/api/feedback`);
    console.log(`   DEL  http://localhost:${PORT}/api/feedback/:id`);
    console.log(`   GET  http://localhost:${PORT}/api/health`);
    console.log('\n💡 Make sure the feedback table exists in Supabase SQL Editor');
  });
}

startServer();
