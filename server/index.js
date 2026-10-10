const express = require('express');
const cors = require('cors');
const http = require('http');
const path = require('path');
require('dotenv').config();

const db = require('./models');
const authRoutes = require('./routes/authRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const assignmentRoutes = require('./routes/assignmentRoutes');
const eventRoutes = require('./routes/eventRoutes');
const complaintRoutes = require('./routes/complaintRoutes');

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

// Serve uploaded images statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Test route
app.get('/', (req, res) => res.json({ message: 'CampusPulse API running' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/complaints', complaintRoutes);

// Sync DB and start server
db.sequelize.authenticate()
  .then(() => {
    console.log('MySQL connected');
    return db.sequelize.sync({ alter: true });
  })
  .then(() => {
    server.listen(process.env.PORT, () =>
      console.log(`Server running on port ${process.env.PORT}`)
    );
  })
  .catch(err => console.error('DB connection failed:', err));