const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cors = require('cors');
const compression = require('compression');
const morgan = require('morgan');
const app = express();
const integrateDB = require('./config/db');
const userRoute = require('./routes/userRoute.js');
const productRoute = require('./routes/productRoute.js');
const orderRoute = require('./routes/orderRoute.js');
const cartRoute = require('./routes/cartRoute.js');
const AppError = require('./utils/appError');
const globalerrorhandler = require('./controllers/errorController.js');
const superAdmin = require('./config/superAdmin');

// Integrate database
integrateDB();

// Create superAdmin
superAdmin();

// Set security HTTP headers
app.use(helmet());

// Enable CORS
app.use(cors());

// Rate limiting: limit each IP to 100 requests per hour
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000, // 1 hour
  message: 'Too many requests from this IP, please try again in an hour!',
});
app.use('/api', limiter);

// Body parser, reading data from body into req.body, and limiting payload size
app.use(express.json({ limit: '10kb' }));

// Data sanitization against NoSQL injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent HTTP parameter pollution
app.use(hpp());

// Enable compression
app.use(compression());

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Serving static files
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

console.log(process.env.NODE_ENV);

// Test Route
app.get('/', (req, res) => {
  res.send(`
    <div style="margin-top: 20px; text-align: center; font-family: Arial, sans-serif;">
      <h1 style="color: blue; font-size: 2em;"><strong>API is Running Successfully</strong></h1>
      <p style="font-size: 1.2em;">The backend is operational and ready to handle requests.</p>
      <p>For API documentation, visit: 
        <a href="https://documenter.getpostman.com/view/37611500/2sAYkBrLYW" target="_blank" style="color: green; font-weight: bold;">
          Postman Collection
        </a>
      </p>
      <script>
        setTimeout(() => {
            window.location.href = "https://documenter.getpostman.com/view/37611500/2sAYkBrLYW";
        }, 3000); // Redirect after 3 seconds
      </script>
    </div>
  `);
});

app.get('/success', (req, res) => {
  res.send('Payment successful.');
});

app.get('/cancel', (req, res) => {
  res.send('Payment canceled.');
});

// Main Routes
app.use('/api/v1/users', userRoute);
app.use('/api/v1/products', productRoute);
app.use('/api/v1/cart', cartRoute);
app.use('/api/v1/orders', orderRoute);

// Unresolved Route
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

// Error handler
app.use(globalerrorhandler);

module.exports = app;
