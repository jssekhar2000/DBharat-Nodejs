require('dotenv').config({ path: './.env' });
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors')

const app = express();
const PORT = process.env.PORT || 5000;
const DB_URL = process.env.MONGODB_URI
const auth_routes = require('./routes/auth');
const certificate_routes = require('./routes/certificate');
const college_routes = require('./routes/college');
const students_routes = require('./routes/students');

// Middleware
app.use(bodyParser.json());

app.use(cors());
app.options('*', cors())

// Connect to MongoDB
mongoose.connect(DB_URL).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Could not connect to MongoDB', err);
});

// Routes
app.use('/api/', auth_routes);
app.use('/api/certificate', certificate_routes);
app.use('/api/college', college_routes);
app.use('/api/students', students_routes);
app.use('/api/protected', require('./routes/protected'));


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
