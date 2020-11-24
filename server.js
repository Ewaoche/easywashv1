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




//logger 
const morgan = require('morgan');



//Load env var
// dotenv.config({ path: './config/config.env' });
dotenv.config('./.env');

//DB Connection
connectDB();
const app = express();

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

//Prevent http param pollution
app.use(hpp());

//Routes files
const auth = require('./routes/auth.route');


//body-parser
app.use(express.json());




if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));

}




//Mount the routers
app.use('/api/v1/auth', auth);


app.use(errorHandler);

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));

//handle unhandled rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    //close server & exit process
    server.close(() => process.exit(1));
});