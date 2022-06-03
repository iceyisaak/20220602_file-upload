require('dotenv').config();
require('express-async-errors');

const express = require('express');
const app = express();

// File Upload
const fileUpload = require('express-fileupload');
const cloudinary = require('cloudinary').v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});
// DB
const connectDB = require('./db/connectDB');

// Routers
const productRouter = require('./routes/productRoutes');

const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.use(express.static('./public'));
app.use(express.json());
app.use(fileUpload({
  useTempFiles: true
}));

app.get('/', (req, res) => {
  res.send('<h1>FILE UPLOAD</h1>');
});

app.use('/api/v1/products', productRouter);
app.use('/api/v1/products/uploads', productRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await connectDB(process.env.MONGODB_URI);
    app.listen(port, () => {
      console.log(`Server running on port ${port}...`);
    });
  } catch (err) {
    console.log(err);
  }
};

startServer();