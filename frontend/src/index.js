import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { observeRequestMetrics, metricsEndpoint } from './metrics';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// This is a mock for the frontend. In a real-world scenario, you would have a separate server for the frontend.
const express = require('express');
const app = express();
app.use(observeRequestMetrics);
app.get('/metrics', metricsEndpoint);
