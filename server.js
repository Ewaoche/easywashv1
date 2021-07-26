const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/error');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cors = require('cors');
const fileupload = require('express-fileupload');





//logger 
const morgan = require('morgan')



//Load env var
// dotenv.config({ path: './config/config.env' });
dotenv.config('./.env');

//DB Connection
connectDB();

//create app
const app = express();

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));

//Set security header
app.use(helmet());

//Mongosanitize
app.use(mongoSanitize());

//Prevent cross site scripting Xss
app.use(xss());

//Rate limiting
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, //10 mins
    max: 100
});

app.use(limiter);

//Enable Cors
app.use(cors());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

//Prevent http param pollution
app.use(hpp());


//file uploading
app.use(fileupload());
//Set Static folder
app.use(express.static(path.join(__dirname, 'public')));

//Routes files
const authRoute = require('./routes/auth.route');

const pricingRoute = require('./routes/pricing.route');

const storelocationRoute = require('./routes/storelocation.route');

const vendorRoute = require('./routes/vendor.route');

const orderRoute = require('./routes/order.route');

const complainRoute = require('./routes/complain.route');

const reviewRoute = require('./routes/review.route');



//body-parser
app.use(express.json());




if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));

};




//Mount the routers
app.use('/api/v1/auth', authRoute);

app.use('/api/v1/pricing', pricingRoute);


app.use('/api/v1/location', storelocationRoute);

app.use('/api/v1/vendor', vendorRoute);

app.use('/api/v1/order', orderRoute);

app.use('/api/v1/complains', complainRoute);

app.use('/api/v1/reviews', reviewRoute);


app.use(errorHandler);



//handle unhandled rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    //close server & exit process
    server.close(() => process.exit(1));
});
