const express = require('express');
const cors = require('cors');
const apiRoutes = require('./routes/api');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Main API routes (uploads, metrics, sandbox creation)
app.use('/api', apiRoutes);

// General health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Primus Local Node Backend Running' });
});

app.listen(PORT, () => {
  console.log(`[Primus-Backend] Local node listening on http://localhost:${PORT}`);
});
