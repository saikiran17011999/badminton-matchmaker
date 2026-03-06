const express = require('express');
const cors = require('cors');
const path = require('path');
const config = require('./config');
const { initDatabase } = require('./models/database');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');
const requestLogger = require('./middleware/requestLogger');

const app = express();

app.use(cors());
app.use(express.json());
app.use(requestLogger);

app.use('/api', routes);

if (config.nodeEnv === 'production') {
  const frontendPath = path.join(__dirname, '../frontend/dist');
  app.use(express.static(frontendPath));

  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(frontendPath, 'index.html'));
    }
  });
} else {
  app.get('/', (req, res) => {
    res.json({
      name: 'Badminton Matchmaking API',
      version: '1.0.0',
      endpoints: {
        health: '/api/health',
        events: '/api/events',
        docs: 'See /docs/api.md for full documentation'
      }
    });
  });
}

app.use(errorHandler);

app.use((req, res) => {
  res.status(404).json({ error: 'Not Found', code: 'NOT_FOUND' });
});

const startServer = async () => {
  try {
    await initDatabase();
    console.log('Database initialized');

    app.listen(config.port, () => {
      console.log(`Server running on http://localhost:${config.port}`);
      console.log(`Environment: ${config.nodeEnv}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

startServer();

module.exports = app;
