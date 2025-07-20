const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./database/connectDB');

const app = express();
app.use(cors());
app.use(express.json());


app.use('/api/commerce/products', require('./routes/products'));
app.use('/api/commerce/orders', require('./routes/order'));

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
