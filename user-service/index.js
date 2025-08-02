const express = require('express');
const cors = require('cors');
require('dotenv').config();


const connectDB = require('./database/connectDB');
const userRoutes = require('./routes/users');
const { observeRequestMetrics, metricsEndpoint } = require('./metrics/metrics');

const app = express();

app.use(cors());
app.use(express.json());

app.use(observeRequestMetrics);
app.use('/api/user', userRoutes);

app.get('/metrics', metricsEndpoint);

const PORT = process.env.PORT || 4000;
connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
