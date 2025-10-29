# Update backend CORS configuration
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Supabase client with environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

console.log('🔧 Supabase Client Initialized');

// Enhanced CORS configuration for production
app.use(cors({
  origin: [
    'http://localhost:3000',  // Local development
    'https://your-frontend-domain.netlify.app',  // Your frontend domain when deployed
    '*'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// ... rest of your server code remains the same

// Test the API
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'API is working!',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

// ... rest of your routes

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📊 API URL: https://student-feedback-2-6l3l.onrender.com`);
});
